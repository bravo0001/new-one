import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const partners = db.getCollection('nearbyPartners');
  return NextResponse.json(partners);
}

