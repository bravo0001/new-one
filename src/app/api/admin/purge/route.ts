import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (user && user.role !== 'admin' && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'Admin privileges required' }, { status: 403 });
  }

  try {
    const { sectionKey } = await req.json();
    if (!sectionKey) {
      return NextResponse.json({ message: 'sectionKey is required' }, { status: 400 });
    }

    switch (sectionKey) {
      case 'waste-reports':
        db.purgeCollection('wasteReports');
        break;
      case 'civic-reports':
        db.purgeCollection('civicReports');
        break;
      case 'market-items':
        db.purgeCollection('marketItems');
        break;
      case 'surplus-food':
        db.purgeCollection('surplusFoodListings');
        break;
      case 'community-projects':
        db.purgeCollection('communityProjects');
        break;
      case 'social-posts':
        db.purgeCollection('socialPosts');
        break;
      case 'industry-demands':
        db.purgeCollection('industryDemands');
        break;
      case 'cleanup-operations':
        db.purgeCollection('cleanupOperations');
        break;
      case 'activity-feed':
        db.purgeCollection('activityFeed');
        break;
      default:
        return NextResponse.json({ message: `Unknown sectionKey: ${sectionKey}` }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully purged section: ${sectionKey}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Purge operation failed' },
      { status: 500 }
    );
  }
}

