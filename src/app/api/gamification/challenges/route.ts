import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const challenges = db.getCollection('challenges');
  return NextResponse.json(challenges);
}

