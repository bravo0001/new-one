import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const alerts = db.getCollection('alerts');
  return NextResponse.json(alerts);
}

