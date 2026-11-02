import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const contentType = req.headers.get('content-type') || '';

    // Handle JSON Base64 upload
    if (contentType.includes('application/json')) {
      const { image } = await req.json();
      if (!image) {
        return NextResponse.json({ message: 'No image data provided' }, { status: 400 });
      }

      if (image.startsWith('http://') || image.startsWith('https://')) {
        return NextResponse.json({ success: true, url: image });
      }

      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let ext = 'jpg';
      let buffer: Buffer;

      if (matches && matches.length === 3) {
        const mime = matches[1];
        if (mime.includes('png')) ext = 'png';
        else if (mime.includes('webp')) ext = 'webp';
        else if (mime.includes('svg')) ext = 'svg';
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(image, 'base64');
      }

      const filename = `eco-upload-${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);

      const fileUrl = `/uploads/${filename}`;
      return NextResponse.json({ success: true, url: fileUrl });
    }

    // Handle Multipart FormData upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ message: 'No file provided in form-data' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || '.jpg';
      const filename = `eco-upload-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);

      const fileUrl = `/uploads/${filename}`;
      return NextResponse.json({ success: true, url: fileUrl });
    }

    return NextResponse.json({ message: 'Unsupported content type' }, { status: 400 });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { message: error?.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

