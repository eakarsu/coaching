import { NextRequest, NextResponse } from 'next/server';
import { createBooking } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, topic, day, time } = body;

    if (!name || !email || !day || !time) {
      return NextResponse.json(
        { error: 'Name, email, day, and time are required' },
        { status: 400 }
      );
    }

    const booking = await createBooking({
      name,
      email,
      phone,
      topic,
      day,
      time,
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
