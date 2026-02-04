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

    const { text, sourceLanguage, targetLanguage, context } = await request.json();

    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields: text, sourceLanguage, targetLanguage' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a professional medical translator. Translate the following text from ${sourceLanguage} to ${targetLanguage}. 
    
Important guidelines:
- Maintain medical accuracy and terminology
- Preserve the tone and intent of the original message
- If there are medical terms, translate them appropriately for the target language while keeping them understandable
- Keep the translation natural and conversational
- Do not add any explanations or notes, just provide the translation

${context ? `Context: This is a ${context} speaking in a doctor-patient conversation.` : ''}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const translatedText = response.choices[0]?.message?.content || '';

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API key is invalid or missing. Please check your environment variables.' },
          { status: 500 }
        );
      }
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        );
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Translation failed. Please try again.' },
      { status: 500 }
    );
  }
}
