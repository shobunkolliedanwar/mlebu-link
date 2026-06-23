import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    console.log(data);
    console.log(error);

    return NextResponse.json({
        data,
        error
    });
}