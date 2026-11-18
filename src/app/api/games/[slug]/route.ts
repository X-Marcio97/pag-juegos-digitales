import { NextRequest, NextResponse } from 'next/server';
import { getGameBySlug } from '@/lib/sheets';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    slug: string;
  };
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const slug = context.params?.slug;
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug de juego inválido.' },
        { status: 400 }
      );
    }

    const detail = await getGameBySlug(slug);
    if (!detail) {
      return NextResponse.json(
        { error: 'Juego no encontrado en el catálogo.' },
        { status: 404 }
      );
    }

    return NextResponse.json(detail, {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=120, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('[GET /api/games/[slug]] Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener el detalle del juego.' },
      { status: 500 }
    );
  }
}
