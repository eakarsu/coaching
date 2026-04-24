import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { analyzeDecision } from '@/lib/openrouter';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    const decisions = await prisma.decision.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, decisions });
  } catch (error) {
    console.error('Get decisions error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch decisions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, description, category, options, pros, cons, urgency, importance, userId } = data;

    if (!title || !description || !userId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const aiAnalysis = await analyzeDecision({
      title,
      description,
      options: options || [],
      pros: pros || [],
      cons: cons || [],
      urgency: urgency || 'medium',
      importance: importance || 'medium'
    });

    const decision = await prisma.decision.create({
      data: {
        title,
        description,
        category: category || 'General',
        options: options || [],
        pros: pros || [],
        cons: cons || [],
        urgency: urgency || 'medium',
        importance: importance || 'medium',
        aiAnalysis,
        userId
      }
    });

    return NextResponse.json({ success: true, decision }, { status: 201 });
  } catch (error) {
    console.error('Create decision error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create decision' }, { status: 500 });
  }
}
