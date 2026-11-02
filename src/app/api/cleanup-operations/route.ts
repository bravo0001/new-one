import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const ops = db.getCollection('cleanupOperations');
  return NextResponse.json(ops);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newOp = {
      id: 'CLN-' + Math.floor(100 + Math.random() * 900),
      location: body.location || 'Sector 7 Central Plaza',
      priority: body.priority || 'High',
      estimatedWasteKg: Number(body.estimatedWasteKg) || 150,
      assignedTeam: body.assignedTeam || 'Eco Response Unit Alpha',
      status: body.status || 'Assigned',
      createdAt: new Date().toISOString(),
    };

    db.insertItem('cleanupOperations', newOp);
    return NextResponse.json(newOp, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to create cleanup operation' },
      { status: 500 }
    );
  }
}

