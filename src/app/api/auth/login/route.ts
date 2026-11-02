import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, createToken, hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = db.getCollection('users');
    let user = users.find((u: any) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      // If user logs in with a recognized role pattern for the first time, auto-create account for seamless demo / test access
      const isCandidateAdmin = cleanEmail.includes('admin') || cleanEmail.includes('thakre') || cleanEmail.includes('government') || cleanEmail.includes('gov');
      const isCandidateCsr = cleanEmail.includes('csr') || cleanEmail.includes('corp') || cleanEmail.includes('partner');
      const { hash, salt } = hashPassword(password);
      const playerNumber = isCandidateAdmin ? '#001' : '#' + Math.floor(100 + Math.random() * 899);
      const computedRole = isCandidateAdmin ? 'admin' : isCandidateCsr ? 'corporate' : 'student';

      const newUser = {
        id: 'usr-' + Date.now(),
        name: cleanEmail.split('@')[0].toUpperCase(),
        email: cleanEmail,
        playerNumber,
        role: computedRole,
        ecoPoints: isCandidateAdmin ? 10000 : isCandidateCsr ? 50000 : 100,
        sustainabilityScore: isCandidateAdmin ? 95 : isCandidateCsr ? 99 : 75,
        wasteRecoveredKg: isCandidateAdmin ? 5000 : isCandidateCsr ? 25000 : 10,
        co2SavedKg: isCandidateAdmin ? 3800 : isCandidateCsr ? 18000 : 7,
        communityContributions: isCandidateAdmin ? 80 : isCandidateCsr ? 240 : 2,
        followersCount: isCandidateAdmin ? 456 : isCandidateCsr ? 890 : 10,
        followingCount: 5,
        level: isCandidateAdmin ? 'Government Admin' : isCandidateCsr ? 'Corporate ESG Partner' : 'Citizen Eco Vanguard',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
        passwordHash: hash,
        passwordSalt: salt,
        createdAt: new Date().toISOString(),
      };

      db.insertItem('users', newUser);
      user = newUser;
    } else {
      // Verify password
      const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
      if (!isValid) {
        return NextResponse.json(
          { message: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

    const token = createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const { passwordHash, passwordSalt, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: safeUser,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: error?.message || 'Internal server error during login' },
      { status: 500 }
    );
  }
}

