import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { suggestHabitImprovements } from '@/lib/openrouter';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    const habits = await prisma.habit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, habits });
  } catch (error) {
    console.error('Get habits error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch habits' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, description, frequency, category, reminder, userId } = data;

    if (!name || !description || !userId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const aiSuggestions = await suggestHabitImprovements({
      name,
      description,
      frequency: frequency || 'daily',
      streak: 0,
      bestStreak: 0,
      category: category || 'General'
    });

    const habit = await prisma.habit.create({
      data: {
        name,
        description,
        frequency: frequency || 'daily',
        category: category || 'General',
        reminder,
        aiSuggestions,
        userId
      }
    });

    return NextResponse.json({ success: true, habit }, { status: 201 });
  } catch (error) {
    console.error('Create habit error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create habit' }, { status: 500 });
  }
}
