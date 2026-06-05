import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Hanya admin yang dapat membuat link' },
        { status: 403 }
      );
    }

    const {
      title,
      url,
      description,
      thumbnail_url,
      category,
      tags,
    } = await request.json();

    if (!title || !url || !category) {
      return NextResponse.json(
        { error: 'Title, URL, dan category wajib diisi' },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'URL tidak valid' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('links')
      .insert({
        title: title.trim(),
        url: url.trim(),
        description: description?.trim() || null,
        thumbnail_url: thumbnail_url || null,
        category: category.trim(),
        tags: tags || [],
        user_id: user.id,
        is_active: true,
        views: 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { data, message: 'Link berhasil dibuat' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
