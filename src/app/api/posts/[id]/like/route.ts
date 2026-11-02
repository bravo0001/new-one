import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = db.getItemById('socialPosts', id);
  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  const isLiked = !post.isLiked;
  const likesCount = isLiked ? (post.likesCount || 0) + 1 : Math.max(0, (post.likesCount || 0) - 1);

  const updated = db.updateItem('socialPosts', id, {
    isLiked,
    likesCount,
  });

  return NextResponse.json({ success: true, post: updated });
}

