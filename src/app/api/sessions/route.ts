import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { summarizeSession } from '@/lib/openrouter';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    const sessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, duration, notes, category, mood, productivity, keyTakeaways, actionItems, userId } = data;

    if (!title || !duration || !notes || !userId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const aiSummary = await summarizeSession({
      title,
      duration,
      notes,
      category: category || 'General',
      keyTakeaways: keyTakeaways || []
    });

    const session = await prisma.session.create({
      data: {
        title,
        duration,
        notes,
        category: category || 'General',
        mood,
        productivity,
        keyTakeaways: keyTakeaways || [],
        aiSummary,
        actionItems: actionItems || [],
        userId
      }
    });

    return NextResponse.json({ success: true, session }, { status: 201 });
  } catch (error) {
    console.error('Create session error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create session' }, { status: 500 });
  }
}
