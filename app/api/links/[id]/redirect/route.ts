import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const { data } = await supabase
        .from('links')
        .select('url, views')
        .eq('id', id)
        .single();

    if (!data) {
        return NextResponse.json(
            { error: 'Not Found' },
            { status: 404 }
        );
    }
    // 
    await supabase
        .from('links')
        .update({
            views: (data.views || 0) + 1,
        })
        .eq('id', id);

    return NextResponse.json({
        url: data.url,
    });
}