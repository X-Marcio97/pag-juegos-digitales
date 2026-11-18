import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { CATALOG_CACHE_TAG } from '@/lib/config';
import { clearCatalogMemoryCache } from '@/lib/sheets';

export const dynamic = 'force-dynamic';

async function extractProvidedSecret(request: NextRequest): Promise<string> {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }

  const headerSecret = request.headers.get('x-revalidate-secret');
  if (headerSecret) {
    return headerSecret.trim();
  }

  const querySecret = request.nextUrl.searchParams.get('secret');
  if (querySecret) {
    return querySecret.trim();
  }

  try {
    const body = (await request.json()) as { secret?: unknown };
    if (typeof body?.secret === 'string') {
      return body.secret.trim();
    }
  } catch {
    // Empty or non-JSON body is allowed when no secret is required
  }

  return '';
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.REVALIDATE_SECRET?.trim();

  if (expectedSecret) {
    const provided = await extractProvidedSecret(request);
    if (provided !== expectedSecret) {
      return NextResponse.json(
        { error: 'No autorizado. Token de revalidación inválido.' },
        { status: 401 }
      );
    }
  }

  clearCatalogMemoryCache();
  revalidateTag(CATALOG_CACHE_TAG);

  return NextResponse.json(
    {
      revalidated: true,
      tag: CATALOG_CACHE_TAG,
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
