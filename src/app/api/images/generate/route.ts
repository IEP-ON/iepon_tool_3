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
        prompt: `A highly realistic, appetizing photograph of a single serving of "${prompt}". 
        CRITICAL REQUIREMENTS: 
        1. The food MUST be the ONLY object in the image. Absolutely NO other items, NO side dishes, NO drinks.
        2. NO characters, NO mascots, NO people, NO faces, NO hands, NO animals.
        3. Pure solid white background (hex #FFFFFF). NO table, NO shadows, NO environment.
        4. NO bowls, NO plates, NO utensils, NO chopsticks, NO spoons, NO pots. Just the food itself isolated in the center. If a container is absolutely necessary for liquids, it must be an extremely simple, plain white bowl with no patterns.
        5. NO text, NO watermarks, NO logos.
        Make it look like a professional, isolated, top-down stock photo for a food catalog. Very intuitive and simple.`,
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
