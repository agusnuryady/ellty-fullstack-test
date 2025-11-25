import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import type { Post } from '@prisma/client';

type PostTree = Post & { children: PostTree[] };

async function getTree(parentId: string | null = null): Promise<PostTree[]> {
  const nodes = await prisma.post.findMany({
    where: { parentId },
    orderBy: { createdAt: 'asc' },
    include: {
      user: true, // 👈 IMPORTANT
    },
  });

  return Promise.all(
    nodes.map(async (node) => ({
      ...node,
      children: await getTree(node.id),
    })),
  );
}

export async function GET() {
  const tree = await getTree(null);
  return NextResponse.json(tree);
}

export async function POST(req: Request) {
  const auth = req.headers.get('authorization');
  if (!auth)
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const token = auth.split(' ')[1];
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
  };

  const { value, parentId } = await req.json();

  const post = await prisma.post.create({
    data: {
      userId: payload.userId,
      value,
      parentId: parentId || null,
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(req: Request) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = auth.replace('Bearer ', '');
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      username: string;
    };

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (post.userId !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete post
    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
