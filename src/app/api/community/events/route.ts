import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const events = db.getCollection('ecoEvents');
  return NextResponse.json(events);
}

