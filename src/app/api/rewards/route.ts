import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const rewards = db.getCollection('rewards');
  return NextResponse.json(rewards);
}

