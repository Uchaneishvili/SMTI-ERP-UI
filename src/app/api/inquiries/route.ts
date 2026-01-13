import { NextResponse } from 'next/server';
import { MOCK_INQUIRIES } from '@/lib';

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json(MOCK_INQUIRIES);
}
