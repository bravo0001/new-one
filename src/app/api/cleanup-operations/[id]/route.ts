import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const updates = await req.json();
    const updated = db.updateItem('cleanupOperations', id, updates);
    if (!updated) {
      return NextResponse.json({ message: 'Operation not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, operation: updated });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to update operation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = db.deleteItem('cleanupOperations', id);
  if (!success) {
    return NextResponse.json({ message: 'Operation not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Operation removed' });
}

