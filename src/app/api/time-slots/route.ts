import { NextResponse } from 'next/server';
import { getTimeSlots } from '@/lib/data';

export async function GET() {
  try {
    const timeSlots = await getTimeSlots();

    // Group by day
    const groupedSlots = timeSlots.reduce((acc, slot) => {
      if (!acc[slot.day]) {
        acc[slot.day] = [];
      }
      acc[slot.day].push(slot.time);
      return acc;
    }, {} as Record<string, string[]>);

    const formattedSlots = Object.entries(groupedSlots).map(([day, times]) => ({
      day,
      times,
    }));

    return NextResponse.json(formattedSlots);
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time slots' },
      { status: 500 }
    );
  }
}
