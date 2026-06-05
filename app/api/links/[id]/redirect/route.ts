import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { data } = await supabase
        .from('links')
        .select('url, views')
        .eq('id', params.id)
        .single();

    if (!data) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await supabase
        .from('links')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', params.id);

    return NextResponse.json({ url: data.url });
}