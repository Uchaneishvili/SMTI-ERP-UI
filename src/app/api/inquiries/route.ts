import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const inquiries = await db.getAll();
  return NextResponse.json(inquiries);
}
