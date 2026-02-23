import { NextResponse } from 'next/server';
import axios from 'axios';

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

// 간단한 한국어 -> 영어 식재료/음식 매핑 사전 (Pixabay 검색용)
const foodTranslationMap: Record<string, string> = {
  '밥': 'rice', '현미밥': 'brown rice', '보리밥': 'barley rice', '흑미밥': 'black rice', '잡곡밥': 'multigrain rice', '볶음밥': 'fried rice', '비빔밥': 'bibimbap', '덮밥': 'rice bowl',
  '국': 'soup', '찌개': 'stew', '전골': 'hot pot', '탕': 'soup', '미역국': 'seaweed soup', '된장국': 'miso soup', '된장찌개': 'doenjang jjigae', '김치찌개': 'kimchi stew', '육개장': 'spicy beef soup',
  '김치': 'kimchi', '깍두기': 'radish kimchi', '총각김치': 'radish kimchi', '백김치': 'white kimchi', '열무김치': 'young radish kimchi',
  '불고기': 'bulgogi', '제육볶음': 'spicy stir-fried pork', '갈비': 'galbi', '갈비찜': 'braised short ribs', '닭갈비': 'dak galbi', '닭도리탕': 'spicy stir-fried chicken', '찜닭': 'braised spicy chicken',
  '돈까스': 'pork cutlet', '수제돈까스': 'pork cutlet', '생선까스': 'fish cutlet', '치킨까스': 'chicken cutlet', '함박스테이크': 'hamburger steak',
  '스파게티': 'spaghetti', '파스타': 'pasta', '피자': 'pizza', '햄버거': 'hamburger', '샌드위치': 'sandwich', '핫도그': 'hot dog',
  '우동': 'udon', '짜장면': 'udon', '짬뽕': 'jajangmyeon', '탕수육': 'sweet and sour pork', '마라탕': 'mala soup',
  '떡볶이': 'tteokbokki', '김밥': 'gimbap', '순대': 'sundae', '튀김': 'fried food', '오뎅': 'fish cake', '어묵': 'fish cake',
  '계란말이': 'rolled omelet', '계란찜': 'steamed egg', '계란후라이': 'fried egg',
  '두부조림': 'braised tofu', '두부부침': 'pan-fried tofu',
  '멸치볶음': 'stir-fried anchovies', '진미채볶음': 'stir-fried dried squid', '콩자반': 'braised soybeans',
  '시금치무침': 'seasoned spinach', '콩나물무침': 'seasoned bean sprouts', '숙주나물': 'seasoned mung bean sprouts', '고사리나물': 'seasoned bracken',
  '우유': 'milk', '요구르트': 'yogurt', '주스': 'juice', '사과': 'apple', '배': 'pear', '귤': 'tangerine', '오렌지': 'orange', '바나나': 'banana', '수박': 'watermelon', '포도': 'watermelon', '딸기': 'grape', '토마토': 'tomato', '방울토마토': 'cherry tomato', '단감': 'persimmon', '홍시': 'persimmon',
  '샐러드': 'salad', '과일샐러드': 'fruit salad', '치킨샐러드': 'chicken salad',
  '쇠고기낙지전골': 'beef octopus hot pot',
  '열무된장무침': 'seasoned young radish',
  '땅콩멸치조림': 'stir-fried anchovies with peanuts',
  '떡잡채': 'stir-fried glass noodles with rice cake',
  '잡채': 'japchae',
};

function translateQuery(query: string): string {
  // 1. 정확히 일치하는 단어 매핑
  if (foodTranslationMap[query]) {
    return foodTranslationMap[query];
  }
  
  // 2. 포함된 핵심 키워드로 매핑 (긴 이름에서 핵심 재료/요리명 추출)
  for (const [ko, en] of Object.entries(foodTranslationMap)) {
    // 예: '수제돈까스' -> '돈까스' 매칭
    if (query.includes(ko)) {
      return en;
    }
  }
  
  // 3. 매핑 실패 시 영어로 번역하지 않고 원래 검색어 사용 (Pixabay가 일부 한국어는 지원함)
  return query;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  try {
    const translatedQuery = translateQuery(query);
    console.log(`Pixabay Search: Original="${query}" -> Translated="${translatedQuery}"`);

    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: PIXABAY_API_KEY,
        q: encodeURIComponent(translatedQuery),
        image_type: 'photo',
        category: 'food',
        per_page: 10, // 결과 풀을 조금 늘림
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
