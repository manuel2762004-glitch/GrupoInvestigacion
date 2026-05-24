import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Mapear campos del frontend al esquema de Supabase
    const dbPayload = {
      nombre: body.title,
      descripcion: body.summary,
      id_linea: body.id_linea || null,
      entidad_financiadora: body.fundingEntity || null,
      fecha_inicio: body.startDate || null,
      fecha_fin: body.endDate || null,
      presupuesto: body.budget ? parseFloat(body.budget) : null,
      estado: body.status || 'PENDING_APPROVAL'
    };

    if (!dbPayload.nombre) {
      return NextResponse.json(
        { error: 'El campo "title" es obligatorio' },
        { status: 400 }
      );
    }

    // Insert new project into Supabase table
    // @ts-ignore
    const { data, error } = await supabase.from('proyectos').insert([dbPayload]).select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Projects API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
