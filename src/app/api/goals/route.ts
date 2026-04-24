import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { analyzeGoal } from '@/lib/openrouter';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, goals });
  } catch (error) {
    console.error('Get goals error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, description, category, targetDate, priority, milestones, userId } = data;

    if (!title || !description || !userId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Get AI insights
    const aiInsights = await analyzeGoal({
      title,
      description,
      category: category || 'General',
      progress: 0,
      milestones: milestones || []
    });

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        category: category || 'General',
        targetDate: targetDate ? new Date(targetDate) : null,
        priority: priority || 'medium',
        milestones: milestones || [],
        aiInsights,
        userId
      }
    });

    return NextResponse.json({ success: true, goal }, { status: 201 });
  } catch (error) {
    console.error('Create goal error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create goal' }, { status: 500 });
  }
}
