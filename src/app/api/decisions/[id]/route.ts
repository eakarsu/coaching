import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { analyzeDecision } from '@/lib/openrouter';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decision = await prisma.decision.findUnique({ where: { id } });

    if (!decision) {
      return NextResponse.json({ success: false, error: 'Decision not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, decision });
  } catch (error) {
    console.error('Get decision error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch decision' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const { title, description, category, options, pros, cons, urgency, importance, status, finalChoice, refreshAI } = data;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (options !== undefined) updateData.options = options;
    if (pros !== undefined) updateData.pros = pros;
    if (cons !== undefined) updateData.cons = cons;
    if (urgency !== undefined) updateData.urgency = urgency;
    if (importance !== undefined) updateData.importance = importance;
    if (status !== undefined) updateData.status = status;
    if (finalChoice !== undefined) updateData.finalChoice = finalChoice;

    if (refreshAI) {
      const currentDecision = await prisma.decision.findUnique({ where: { id } });
      if (currentDecision) {
        updateData.aiAnalysis = await analyzeDecision({
          title: title || currentDecision.title,
          description: description || currentDecision.description,
          options: options || currentDecision.options,
          pros: pros || currentDecision.pros,
          cons: cons || currentDecision.cons,
          urgency: urgency || currentDecision.urgency,
          importance: importance || currentDecision.importance
        });
      }
    }

    const decision = await prisma.decision.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, decision });
  } catch (error) {
    console.error('Update decision error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update decision' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.decision.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete decision error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete decision' }, { status: 500 });
  }
}
