import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  let vouchers = db.getCollection('redeemedVouchers');

  if (user) {
    vouchers = vouchers.filter((v: any) => !v.redeemedByUserId || v.redeemedByUserId === user.id);
  }

  return NextResponse.json(vouchers);
}

