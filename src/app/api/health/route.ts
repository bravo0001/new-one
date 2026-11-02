import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const database = db.getDb();
  return NextResponse.json({
    status: 'ok',
    platform: 'Eco-Smart Civic Waste & Environmental Intelligence Platform',
    timestamp: new Date().toISOString(),
    version: database.meta?.version || '1.0.0',
    stats: {
      users: database.users.length,
      wasteReports: database.wasteReports.length,
      civicReports: database.civicReports.length,
      marketItems: database.marketItems.length,
      surplusFoodListings: database.surplusFoodListings.length,
      socialPosts: database.socialPosts.length,
      communityProjects: database.communityProjects.length,
    },
  });
}

