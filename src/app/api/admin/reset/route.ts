import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (user && user.role !== 'admin' && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'Admin privileges required' }, { status: 403 });
  }

  const resetData = db.resetDatabase();
  return NextResponse.json({
    success: true,
    message: 'EcoVerse database reset to default seed state',
    version: resetData.meta.version,
  });
}

