import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { summarizeSession } from '@/lib/openrouter';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await prisma.session.findUnique({ where: { id } });

    if (!session) {
      return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch session' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const { title, duration, notes, category, mood, productivity, keyTakeaways, actionItems, refreshAI } = data;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (duration !== undefined) updateData.duration = duration;
    if (notes !== undefined) updateData.notes = notes;
    if (category !== undefined) updateData.category = category;
    if (mood !== undefined) updateData.mood = mood;
    if (productivity !== undefined) updateData.productivity = productivity;
    if (keyTakeaways !== undefined) updateData.keyTakeaways = keyTakeaways;
    if (actionItems !== undefined) updateData.actionItems = actionItems;

    if (refreshAI) {
      const currentSession = await prisma.session.findUnique({ where: { id } });
      if (currentSession) {
        updateData.aiSummary = await summarizeSession({
          title: title || currentSession.title,
          duration: duration || currentSession.duration,
          notes: notes || currentSession.notes,
          category: category || currentSession.category,
          keyTakeaways: keyTakeaways || currentSession.keyTakeaways
        });
      }
    }

    const session = await prisma.session.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error('Update session error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update session' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.session.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete session error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete session' }, { status: 500 });
  }
}
