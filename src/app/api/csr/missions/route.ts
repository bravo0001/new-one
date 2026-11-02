import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const missions = db.getCollection('csrMissions');
  return NextResponse.json(missions);
}

