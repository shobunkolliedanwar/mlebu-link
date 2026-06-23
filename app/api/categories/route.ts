import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {

    const { data, error } = await supabase
        .from('categories')
        .select('*');

    return Response.json({
        data,
        error,
    });
}