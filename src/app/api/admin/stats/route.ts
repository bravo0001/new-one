import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const database = db.getDb();

  const totalReports = database.wasteReports.length;
  const cleanedReports = database.wasteReports.filter((r: any) => r.status === 'Cleaned').length;
  const totalWasteRecovered = database.wasteReports
    .filter((r: any) => r.status === 'Cleaned')
    .reduce((sum: number, r: any) => sum + (Number(r.estimatedQuantityKg) || 0), 0);

  const totalCivicReports = database.civicReports.length;
  const resolvedCivic = database.civicReports.filter((c: any) => c.status === 'Resolved').length;

  const totalFoodListings = database.surplusFoodListings.length;
  const totalMarketListings = database.marketItems.length;
  const totalUsers = database.users.length;
  const totalPartners = database.nearbyPartners.length;

  // Total CO2 saved calculation: 1.6 kg CO2e per kg diverted waste
  const co2AvoidedKg = Math.round(totalWasteRecovered * 1.6);

  return NextResponse.json({
    totalReports,
    cleanedReports,
    pendingReports: totalReports - cleanedReports,
    wasteDivertedKg: Math.round(totalWasteRecovered),
    wasteDivertedTonnes: Number((totalWasteRecovered / 1000).toFixed(2)),
    co2AvoidedKg,
    totalCivicReports,
    resolvedCivic,
    totalFoodListings,
    totalMarketListings,
    totalUsers,
    totalPartners,
    activeMissions: database.csrMissions.length,
    activeProjects: database.communityProjects.length,
  });
}

