import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import type { Post } from '@prisma/client';

type PostTree = Post & { children: PostTree[] };

async function getTree(parentId: string | null = null): Promise<PostTree[]> {
  const nodes = await prisma.post.findMany({
    where: { parentId },
    orderBy: { createdAt: 'asc' },
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
