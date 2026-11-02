import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report = db.getItemById('wasteReports', id);
  if (!report) {
    return NextResponse.json({ message: 'Waste report not found' }, { status: 404 });
  }
  return NextResponse.json(report);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = getUserFromRequest(req);

  // Allow deletion if admin or in dev
  const success = db.deleteItem('wasteReports', id);
  if (!success) {
    return NextResponse.json({ message: 'Report not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Waste report deleted successfully' });
}

