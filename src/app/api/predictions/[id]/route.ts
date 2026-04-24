import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { predictOutcome } from '@/lib/openrouter';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prediction = await prisma.prediction.findUnique({ where: { id } });

    if (!prediction) {
      return NextResponse.json({ success: false, error: 'Prediction not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, prediction });
  } catch (error) {
    console.error('Get prediction error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch prediction' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const { title, description, category, scenario, factors, probability, timeframe, outcome, confidence, actualResult, status, refreshAI } = data;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (scenario !== undefined) updateData.scenario = scenario;
    if (factors !== undefined) updateData.factors = factors;
    if (probability !== undefined) updateData.probability = probability;
    if (timeframe !== undefined) updateData.timeframe = timeframe;
    if (outcome !== undefined) updateData.outcome = outcome;
    if (confidence !== undefined) updateData.confidence = confidence;
    if (actualResult !== undefined) updateData.actualResult = actualResult;
    if (status !== undefined) updateData.status = status;

    if (refreshAI) {
      const currentPrediction = await prisma.prediction.findUnique({ where: { id } });
      if (currentPrediction) {
        const aiResult = await predictOutcome({
          title: title || currentPrediction.title,
          description: description || currentPrediction.description,
          scenario: scenario || currentPrediction.scenario,
          factors: factors || currentPrediction.factors,
          category: category || currentPrediction.category,
          timeframe: timeframe || currentPrediction.timeframe || 'Unknown'
        });
        updateData.aiPrediction = aiResult.prediction;
        updateData.probability = aiResult.probability;
        updateData.confidence = aiResult.confidence;
      }
    }

    const prediction = await prisma.prediction.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, prediction });
  } catch (error) {
    console.error('Update prediction error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update prediction' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.prediction.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete prediction error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete prediction' }, { status: 500 });
  }
}
