import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { analyzeMood } from '@/lib/openrouter';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    const moods = await prisma.mood.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, moods });
  } catch (error) {
    console.error('Get moods error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch moods' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { rating, emotion, notes, factors, activities, energy, stress, sleep, userId } = data;

    if (!rating || !emotion || !userId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const aiResult = await analyzeMood({
      rating,
      emotion,
      notes: notes || '',
      factors: factors || [],
      activities: activities || [],
      energy: energy || 5,
      stress: stress || 5,
      sleep: sleep || 5
    });

    const mood = await prisma.mood.create({
      data: {
        rating,
        emotion,
        notes,
        factors: factors || [],
        activities: activities || [],
        energy,
        stress,
        sleep,
        aiAnalysis: aiResult.analysis,
        suggestions: aiResult.suggestions,
        userId
      }
    });

    return NextResponse.json({ success: true, mood }, { status: 201 });
  } catch (error) {
    console.error('Create mood error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create mood entry' }, { status: 500 });
  }
}
