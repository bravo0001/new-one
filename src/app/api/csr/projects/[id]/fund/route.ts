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
    const { amountInr = 25000 } = await req.json();
    const fundAmount = Number(amountInr);

    const project = db.getItemById('csrProjects', id);
    if (!project) {
      return NextResponse.json({ message: 'CSR Project not found' }, { status: 404 });
    }

    const newCurrentFunding = (project.fundingCurrentInr || 0) + fundAmount;
    const isFullyFunded = newCurrentFunding >= (project.fundingRequiredInr || 100000);
    const newStatus = isFullyFunded ? 'FUNDED' : 'ACTIVE';

    const updated = db.updateItem('csrProjects', id, {
      fundingCurrentInr: newCurrentFunding,
      status: newStatus,
    });

    if (user) {
      db.insertItem('activityFeed', {
        id: 'act-' + Date.now(),
        timestamp: 'Just now',
        userOrOrg: user.name,
        actionText: `Funded ₹${fundAmount.toLocaleString()} to CSR Project "${project.title}"`,
        statusBadge: isFullyFunded ? 'Project Funded' : 'Grant Allocated',
        type: 'ngo',
      });
    }

    return NextResponse.json({
      success: true,
      message: `Allocated ₹${fundAmount.toLocaleString()} to "${project.title}". Status: ${newStatus}`,
      project: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to fund CSR project' },
      { status: 500 }
    );
  }
}

