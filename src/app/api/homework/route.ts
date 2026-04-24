import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateHomework } from '@/lib/openrouter';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    const homework = await prisma.homework.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, homework });
  } catch (error) {
    console.error('Get homework error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch homework' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { subject, topic, gradeLevel, difficulty, numberOfQuestions, userId } = data;

    if (!subject || !topic || !gradeLevel || !userId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const generated = await generateHomework({
      subject,
      topic,
      gradeLevel,
      difficulty: difficulty || 'medium',
      numberOfQuestions: numberOfQuestions || 5
    });

    const homework = await prisma.homework.create({
      data: {
        subject,
        topic,
        gradeLevel,
        difficulty: difficulty || 'medium',
        questions: generated.questions,
        answers: generated.answers,
        hints: generated.hints,
        explanation: generated.explanation,
        aiGenerated: true,
        userId
      }
    });

    return NextResponse.json({ success: true, homework }, { status: 201 });
  } catch (error) {
    console.error('Create homework error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create homework' }, { status: 500 });
  }
}
