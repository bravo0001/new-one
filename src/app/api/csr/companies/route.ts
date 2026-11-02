import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const companies = db.getCollection('csrCompanies');
  return NextResponse.json(companies);
}

