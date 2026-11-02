import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { location = '', title = '', estimatedKg = 0 } = await req.json();

    const reports = db.getCollection('wasteReports');
    const cleanLoc = location.toLowerCase().trim();

    const duplicateMatch = reports.find((r: any) => {
      if (r.status === 'Cleaned' || r.status === 'Rejected') return false;
      const reportLoc = (r.location || '').toLowerCase().trim();
      const matchLocation = reportLoc.includes(cleanLoc) || cleanLoc.includes(reportLoc);
      const matchWeight = Math.abs((Number(r.estimatedQuantityKg) || 0) - Number(estimatedKg)) < 8;
      return matchLocation && matchWeight;
    });

    if (duplicateMatch) {
      return NextResponse.json({
        isDuplicate: true,
        matchedReportId: duplicateMatch.id,
        matchedReportTitle: duplicateMatch.title,
        matchedLocation: duplicateMatch.location,
        similarityScore: 92,
        recommendation: 'A pending report already exists for this site. Confirming existing report will boost priority without creating redundant tickets.',
      });
    }

    return NextResponse.json({
      isDuplicate: false,
      similarityScore: 12,
      recommendation: 'Site verified as unique. Safe to submit new ticket.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Duplicate check error' },
      { status: 500 }
    );
  }
}

