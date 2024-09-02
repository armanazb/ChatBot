import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = "You are a medical assistant specializing in providing information on medication interactions. Please ensure your responses are accurate and relevant to the provided medications.";

// POST function to handle incoming requests
export async function POST(req) {
  try {
    const openai = new OpenAI(); // Create a new instance of the OpenAI client
    const data = await req.json(); // Parse the JSON body of the incoming request
    console.log('Received data:', data);

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, ...data],
      model: 'gpt-4o-mini',
    });

    console.log('API response:', completion);
    return NextResponse.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    if (error.response && error.response.status === 429) {
      return NextResponse.json({ error: 'You have exceeded your API quota. Please check your OpenAI account and billing details.' }, { status: 429 });
    }
    return NextResponse.json({ error: 'Something went wrong. Details: ' + error.message }, { status: 500 });
  }
}
