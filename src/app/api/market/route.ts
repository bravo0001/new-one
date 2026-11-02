import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  let items = db.getCollection('marketItems');
  if (category && category !== 'All') {
    items = items.filter((m: any) => m.category.toLowerCase() === category.toLowerCase());
  }

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const body = await req.json();

    const title = body.title || 'Recyclable Material Lot';
    const category = body.category || 'E-Waste';
    const quantity = body.quantity || '10 kg';
    const priceInr = Number(body.priceInr) || 1500;
    const pointsCost = Number(body.pointsCost) || 0;
    const location = body.location || 'Indore Campus Tech Lab';
    const sellerName = user ? user.name : (body.sellerName || 'Eco Contestant');
    const sellerAvatar = user ? user.avatar : (body.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200');
    const condition = body.condition || 'Good';
    const description = body.description || 'Verified circular material diverted from landfill.';
    const imageUrl = body.imageUrl || 'https://images.unsplash.com/photo-1605557202138-097824c3fdb2?auto=format&fit=crop&q=80&w=600';
    const pickupAvailable = body.pickupAvailable !== undefined ? body.pickupAvailable : true;

    const newItem = {
      id: 'MKT-' + Math.floor(10 + Math.random() * 90),
      title,
      category,
      quantity,
      priceInr,
      pointsCost,
      location,
      sellerName,
      sellerAvatar,
      sellerRole: user ? user.role : 'Contestant',
      condition,
      description,
      imageUrl,
      pickupAvailable,
      postedTime: 'Just now',
      createdAt: new Date().toISOString(),
      sellerUserId: user ? user.id : undefined,
    };

    db.insertItem('marketItems', newItem);

    if (user) {
      db.updateItem('users', user.id, {
        ecoPoints: (user.ecoPoints || 0) + 50,
        communityContributions: (user.communityContributions || 0) + 1,
      });

      db.insertItem('activityFeed', {
        id: 'act-' + Date.now(),
        timestamp: 'Just now',
        userOrOrg: user.name,
        actionText: `Listed "${title}" on EcoMarket (${quantity})`,
        statusBadge: 'Market Active',
        type: 'waste',
      });
    }

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to list marketplace item' },
      { status: 500 }
    );
  }
}

