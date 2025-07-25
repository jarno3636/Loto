import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.json({
    frames: {
      version: "vNext",
      image: "https://loto-gamma.vercel.app/meta-preview.png",
      post_url: "https://loto-gamma.vercel.app/api/frame"
    }
  });

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
