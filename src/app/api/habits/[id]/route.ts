import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { suggestHabitImprovements } from '@/lib/openrouter';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const habit = await prisma.habit.findUnique({ where: { id } });

    if (!habit) {
      return NextResponse.json({ success: false, error: 'Habit not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, habit });
  } catch (error) {
    console.error('Get habit error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch habit' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const { name, description, frequency, category, streak, bestStreak, totalCount, lastCompleted, reminder, status, refreshAI, completeToday } = data;

    const currentHabit = await prisma.habit.findUnique({ where: { id } });
    if (!currentHabit) {
      return NextResponse.json({ success: false, error: 'Habit not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (frequency !== undefined) updateData.frequency = frequency;
    if (category !== undefined) updateData.category = category;
    if (streak !== undefined) updateData.streak = streak;
    if (bestStreak !== undefined) updateData.bestStreak = bestStreak;
    if (totalCount !== undefined) updateData.totalCount = totalCount;
    if (lastCompleted !== undefined) updateData.lastCompleted = lastCompleted ? new Date(lastCompleted) : null;
    if (reminder !== undefined) updateData.reminder = reminder;
    if (status !== undefined) updateData.status = status;

    // Handle completing habit for today
    if (completeToday) {
      const newStreak = currentHabit.streak + 1;
      updateData.streak = newStreak;
      updateData.totalCount = currentHabit.totalCount + 1;
      updateData.lastCompleted = new Date();
      if (newStreak > currentHabit.bestStreak) {
        updateData.bestStreak = newStreak;
      }
    }

    // Refresh AI suggestions if requested
    if (refreshAI) {
      updateData.aiSuggestions = await suggestHabitImprovements({
        name: name || currentHabit.name,
        description: description || currentHabit.description,
        frequency: frequency || currentHabit.frequency,
        streak: (updateData.streak as number) || currentHabit.streak,
        bestStreak: (updateData.bestStreak as number) || currentHabit.bestStreak,
        category: category || currentHabit.category
      });
    }

    const habit = await prisma.habit.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, habit });
  } catch (error) {
    console.error('Update habit error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update habit' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.habit.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete habit error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete habit' }, { status: 500 });
  }
}
