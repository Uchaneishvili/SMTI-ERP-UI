import { NextResponse } from 'next/server';
import { MOCK_INQUIRIES } from '@/lib';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real app, I would update the DB here.
  // For this mock, I just return the updated inquiry as if it succeeded.
  const inquiry = MOCK_INQUIRIES.find((i) => i.id === id);

  if (!inquiry) {
    return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
  }

  const updatedInquiry = {
    ...inquiry,
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(updatedInquiry);
}
