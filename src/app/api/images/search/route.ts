import { NextResponse } from 'next/server';
import axios from 'axios';

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    console.error('Naver API keys not configured');
    return NextResponse.json({ error: 'Naver API keys not configured' }, { status: 501 });
  }

  try {
    // 네이버 이미지 검색은 한국어 그대로 매우 정확한 결과를 반환함
    // 메뉴판이나 급식판에 쓰기 좋은 형태를 유도하기 위해 '단독', '누끼' 등 검색어 조합
    const finalQuery = `${query} 음식`;
    console.log(`Naver Image Search: Original="${query}" -> Final="${finalQuery}"`);

    const response = await axios.get('https://openapi.naver.com/v1/search/image', {
      params: {
        query: finalQuery,
        display: 15,
        sort: 'sim', // 유사도 순
        filter: 'medium' // 중간 크기 이상
      },
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
      }
    });

    if (response.data && response.data.items) {
      // 네이버 응답은 items 배열 안에 link (원본 이미지), thumbnail (썸네일) 형태로 옴
      // 가벼운 로딩을 위해 thumbnail 사용을 권장할 수도 있으나, 고품질을 위해 원본(link) 우선 시도
      const urls = response.data.items.map((item: any) => item.link);
      return NextResponse.json({ urls });
    }
    
    return NextResponse.json({ urls: [] });
  } catch (error) {
    console.error('Naver API error:', error);
    return NextResponse.json({ error: 'Failed to search images' }, { status: 500 });
  }
}
