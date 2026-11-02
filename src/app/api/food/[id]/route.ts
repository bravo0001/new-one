import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const food = db.getItemById('surplusFoodListings', id);
  if (!food) {
    return NextResponse.json({ message: 'Surplus food listing not found' }, { status: 404 });
  }
  return NextResponse.json(food);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = db.deleteItem('surplusFoodListings', id);
  if (!success) {
    return NextResponse.json({ message: 'Listing not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Surplus food listing deleted' });
}

