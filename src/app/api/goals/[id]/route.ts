import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { analyzeGoal } from '@/lib/openrouter';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const goal = await prisma.goal.findUnique({ where: { id } });

    if (!goal) {
      return NextResponse.json({ success: false, error: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    console.error('Get goal error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch goal' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const { title, description, category, targetDate, progress, status, priority, milestones, refreshAI } = data;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (targetDate !== undefined) updateData.targetDate = targetDate ? new Date(targetDate) : null;
    if (progress !== undefined) updateData.progress = progress;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (milestones !== undefined) updateData.milestones = milestones;

    // Refresh AI insights if requested
    if (refreshAI) {
      const currentGoal = await prisma.goal.findUnique({ where: { id } });
      if (currentGoal) {
        updateData.aiInsights = await analyzeGoal({
          title: title || currentGoal.title,
          description: description || currentGoal.description,
          category: category || currentGoal.category,
          progress: progress !== undefined ? progress : currentGoal.progress,
          milestones: milestones || currentGoal.milestones
        });
      }
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    console.error('Update goal error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update goal' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.goal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete goal error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete goal' }, { status: 500 });
  }
}
