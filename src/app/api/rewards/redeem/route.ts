import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const body = await req.json();

    const title = body.title || 'Eco Merchant Discount Voucher';
    const businessName = body.businessName || 'Green Partner Cafe';
    const pointsCost = Number(body.pointsCost) || 100;
    const discountInr = Number(body.discountInr) || 50;

    // Check user points if logged in
    if (user) {
      if ((user.ecoPoints || 0) < pointsCost) {
        return NextResponse.json(
          { message: `Insufficient Eco Points. You have ${user.ecoPoints || 0}, but need ${pointsCost}.` },
          { status: 400 }
        );
      }

      // Deduct points
      db.updateItem('users', user.id, {
        ecoPoints: (user.ecoPoints || 0) - pointsCost,
      });
    }

    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const voucherCode = `ECO-${Math.floor(1000 + Math.random() * 9000)}-${randomSuffix}`;
    const expiryDate = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0];

    const voucher = {
      id: 'VOUCH-' + Date.now(),
      voucherCode,
      businessName,
      businessLogo: '🎁',
      rewardTitle: title,
      discountInr,
      pointsCost,
      redeemedDate: 'Today',
      expiryDate,
      status: 'Active',
      qrCodePlaceholder: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(voucherCode)}`,
      redeemedByUserId: user ? user.id : undefined,
      createdAt: new Date().toISOString(),
    };

    db.insertItem('redeemedVouchers', voucher);

    if (user) {
      db.insertItem('activityFeed', {
        id: 'act-' + Date.now(),
        timestamp: 'Just now',
        userOrOrg: user.name,
        actionText: `Redeemed voucher "${title}" for ${businessName} (-${pointsCost} pts)`,
        statusBadge: 'Voucher Active',
        type: 'project',
      });
    }

    return NextResponse.json({
      success: true,
      message: `Voucher ${voucherCode} claimed successfully!`,
      voucher,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to redeem reward' },
      { status: 500 }
    );
  }
}

