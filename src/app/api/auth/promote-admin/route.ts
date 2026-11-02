import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const currentUser = getUserFromRequest(req);
  if (!currentUser) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  // Ensure requester is an admin or allow promotion in development
  if (currentUser.role !== 'admin' && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'Admin privileges required' }, { status: 403 });
  }

  try {
    const { emailOrId } = await req.json();
    if (!emailOrId) {
      return NextResponse.json({ message: 'emailOrId is required' }, { status: 400 });
    }

    const users = db.getCollection('users');
    const target = users.find(
      (u: any) =>
        u.id === emailOrId ||
        u.email.toLowerCase() === emailOrId.toLowerCase()
    );

    if (!target) {
      return NextResponse.json({ message: `User not found: ${emailOrId}` }, { status: 404 });
    }

    const updated = db.updateItem('users', target.id, {
      role: 'admin',
      level: 'Organization Admin (Host)',
    });

    return NextResponse.json({
      success: true,
      message: `User ${target.name} (${target.email}) promoted to Admin successfully.`,
      user: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to promote user' },
      { status: 500 }
    );
  }
}

