import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = getUserFromRequest(req);

  const item = db.getItemById('surplusFoodListings', id);
  if (!item) {
    return NextResponse.json({ message: 'Food listing not found' }, { status: 404 });
  }

  const currentServings = item.availableServings || 0;
  if (currentServings <= 0) {
    return NextResponse.json({ message: 'No servings remaining' }, { status: 400 });
  }

  const newServings = currentServings - 1;
  const newStatus = newServings === 0 ? 'Reserved' : 'Available';

  const updated = db.updateItem('surplusFoodListings', id, {
    availableServings: newServings,
    status: newStatus,
  });

  if (user) {
    db.updateItem('users', user.id, {
      ecoPoints: (user.ecoPoints || 0) + 10,
    });

    db.insertItem('activityFeed', {
      id: 'act-' + Date.now(),
      timestamp: 'Just now',
      userOrOrg: user.name,
      actionText: `Rescued 1 serving of "${item.foodName}" from ${item.restaurantName}`,
      statusBadge: 'Meal Rescued',
      type: 'food',
    });
  }

  return NextResponse.json({
    success: true,
    message: `Reserved 1 serving of ${item.foodName}. Pickup window: ${item.pickupWindow}`,
    food: updated,
  });
}

