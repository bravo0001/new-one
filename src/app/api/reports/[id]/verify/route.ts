import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { approve } = await req.json();
    const report = db.getItemById('wasteReports', id);

    if (!report) {
      return NextResponse.json({ message: 'Waste report not found' }, { status: 404 });
    }

    const updatedStatus = approve ? 'Cleaned' : 'Rejected';
    const updated = db.updateItem('wasteReports', id, {
      status: updatedStatus,
      verifiedAt: new Date().toISOString(),
    });

    // If approved and reported by a user, credit bonus points & stats
    if (approve && report.reportedByUserId) {
      const reportingUser = db.getItemById('users', report.reportedByUserId);
      if (reportingUser) {
        db.updateItem('users', reportingUser.id, {
          ecoPoints: (reportingUser.ecoPoints || 0) + 50,
          wasteRecoveredKg: (reportingUser.wasteRecoveredKg || 0) + (report.estimatedQuantityKg || 12),
          co2SavedKg: (reportingUser.co2SavedKg || 0) + Math.round((report.estimatedQuantityKg || 12) * 1.5),
        });
      }
    }

    // Add activity
    db.insertItem('activityFeed', {
      id: 'act-' + Date.now(),
      timestamp: 'Just now',
      userOrOrg: 'Municipal Field Team',
      actionText: `${approve ? 'Cleaned & verified' : 'Rejected'} report: ${report.title} (${report.location})`,
      statusBadge: approve ? 'Cleanup Complete' : 'Rejected',
      type: 'waste',
    });

    return NextResponse.json({
      success: true,
      message: `Report marked as ${updatedStatus}`,
      report: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to verify waste report' },
      { status: 500 }
    );
  }
}

