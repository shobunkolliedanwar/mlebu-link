export const dynamic = 'force-dynamic';

import { supabase } from '@/lib/supabase';

export async function GET() {
    const { data, error, count } = await supabase
        .from('categories')
        .select('*', { count: 'exact' });

    return Response.json({
        count,
        data,
        error,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    });
}