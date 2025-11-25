import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, password: hashed, role: 'registered' },
    });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not defined');

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' },
    );

    return NextResponse.json({ token, user });
  } catch (err: unknown) {
    console.error('retister error:', err);
    const message =
      err instanceof Error
        ? err.message
        : typeof err === 'string'
        ? err
        : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
