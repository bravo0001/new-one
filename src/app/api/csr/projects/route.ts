import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET() {
  const projects = db.getCollection('csrProjects');
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const body = await req.json();

    const newProject = {
      id: 'CSR-PRJ-' + Math.floor(100 + Math.random() * 900),
      title: body.title || 'Micro-Grant Circular Clean Initiative',
      location: body.location || 'Campus Tech Sector',
      category: body.category || 'Recycling Infrastructure',
      goalKg: Number(body.goalKg) || 5000,
      fundingRequiredInr: Number(body.fundingRequiredInr) || 150000,
      fundingCurrentInr: Number(body.fundingCurrentInr) || 0,
      ngoOperatorName: body.ngoOperatorName || (user ? user.name : 'Eco NGO Partner'),
      ngoVerified: true,
      participantsCount: 1,
      expectedImpact: body.expectedImpact || 'Eliminates open illegal dumping across target zones',
      budgetBreakdown: body.budgetBreakdown || [
        { category: 'Collection Bins & Gear', amountInr: 50000 },
        { category: 'Logistics & Transport', amountInr: 60000 },
        { category: 'Worker Safety & Incentives', amountInr: 40000 },
      ],
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    db.insertItem('csrProjects', newProject);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to create CSR project' },
      { status: 500 }
    );
  }
}

