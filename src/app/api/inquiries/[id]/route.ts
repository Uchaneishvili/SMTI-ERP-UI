import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  await new Promise((resolve) => setTimeout(resolve, 500));

  const updatedInquiry = await db.update(id, body);

  if (!updatedInquiry) {
    return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
  }

  return NextResponse.json(updatedInquiry);
}
