export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';

export async function GET() {
    const { data, error } = await supabase
        .from('categories')
        .select('*');

    return Response.json(
        { data, error },
        {
            headers: {
                'Cache-Control':
                    'no-store, no-cache, must-revalidate, max-age=0',
            },
        }
    );
}