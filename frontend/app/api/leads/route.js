import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: { items: [], meta: { page: 1, limit: 20, total: 0 } },
    message: 'Success',
    meta: { page: 1, limit: 20, total: 0 }
  });
}

export async function POST() {
  return NextResponse.json({ success: true, data: {}, message: 'Lead created', meta: {} }, { status: 201 });
}
