import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const users = db.getCollection('users');
  const safeUsers = users.map((u: any) => {
    const { passwordHash, passwordSalt, ...safe } = u;
    return safe;
  });
  return NextResponse.json(safeUsers);
}

