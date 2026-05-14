import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateCoachSummary } from '@/lib/openrouter';

// POST /api/ai/coach-summary
// Body: { userId: string, timeframeDays?: number (default 7) }
// Aggregates the user's recent moods, active goals, and active habits and
// returns an LLM-generated digest. Mirrors the existing /api/goals/suggest
// pattern (POST + delegate to a helper in src/lib/openrouter.ts).
export async function POST(request: Request) {
  try {
    const { userId, timeframeDays } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const days = typeof timeframeDays === 'number' && timeframeDays > 0 ? timeframeDays : 7;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [moods, goals, habits] = await Promise.all([
      prisma.mood.findMany({
        where: { userId, createdAt: { gte: since } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.goal.findMany({
        where: { userId, status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 25,
      }),
      prisma.habit.findMany({
        where: { userId, status: 'active' },
        orderBy: { streak: 'desc' },
        take: 25,
      }),
    ]);

    const digest = await generateCoachSummary({
      recentMoods: moods.map((m) => ({
        rating: m.rating,
        emotion: m.emotion,
        createdAt: m.createdAt.toISOString(),
      })),
      activeGoals: goals.map((g) => ({
        title: g.title,
        progress: g.progress,
        status: g.status,
      })),
      activeHabits: habits.map((h) => ({
        name: h.name,
        streak: h.streak,
        bestStreak: h.bestStreak,
      })),
      timeframeDays: days,
    });

    return NextResponse.json({
      success: true,
      timeframeDays: days,
      counts: {
        moods: moods.length,
        goals: goals.length,
        habits: habits.length,
      },
      digest,
    });
  } catch (error) {
    console.error('Coach summary error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate coach summary' },
      { status: 500 }
    );
  }
}
