import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updates = await req.json();
    // Prevent updating security fields directly via profile patch
    delete updates.id;
    delete updates._id;
    delete updates.passwordHash;
    delete updates.passwordSalt;

    const updatedUser = db.updateItem('users', user.id, updates);
    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { passwordHash, passwordSalt, ...safeUser } = updatedUser;
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: safeUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}

