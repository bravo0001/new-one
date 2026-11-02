import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const demands = db.getCollection('industryDemands');
  return NextResponse.json(demands);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newDemand = {
      id: 'IND-' + Math.floor(100 + Math.random() * 900),
      companyName: body.companyName || 'Industrial Recycling Partner',
      logo: body.logo || '🏢',
      materialNeeded: body.materialNeeded || 'PET Plastic Scrap',
      requiredQuantity: body.requiredQuantity || '500 kg',
      remainingQuantityKg: Number(body.remainingQuantityKg) || 500,
      offerPricePerKgInr: Number(body.offerPricePerKgInr) || 28,
      location: body.location || 'Industrial Area Phase 2',
      pickupAvailable: body.pickupAvailable !== undefined ? body.pickupAvailable : true,
      matchScore: Number(body.matchScore) || 95,
      urgency: body.urgency || 'Normal',
      createdAt: new Date().toISOString(),
    };

    db.insertItem('industryDemands', newDemand);
    return NextResponse.json(newDemand, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to create industry demand' },
      { status: 500 }
    );
  }
}

