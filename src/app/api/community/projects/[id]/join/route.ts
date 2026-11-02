import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = getUserFromRequest(req);

  const project = db.getItemById('communityProjects', id);
  if (!project) {
    return NextResponse.json({ message: 'Project not found' }, { status: 404 });
  }

  const updatedJoined = (project.studentsJoined || 0) + 1;
  const recentActivity = Array.isArray(project.recentActivity) ? project.recentActivity : [];
  recentActivity.unshift({
    user: user ? user.name : 'Eco Volunteer',
    action: 'Joined the circular build crew',
    time: 'Just now',
  });

  const updated = db.updateItem('communityProjects', id, {
    studentsJoined: updatedJoined,
    recentActivity,
  });

  if (user) {
    db.updateItem('users', user.id, {
      ecoPoints: (user.ecoPoints || 0) + 20,
    });
  }

  return NextResponse.json({
    success: true,
    message: `Joined project "${project.title}"! +20 Eco Points awarded.`,
    project: updated,
  });
}

