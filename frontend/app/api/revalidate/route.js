import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { path } = await request.json();
  if (!path) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Path is required', details: [] }
      },
      { status: 400 }
    );
  }

  revalidatePath(path);
  return NextResponse.json({ success: true, data: { path }, message: 'Revalidated', meta: {} });
}
