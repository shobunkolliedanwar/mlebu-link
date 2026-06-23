import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: Request) {

    const body = await req.json();

    const slug = body.name
        .toLowerCase()
        .replace(/\s+/g, '-');

    const { data, error } = await supabaseAdmin
        .from('categories')
        .insert({
            name: body.name,
            slug,
        })
        .select()
        .single();

    if (error) {
        return Response.json(
            { error: error.message },
            { status: 400 }
        );
    }

    return Response.json({ data });
}