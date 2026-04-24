import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateHomework } from '@/lib/openrouter';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const homework = await prisma.homework.findUnique({ where: { id } });

    if (!homework) {
      return NextResponse.json({ success: false, error: 'Homework not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, homework });
  } catch (error) {
    console.error('Get homework error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch homework' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const { subject, topic, gradeLevel, difficulty, questions, answers, hints, explanation, status, regenerate } = data;

    const updateData: Record<string, unknown> = {};
    if (subject !== undefined) updateData.subject = subject;
    if (topic !== undefined) updateData.topic = topic;
    if (gradeLevel !== undefined) updateData.gradeLevel = gradeLevel;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (questions !== undefined) updateData.questions = questions;
    if (answers !== undefined) updateData.answers = answers;
    if (hints !== undefined) updateData.hints = hints;
    if (explanation !== undefined) updateData.explanation = explanation;
    if (status !== undefined) updateData.status = status;

    if (regenerate) {
      const currentHomework = await prisma.homework.findUnique({ where: { id } });
      if (currentHomework) {
        const generated = await generateHomework({
          subject: subject || currentHomework.subject,
          topic: topic || currentHomework.topic,
          gradeLevel: gradeLevel || currentHomework.gradeLevel,
          difficulty: difficulty || currentHomework.difficulty,
          numberOfQuestions: 5
        });
        updateData.questions = generated.questions;
        updateData.answers = generated.answers;
        updateData.hints = generated.hints;
        updateData.explanation = generated.explanation;
      }
    }

    const homework = await prisma.homework.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, homework });
  } catch (error) {
    console.error('Update homework error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update homework' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.homework.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete homework error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete homework' }, { status: 500 });
  }
}
