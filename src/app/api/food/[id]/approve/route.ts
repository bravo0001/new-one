import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = db.getItemById('surplusFoodListings', id);
  if (!item) {
    return NextResponse.json({ message: 'Listing not found' }, { status: 404 });
  }

  const updated = db.updateItem('surplusFoodListings', id, {
    status: 'Available',
    approvedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, food: updated });
}

