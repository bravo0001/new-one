import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = getUserFromRequest(req);
  try {
    const { quantityKg } = await req.json();
    const qty = Number(quantityKg) || 10;

    const demand = db.getItemById('industryDemands', id);
    if (!demand) {
      return NextResponse.json({ message: 'Industry demand not found' }, { status: 404 });
    }

    const newRemaining = Math.max(0, (demand.remainingQuantityKg || 100) - qty);
    const updated = db.updateItem('industryDemands', id, {
      remainingQuantityKg: newRemaining,
    });

    const totalValueInr = qty * (demand.offerPricePerKgInr || 25);
    const pointsEarned = Math.round(qty * 5);

    if (user) {
      db.updateItem('users', user.id, {
        ecoPoints: (user.ecoPoints || 0) + pointsEarned,
        wasteRecoveredKg: (user.wasteRecoveredKg || 0) + qty,
        co2SavedKg: (user.co2SavedKg || 0) + Math.round(qty * 1.8),
        communityContributions: (user.communityContributions || 0) + 1,
      });

      db.insertItem('activityFeed', {
        id: 'act-' + Date.now(),
        timestamp: 'Just now',
        userOrOrg: user.name,
        actionText: `Supplied ${qty} kg of ${demand.materialNeeded} to ${demand.companyName} (Earned ₹${totalValueInr})`,
        statusBadge: 'Match Complete',
        type: 'industry',
      });
    }

    return NextResponse.json({
      success: true,
      message: `Match confirmed for ${qty} kg. Total payout: ₹${totalValueInr}`,
      demand: updated,
      earnedInr: totalValueInr,
      earnedPoints: pointsEarned,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to offer scrap material' },
      { status: 500 }
    );
  }
}

