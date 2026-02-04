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

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert File to the format OpenAI expects
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: language || undefined,
      response_format: 'text',
    });

    return NextResponse.json({ text: transcription });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Transcription failed. Please try again.' },
      { status: 500 }
    );
  }
}
