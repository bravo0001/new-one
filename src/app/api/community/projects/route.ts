import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
  const projects = db.getCollection('communityProjects');
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const body = await req.json();

    const newProject = {
      id: 'PRJ-' + Math.floor(100 + Math.random() * 900),
      title: body.title || 'Campus Upcycling Innovation Project',
      creatorName: user ? user.name : (body.creatorName || 'Student Eco Club'),
      creatorAvatar: user ? user.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      description: body.description || 'Transforming discarded materials into usable campus assets.',
      progressPercentage: Number(body.progressPercentage) || 0,
      materialsTarget: Number(body.materialsTarget) || 100,
      materialsCurrent: Number(body.materialsCurrent) || 0,
      materialsUnit: body.materialsUnit || 'kg plastic',
      studentsJoined: 1,
      reusedImpactLabel: body.reusedImpactLabel || 'Zero Waste Circular Build',
      materialsList: body.materialsList || ['PET Bottles', 'Cardboard', 'Aluminium Scrap'],
      recentActivity: [
        {
          user: user ? user.name : 'Creator',
          action: 'Initiated the community upcycling project',
          time: 'Just now',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    db.insertItem('communityProjects', newProject);

    if (user) {
      db.updateItem('users', user.id, {
        ecoPoints: (user.ecoPoints || 0) + 40,
        communityContributions: (user.communityContributions || 0) + 1,
      });
    }

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to create community project' },
      { status: 500 }
    );
  }
}

