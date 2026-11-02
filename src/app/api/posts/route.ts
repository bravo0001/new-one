import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const posts = db.getCollection('socialPosts');
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    const body = await req.json();

    const authorName = user ? user.name : (body.authorName || 'Eco Contestant');
    const authorAvatar = user ? user.avatar : (body.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200');
    const authorBadge = user ? user.level : (body.authorBadge || 'Contestant');
    const postType = body.postType || 'Photo';
    const locationTag = body.locationTag || 'Campus Green Hub';
    const content = body.content || 'Active community sustainability initiative';
    const imageUrl = body.imageUrl;
    const impactBadge = body.impactBadge || '🌱 Waste Diverted';
    const pointsEarned = Number(body.pointsEarned) || 50;

    const newPost = {
      id: 'POST-' + Date.now(),
      authorName,
      authorAvatar,
      authorBadge,
      postType,
      timestamp: 'Just now',
      locationTag,
      content,
      imageUrl,
      impactBadge,
      pointsEarned,
      likesCount: 1,
      isLiked: true,
      comments: [],
      sharesCount: 0,
      createdAt: new Date().toISOString(),
      authorUserId: user ? user.id : undefined,
    };

    db.insertItem('socialPosts', newPost);

    if (user) {
      db.updateItem('users', user.id, {
        ecoPoints: (user.ecoPoints || 0) + 50,
        communityContributions: (user.communityContributions || 0) + 1,
      });

      db.insertItem('activityFeed', {
        id: 'act-' + Date.now(),
        timestamp: 'Just now',
        userOrOrg: user.name,
        actionText: `Published ${postType} to Community Social Feed`,
        statusBadge: 'Social Action',
        type: 'project',
      });
    }

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to create social post' },
      { status: 500 }
    );
  }
}

