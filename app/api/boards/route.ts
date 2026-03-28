import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let board = await prisma.board.findFirst();
    if (!board) {
      board = await prisma.board.create({
        data: {
          name: 'Default Board',
        },
      });
    }
    return NextResponse.json(board);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get/create board' }, { status: 500 });
  }
}
