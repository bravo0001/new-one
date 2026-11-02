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
    const { text, authorName, authorAvatar } = await req.json();
    if (!text) {
      return NextResponse.json({ message: 'Comment text is required' }, { status: 400 });
    }

    const post = db.getItemById('socialPosts', id);
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const newComment = {
      id: 'cmt-' + Date.now(),
      authorName: user ? user.name : (authorName || 'Eco Contestant'),
      authorAvatar: user ? user.avatar : (authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'),
      text,
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
    };

    const comments = Array.isArray(post.comments) ? post.comments : [];
    comments.push(newComment);

    const updated = db.updateItem('socialPosts', id, { comments });

    return NextResponse.json({
      success: true,
      comment: newComment,
      post: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || 'Failed to add comment' },
      { status: 500 }
    );
  }
}

