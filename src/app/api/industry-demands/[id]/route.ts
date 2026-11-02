import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const demand = db.getItemById('industryDemands', id);
  if (!demand) {
    return NextResponse.json({ message: 'Industry demand not found' }, { status: 404 });
  }
  return NextResponse.json(demand);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = db.deleteItem('industryDemands', id);
  if (!success) {
    return NextResponse.json({ message: 'Industry demand not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Industry demand removed' });
}

