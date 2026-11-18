import { NextRequest, NextResponse } from 'next/server';
import { queryCatalog } from '@/lib/sheets';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const q = searchParams.get('q') || undefined;
    const consoleParam = searchParams.get('console') || undefined;
    const filter = searchParams.get('filter') || undefined;
    const sort = searchParams.get('sort') || undefined;

    const rawPage = searchParams.get('page');
    const rawLimit = searchParams.get('limit');
    const page = rawPage ? parseInt(rawPage, 10) : undefined;
    const limit = rawLimit ? parseInt(rawLimit, 10) : undefined;

    const data = await queryCatalog({
      q,
      console: consoleParam,
      filter,
      sort,
      page: Number.isNaN(page) ? undefined : page,
      limit: Number.isNaN(limit) ? undefined : limit,
    });

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('[GET /api/catalog] Error:', error);
    return NextResponse.json(
      {
        error: 'No pudimos obtener el catálogo desde Google Sheets.',
      },
      { status: 500 }
    );
  }
}
