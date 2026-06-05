import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880');

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
        { error: 'Hanya admin yang dapat upload file' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 400 }
      );
    }

    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: `Ukuran file tidak boleh lebih dari ${maxFileSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipe file hanya JPEG, PNG, WebP, atau GIF' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const folder = 'thumbnails';

    try {
      // Compress image with Sharp
      const compressedBuffer = await sharp(buffer)
        .resize(parseInt(process.env.THUMBNAIL_WIDTH || '300'), parseInt(process.env.THUMBNAIL_HEIGHT || '200'), {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: parseInt(process.env.THUMBNAIL_QUALITY || '80') })
        .toBuffer();

      const { data, error } = await supabase.storage
        .from('mlebu-link-uploads')
        .upload(`${folder}/${fileName}`, compressedBuffer, {
          contentType: 'image/webp',
          upsert: true,
        });

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from('mlebu-link-uploads')
        .getPublicUrl(`${folder}/${fileName}`);

      return NextResponse.json(
        {
          url: publicUrl,
          fileName: fileName,
          message: 'File berhasil diupload',
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Image processing error:', error);
      return NextResponse.json(
        { error: 'Gagal memproses gambar' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
