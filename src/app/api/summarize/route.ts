import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid messages array' },
        { status: 400 }
      );
    }

    // Format conversation for the AI
    const conversationText = messages
      .map((msg: { role: string; originalText: string; translatedText: string }) => 
        `${msg.role.toUpperCase()}: ${msg.originalText}${msg.translatedText ? ` (Translation: ${msg.translatedText})` : ''}`
      )
      .join('\n');

    const systemPrompt = `You are a medical documentation assistant. Analyze the following doctor-patient conversation and provide a comprehensive summary.

Your summary should be structured as a JSON object with the following fields:
- overview: A brief 2-3 sentence summary of the conversation
- symptoms: An array of symptoms mentioned by the patient
- diagnoses: An array of any diagnoses or conditions discussed
- medications: An array of any medications mentioned or prescribed
- followUpActions: An array of follow-up actions, appointments, or recommendations
- keyPoints: An array of other important medical points from the conversation

Be thorough but concise. Extract all medically relevant information.

Return ONLY the JSON object, no additional text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: conversationText },
      ],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    const summaryText = response.choices[0]?.message?.content || '{}';
    
    try {
      const summary = JSON.parse(summaryText);
      return NextResponse.json({ summary });
    } catch {
      // If JSON parsing fails, return a basic structure
      return NextResponse.json({
        summary: {
          overview: summaryText,
          symptoms: [],
          diagnoses: [],
          medications: [],
          followUpActions: [],
          keyPoints: [],
        },
      });
    }
  } catch (error) {
    console.error('Summarization error:', error);
    return NextResponse.json(
      { error: 'Summarization failed. Please try again.' },
      { status: 500 }
    );
  }
}
