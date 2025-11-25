import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface AuthPayload extends jwt.JwtPayload {
  userId: string;
}

export async function POST(req: Request) {
  const auth = req.headers.get('authorization');
  if (!auth)
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const token = auth.split(' ')[1];
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;

  const { parentId, operator, right } = await req.json();

  const parent = await prisma.post.findUnique({ where: { id: parentId } });

  if (!parent)
    return NextResponse.json({ error: 'Parent not found' }, { status: 404 });

  const result =
    operator === 'add'
      ? parent.value + right
      : operator === 'sub'
      ? parent.value - right
      : operator === 'mul'
      ? parent.value * right
      : parent.value / right;

  const post = await prisma.post.create({
    data: {
      userId: payload.userId,
      parentId,
      value: result,
    },
  });

  return NextResponse.json(post);
}
