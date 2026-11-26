import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { pin } = await req.json();
  const secret = (process.env.ADMIN_PIN || '2026').trim();

  if (pin === secret) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
