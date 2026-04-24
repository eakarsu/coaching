import { NextResponse } from 'next/server';
import { suggestGoals } from '@/lib/openrouter';

export async function POST(request: Request) {
  try {
    const { category, interests, currentGoals, timeframe } = await request.json();

    if (!category || !interests || !timeframe) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const suggestions = await suggestGoals({
      category,
      interests,
      currentGoals: currentGoals || [],
      timeframe
    });

    return NextResponse.json({ success: true, suggestions });
  } catch (error) {
    console.error('Goal suggestion error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate suggestions' }, { status: 500 });
  }
}
