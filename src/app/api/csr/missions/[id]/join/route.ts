import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = getUserFromRequest(req);

  const mission = db.getItemById('csrMissions', id);
  if (!mission) {
    return NextResponse.json({ message: 'CSR Mission not found' }, { status: 404 });
  }

  const updatedPlayers = (mission.playersCount || 0) + 1;
  const updated = db.updateItem('csrMissions', id, {
    playersCount: updatedPlayers,
    isJoined: true,
  });

  if (user) {
    db.updateItem('users', user.id, {
      ecoPoints: (user.ecoPoints || 0) + (mission.ecoPointsReward || 50),
    });

    db.insertItem('activityFeed', {
      id: 'act-' + Date.now(),
      timestamp: 'Just now',
      userOrOrg: user.name,
      actionText: `Joined CSR Mission "${mission.title}" sponsored by ${mission.sponsorName}`,
      statusBadge: 'Mission Enrolled',
      type: 'project',
    });
  }

  return NextResponse.json({
    success: true,
    message: `Joined mission "${mission.title}"! Reward: +${mission.ecoPointsReward || 50} Eco Points.`,
    mission: updated,
  });
}

