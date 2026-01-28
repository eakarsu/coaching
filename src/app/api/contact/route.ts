import { NextRequest, NextResponse } from 'next/server';
import { createContact } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const contact = await createContact({
      name,
      email,
      company,
      message,
    });

    return NextResponse.json({ success: true, contact }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
