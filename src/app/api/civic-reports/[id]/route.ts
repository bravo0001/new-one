import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report = db.getItemById('civicReports', id);
  if (!report) {
    return NextResponse.json({ message: 'Civic report not found' }, { status: 404 });
  }
  return NextResponse.json(report);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const updates = await req.json();
    const updated = db.updateItem('civicReports', id, updates);
    if (!updated) {
      return NextResponse.json({ message: 'Civic report not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, report: updated });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to update civic report' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = db.deleteItem('civicReports', id);
  if (!success) {
    return NextResponse.json({ message: 'Civic report not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: 'Civic report deleted' });
}

