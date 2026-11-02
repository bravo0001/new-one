import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const reports = db.getCollection('civicReports');
  return NextResponse.json(reports);
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const body = await req.json();

    const title = body.title || 'Civic Infrastructure Grievance';
    const category = body.category || 'Illegal Dumping';
    const location = body.location || 'Sector 4, Main Drainage';
    const severity = body.severity || 'High';
    const authorityTag = body.authorityTag || 'Municipal Sanitation Ward 12';
    const imageUrl = body.imageUrl || 'https://images.unsplash.com/photo-1611288875685-147055a62d19?auto=format&fit=crop&q=80&w=600';

    const newReport = {
      id: 'CIV-' + Math.floor(100 + Math.random() * 900),
      title,
      category,
      location,
      severity,
      confirmationsCount: 1,
      status: 'Reported',
      authorityTag,
      reportedTime: 'Just now',
      imageUrl,
      reportedByUserId: user ? user.id : undefined,
      createdAt: new Date().toISOString(),
    };

    db.insertItem('civicReports', newReport);

    if (user) {
      db.updateItem('users', user.id, {
        ecoPoints: (user.ecoPoints || 0) + 15,
        communityContributions: (user.communityContributions || 0) + 1,
      });

      db.insertItem('activityFeed', {
        id: 'act-' + Date.now(),
        timestamp: 'Just now',
        userOrOrg: user.name,
        actionText: `Logged civic grievance: ${title} at ${location}`,
        statusBadge: 'Civic SLA Active',
        type: 'ngo',
      });
    }

    return NextResponse.json(newReport, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to submit civic issue' },
      { status: 500 }
    );
  }
}

