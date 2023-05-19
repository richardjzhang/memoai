import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  const formData = await req.formData();

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    method: 'POST',
    body: formData,
  });
  const data = await res.json();

  return NextResponse.json({ text: data.text });
}
