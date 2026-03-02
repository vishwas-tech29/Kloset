import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ history: [] });
    }

    const history = await prisma.tryOnResult.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ history });
  } catch (error: any) {
    console.error('Failed to fetch try-on history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
