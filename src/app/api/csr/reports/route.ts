import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const reports = db.getCollection('csrReports');
  return NextResponse.json(reports);
}

