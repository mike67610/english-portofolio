import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { action, text } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY is not set." }, { status: 500 });
    }

    let prompt = "";
    if (action === 'grammar') prompt = `Fix the grammar, improve the flow, and polish the following text. Return ONLY the corrected text, no conversational filler:\n\n${text}`;
    if (action === 'summarize') prompt = `Provide a concise, 2-sentence summary of the following text. Return ONLY the summary:\n\n${text}`;
    if (action === 'ideas') prompt = `Based on the following context, suggest 3 creative essay topics or writing prompts. If no context, provide general English class prompts. Return ONLY the numbered list:\n\n${text}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
        const err = await response.text();
        console.error("Groq API Error:", err);
        return NextResponse.json({ error: "Failed to fetch from Groq." }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ result: data.choices[0].message.content });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

