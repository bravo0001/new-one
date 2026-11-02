import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = db.getItemById('marketItems', id);
  if (!item) {
    return NextResponse.json({ message: 'Market item not found' }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = db.deleteItem('marketItems', id);
  if (!success) {
    return NextResponse.json({ message: 'Market item not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Market item deleted' });
}

