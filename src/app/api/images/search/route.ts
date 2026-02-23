import { NextResponse } from 'next/server';
import axios from 'axios';

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: PIXABAY_API_KEY,
        q: encodeURIComponent(query),
        image_type: 'photo',
        category: 'food',
        per_page: 5,
        safesearch: true,
      },
    });

    if (response.data && response.data.hits) {
      const urls = response.data.hits.map((hit: any) => hit.webformatURL);
      return NextResponse.json({ urls });
    }
    
    return NextResponse.json({ urls: [] });
  } catch (error) {
    console.error('Pixabay API error:', error);
    return NextResponse.json({ error: 'Failed to search images' }, { status: 500 });
  }
}
