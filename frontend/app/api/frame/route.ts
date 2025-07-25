import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const frame = {
    type: 'frame',
    version: 'vNext',
    image: 'https://loto-gamma.vercel.app/meta-preview.png',
    buttons: [
      { label: 'View Pools', action: { type: 'link', url: 'https://loto-gamma.vercel.app' } },
    ],
  };

  return NextResponse.json(frame);
}
