import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
export async function POST(req: Request) {

    const body = await req.json();

    const { name } = body;

    const slug = name
        .toLowerCase()
        .replace(/\s+/g, '-');

    const { data, error } = await supabase
        .from('categories')
        .insert({
            name,
            slug
        })
        .select()
        .single();

    if (error) {
        return Response.json(
            { error: error.message },
            { status: 400 }
        );
    }

    return Response.json({
        data
    });
}