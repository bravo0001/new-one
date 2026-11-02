import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const database = db.getDb();
  return NextResponse.json(database.telemetry);
}

