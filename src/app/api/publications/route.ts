import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Mapear campos del frontend al esquema de Supabase
    const dbPayload = {
      titulo: body.title,
      autores: Array.isArray(body.authors) ? body.authors.join(', ') : body.authors,
      id_proyecto: body.id_proyecto || null,
      doi: body.doi || null,
      estado: body.status || 'DRAFT'
    };

    if (!dbPayload.titulo || !dbPayload.autores) {
      return NextResponse.json(
        { error: 'Los campos "title" y "authors" son obligatorios' },
        { status: 400 }
      );
    }

    // Insert new publication into Supabase table
    // @ts-ignore
    const { data, error } = await supabase.from('publicaciones').insert([dbPayload]).select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Publications API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, estado, doi } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'El campo "id" de la publicación es obligatorio' },
        { status: 400 }
      );
    }

    const updatePayload: any = {};
    if (estado !== undefined) updatePayload.estado = estado;
    if (doi !== undefined) updatePayload.doi = doi;

    // @ts-ignore
    const { data, error } = await (supabase as any)
      .from('publicaciones')
      .update(updatePayload)
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Publications API PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
