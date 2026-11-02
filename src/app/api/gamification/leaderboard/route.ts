import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const users = db.getCollection('users');
  const mockLeaderboard = db.getCollection('leaderboard');

  // Convert registered users to leaderboard format
  const registeredLeaderboard = users.map((u: any) => ({
    rank: 1,
    playerNumber: u.playerNumber || '#456',
    name: u.name,
    avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    points: u.ecoPoints || 0,
    score: u.sustainabilityScore || 75,
    wasteRecoveredKg: u.wasteRecoveredKg || 0,
    co2SavedKg: u.co2SavedKg || 0,
    badge: u.level || 'Contestant',
    category: u.role === 'admin' ? 'Administrator' : u.role === 'business' ? 'Business' : u.role === 'ngo' ? 'NGO' : 'Student',
  }));

  // Merge and deduplicate by name or playerNumber
  const combined = [...registeredLeaderboard, ...mockLeaderboard];
  const seen = new Set();
  const deduped: any[] = [];

  for (const item of combined) {
    const key = item.name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(item);
    }
  }

  // Sort by points descending
  deduped.sort((a, b) => b.points - a.points);

  // Re-rank
  const ranked = deduped.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  return NextResponse.json(ranked);
}

