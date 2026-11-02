import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = getUserFromRequest(req);

  const challenge = db.getItemById('challenges', id);
  if (!challenge) {
    return NextResponse.json({ message: 'Challenge not found' }, { status: 404 });
  }

  const updated = db.updateItem('challenges', id, {
    isJoined: true,
    participantsCount: (challenge.participantsCount || 0) + 1,
  });

  if (user) {
    db.updateItem('users', user.id, {
      ecoPoints: (user.ecoPoints || 0) + 50,
    });

    db.insertItem('activityFeed', {
      id: 'act-' + Date.now(),
      timestamp: 'Just now',
      userOrOrg: user.name,
      actionText: `Joined Campus Challenge: "${challenge.title}"`,
      statusBadge: 'Challenge Joined',
      type: 'waste',
    });
  }

  return NextResponse.json({
    success: true,
    message: `Joined challenge "${challenge.title}"! +50 Eco Points awarded.`,
    challenge: updated,
  });
}

