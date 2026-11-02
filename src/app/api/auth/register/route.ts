import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, createToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role = 'student' } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = db.getCollection('users');
    const existing = users.find((u: any) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const { hash, salt } = hashPassword(password);
    const playerNumber = '#' + Math.floor(100 + Math.random() * 899);

    const newUser = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      playerNumber,
      role: role.toLowerCase(),
      ecoPoints: 50, // Welcome bonus points
      sustainabilityScore: 70,
      wasteRecoveredKg: 0,
      co2SavedKg: 0,
      communityContributions: 0,
      followersCount: 0,
      followingCount: 0,
      level: 'Rookie Contestant (Tier 1)',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: new Date().toISOString(),
    };

    db.insertItem('users', newUser);

    const token = createToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const { passwordHash, passwordSalt, ...safeUser } = newUser;

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        token,
        user: safeUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error?.message || 'Internal server error during registration' },
      { status: 500 }
    );
  }
}

