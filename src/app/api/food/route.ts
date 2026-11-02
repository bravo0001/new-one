import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const category = searchParams.get('category');

  let items = db.getCollection('surplusFoodListings');

  if (status) {
    items = items.filter((f: any) => f.status.toLowerCase() === status.toLowerCase());
  }
  if (category && category !== 'All') {
    items = items.filter((f: any) => f.category.toLowerCase() === category.toLowerCase());
  }

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const body = await req.json();

    const restaurantName = body.restaurantName || (user ? user.name : 'Campus Green Cafeteria');
    const restaurantLogo = body.restaurantLogo || (user ? user.avatar : '🍱');
    const foodName = body.foodName || 'Surplus Fresh Meal Box';
    const category = body.category || 'Meals';
    const quantityLabel = body.quantityLabel || '8 Servings';
    const originalPriceInr = Number(body.originalPriceInr) || 160;
    const discountedPriceInr = Number(body.discountedPriceInr) || 49;
    const discountPercentage = Math.round(((originalPriceInr - discountedPriceInr) / originalPriceInr) * 100);
    const pickupWindow = body.pickupWindow || 'Today, 8:00 PM - 9:30 PM';
    const availableServings = Number(body.availableServings) || 8;
    const location = body.location || 'Central Dining Block A';
    const bestBeforeInfo = body.bestBeforeInfo || 'Freshly prepared, consume within 4 hours';
    const imageUrl = body.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600';

    const newFood = {
      id: 'FOOD-' + Math.floor(2000 + Math.random() * 800),
      restaurantName,
      restaurantLogo,
      foodName,
      category,
      quantityLabel,
      originalPriceInr,
      discountedPriceInr,
      discountPercentage,
      pickupWindow,
      availableServings,
      location,
      status: 'Available',
      bestBeforeInfo,
      imageUrl,
      createdAt: new Date().toISOString(),
      listedByUserId: user ? user.id : undefined,
    };

    db.insertItem('surplusFoodListings', newFood);

    if (user) {
      db.updateItem('users', user.id, {
        ecoPoints: (user.ecoPoints || 0) + 30,
        communityContributions: (user.communityContributions || 0) + 1,
      });

      db.insertItem('activityFeed', {
        id: 'act-' + Date.now(),
        timestamp: 'Just now',
        userOrOrg: user.name,
        actionText: `Listed surplus meals "${foodName}" on EcoFood (${quantityLabel})`,
        statusBadge: 'Food Saved',
        type: 'food',
      });
    }

    return NextResponse.json(newFood, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to list surplus food' },
      { status: 500 }
    );
  }
}

