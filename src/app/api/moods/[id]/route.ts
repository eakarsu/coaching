import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { analyzeMood } from '@/lib/openrouter';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mood = await prisma.mood.findUnique({ where: { id } });

    if (!mood) {
      return NextResponse.json({ success: false, error: 'Mood entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, mood });
  } catch (error) {
    console.error('Get mood error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch mood' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const { rating, emotion, notes, factors, activities, energy, stress, sleep, refreshAI } = data;

    const updateData: Record<string, unknown> = {};
    if (rating !== undefined) updateData.rating = rating;
    if (emotion !== undefined) updateData.emotion = emotion;
    if (notes !== undefined) updateData.notes = notes;
    if (factors !== undefined) updateData.factors = factors;
    if (activities !== undefined) updateData.activities = activities;
    if (energy !== undefined) updateData.energy = energy;
    if (stress !== undefined) updateData.stress = stress;
    if (sleep !== undefined) updateData.sleep = sleep;

    if (refreshAI) {
      const currentMood = await prisma.mood.findUnique({ where: { id } });
      if (currentMood) {
        const aiResult = await analyzeMood({
          rating: rating || currentMood.rating,
          emotion: emotion || currentMood.emotion,
          notes: notes || currentMood.notes || '',
          factors: factors || currentMood.factors,
          activities: activities || currentMood.activities,
          energy: energy || currentMood.energy || 5,
          stress: stress || currentMood.stress || 5,
          sleep: sleep || currentMood.sleep || 5
        });
        updateData.aiAnalysis = aiResult.analysis;
        updateData.suggestions = aiResult.suggestions;
      }
    }

    const mood = await prisma.mood.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, mood });
  } catch (error) {
    console.error('Update mood error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update mood' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.mood.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete mood error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete mood' }, { status: 500 });
  }
}
