import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const severity = searchParams.get('severity');

  let reports = db.getCollection('wasteReports');

  if (status) {
    reports = reports.filter((r: any) => r.status.toLowerCase() === status.toLowerCase());
  }
  if (severity) {
    reports = reports.filter((r: any) => r.severity.toLowerCase() === severity.toLowerCase());
  }

  return NextResponse.json(reports);
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const body = await req.json();

    const title = body.title || 'Civic Waste Accumulation';
    const location = body.location || 'Campus Tech Hub';
    const detectedMaterials = body.detectedMaterials || ['Mixed Plastic Debris', 'Cardboard'];
    const estimatedQuantityKg = Number(body.estimatedQuantityKg) || 12.0;
    const severity = body.severity || (estimatedQuantityKg > 15 ? 'High' : estimatedQuantityKg > 5 ? 'Medium' : 'Low');
    const recyclablePercentage = Number(body.recyclablePercentage) || 75;
    const imageUrl = body.imageUrl || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800';
    const nearestCollectionPoint = body.nearestCollectionPoint || 'Eco Hub #2';
    const distanceMeters = Number(body.distanceMeters) || 240;
    const pointsAwarded = Number(body.pointsAwarded) || 10;
    const reportedBy = user ? user.name : (body.reportedBy || 'Eco Contestant');

    // Duplicate detection logic
    const existingReports = db.getCollection('wasteReports');
    const isDuplicate = existingReports.some(
      (r: any) =>
        r.status !== 'Cleaned' &&
        r.location.toLowerCase() === location.toLowerCase() &&
        Math.abs(r.estimatedQuantityKg - estimatedQuantityKg) < 5
    );

    const newReport = {
      id: 'RPT-' + Math.floor(1000 + Math.random() * 9000),
      title,
      location,
      detectedMaterials,
      estimatedQuantityKg,
      severity,
      recyclablePercentage,
      status: 'Reported',
      reportedBy,
      reportedByUserId: user ? user.id : undefined,
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
      pointsAwarded,
      imageUrl,
      nearestCollectionPoint,
      distanceMeters,
      isDuplicate,
    };

    db.insertItem('wasteReports', newReport);

    // Update user stats if authenticated
    if (user) {
      const currentPts = user.ecoPoints || 0;
      const currentScore = user.sustainabilityScore || 70;
      const currentContributions = user.communityContributions || 0;

      db.updateItem('users', user.id, {
        ecoPoints: currentPts + pointsAwarded,
        sustainabilityScore: currentScore + 5,
        communityContributions: currentContributions + 1,
      });

      // Add to activity feed
      db.insertItem('activityFeed', {
        id: 'act-' + Date.now(),
        timestamp: 'Just now',
        userOrOrg: user.name,
        actionText: `Reported waste at ${location} (${estimatedQuantityKg} kg)`,
        statusBadge: 'Verified Submission',
        type: 'waste',
      });
    }

    return NextResponse.json(newReport, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting waste report:', error);
    return NextResponse.json(
      { message: error?.message || 'Failed to submit waste report' },
      { status: 500 }
    );
  }
}

