import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { action, text } = await request.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not set. Please add it to .env.local.' },
      { status: 500 }
    );
  }

  let prompt = text;
  if (action === 'grammar') {
    prompt = `You are a professional English editor. Fix any grammar, spelling, and punctuation errors in the text below. Return ONLY the corrected text with no extra commentary or explanation.\n\n${text}`;
  } else if (action === 'summarize') {
    prompt = `Summarize the following text in 2–3 concise sentences. Return ONLY the summary.\n\n${text}`;
  } else if (action === 'ideas') {
    prompt = `Based on the following text, suggest 3 creative ideas or directions the writer could explore next. Be specific and encouraging. Format as a short numbered list.\n\n${text}`;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: action === 'ideas' ? 0.9 : 0.3,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error?.message || `Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
