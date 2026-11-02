import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = getUserFromRequest(req);
  try {
    const { itemLabel = 'Scrap Materials', amount = 10 } = await req.json();

    const project = db.getItemById('communityProjects', id);
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    const newCurrent = (project.materialsCurrent || 0) + Number(amount);
    const target = project.materialsTarget || 100;
    const progressPercentage = Math.min(100, Math.round((newCurrent / target) * 100));

    const recentActivity = Array.isArray(project.recentActivity) ? project.recentActivity : [];
    recentActivity.unshift({
      user: user ? user.name : 'Eco Supporter',
      action: `Donated ${itemLabel} (${amount} ${project.materialsUnit || 'units'})`,
      time: 'Just now',
    });

    const updated = db.updateItem('communityProjects', id, {
      materialsCurrent: newCurrent,
      progressPercentage,
      recentActivity,
    });

    if (user) {
      db.updateItem('users', user.id, {
        ecoPoints: (user.ecoPoints || 0) + 30,
        wasteRecoveredKg: (user.wasteRecoveredKg || 0) + Number(amount),
        communityContributions: (user.communityContributions || 0) + 1,
      });

      db.insertItem('activityFeed', {
        id: 'act-' + Date.now(),
        timestamp: 'Just now',
        userOrOrg: user.name,
        actionText: `Donated ${amount} ${project.materialsUnit} to "${project.title}"`,
        statusBadge: 'Material Reused',
        type: 'project',
      });
    }

    return NextResponse.json({
      success: true,
      message: `Donation of ${itemLabel} recorded! +30 Eco Points awarded.`,
      project: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to donate materials' },
      { status: 500 }
    );
  }
}

