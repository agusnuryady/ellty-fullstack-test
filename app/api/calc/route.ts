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

  const { parentId, op, right } = await req.json();

  // Validate
  if (!['+', '-', '*', '/'].includes(op)) {
    return NextResponse.json({ error: 'Invalid operator' }, { status: 400 });
  }

  if (typeof right !== 'number') {
    return NextResponse.json(
      { error: 'Right argument must be a number' },
      { status: 400 },
    );
  }

  // Fetch parent post
  const parentPost = await prisma.post.findUnique({
    where: { id: parentId },
  });

  if (!parentPost) {
    return NextResponse.json(
      { error: 'Parent post not found' },
      { status: 404 },
    );
  }

  // Compute new value
  let newValue: number;

  switch (op) {
    case '+':
      newValue = parentPost.value + right;
      break;
    case '-':
      newValue = parentPost.value - right;
      break;
    case '*':
      newValue = parentPost.value * right;
      break;
    case '/':
      newValue = parentPost.value / right;
      break;
    default:
      return NextResponse.json({ error: 'Invalid operator' }, { status: 400 });
  }

  // Create new post
  const post = await prisma.post.create({
    data: {
      value: newValue,
      parentId: parentId,
      userId: payload.userId,
    },
  });

  return NextResponse.json(post);
}
