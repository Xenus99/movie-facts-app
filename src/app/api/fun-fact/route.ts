import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { movie } = await req.json();

    if (!movie) {
      return NextResponse.json({ error: 'Movie is required' }, { status: 400 });
    }

    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Tell me one fun and surprising fact about the movie "${movie}". Just answer with the fact in one sentence.`,
        },
      ],
      temperature: 0.8,
    });

    const fact = chat.choices[0]?.message?.content?.trim();

    if (!fact) {
      return NextResponse.json({ error: 'No fact generated' }, { status: 500 });
    }

    return NextResponse.json({ fact });
  } catch (err) {
    console.error('Fun fact error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
