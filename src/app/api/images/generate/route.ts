import { NextResponse } from 'next/server';
import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 501 });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: 'dall-e-3',
        // 프롬프트 고도화: 캐릭터 배제, 흰 배경, 직관적인 음식 사진 강조
        prompt: `A highly realistic, appetizing photograph of the food "${prompt}". 
        CRITICAL REQUIREMENTS: 
        1. The food MUST be the only object in the image.
        2. NO characters, NO mascots, NO people, NO faces, NO hands.
        3. Pure solid white background (hex #FFFFFF).
        4. No bowls, plates, or utensils if possible, just the food itself isolated. If a container is necessary, it must be extremely simple and white.
        5. No text or watermarks.
        Make it look like a professional top-down stock photo for a food catalog, perfectly lit.`,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const imageUrl = response.data.data[0].url;
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
