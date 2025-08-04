import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  const { movie } = await req.json();

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Tell me one interesting fact about the movie "${movie}".`,
      max_tokens: 50,
    });

    const fact = completion.data.choices[0].text?.trim();
    return NextResponse.json({ fact });
  } catch (err) {
    console.error('OpenAI error:', err);
    return NextResponse.json({ error: 'Failed to generate fact' }, { status: 500 });
  }
}
