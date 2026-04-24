import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { predictOutcome } from '@/lib/openrouter';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    const predictions = await prisma.prediction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, predictions });
  } catch (error) {
    console.error('Get predictions error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch predictions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, description, category, scenario, factors, timeframe, userId } = data;

    if (!title || !description || !scenario || !userId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const aiResult = await predictOutcome({
      title,
      description,
      scenario,
      factors: factors || [],
      category: category || 'General',
      timeframe: timeframe || 'Unknown'
    });

    const prediction = await prisma.prediction.create({
      data: {
        title,
        description,
        category: category || 'General',
        scenario,
        factors: factors || [],
        probability: aiResult.probability,
        timeframe,
        confidence: aiResult.confidence,
        aiPrediction: aiResult.prediction,
        userId
      }
    });

    return NextResponse.json({ success: true, prediction }, { status: 201 });
  } catch (error) {
    console.error('Create prediction error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create prediction' }, { status: 500 });
  }
}
