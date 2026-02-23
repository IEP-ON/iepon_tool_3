export const defaultImageMap: Record<string, string> = {
  // 밥류
  '현미밥': '/assets/default-images/rice.png',
  '보리밥': '/assets/default-images/rice.png',
  '흑미밥': '/assets/default-images/rice.png',
  '기장밥': '/assets/default-images/rice.png',
  '혼합잡곡밥': '/assets/default-images/rice.png',
  '귀리밥': '/assets/default-images/rice.png',
  '차수수밥': '/assets/default-images/rice.png',
  '백미밥': '/assets/default-images/rice.png',
  '수수밥': '/assets/default-images/rice.png',
  
  // 김치류
  '배추김치': '/assets/default-images/kimchi.png',
  '깍두기': '/assets/default-images/kimchi.png',
  '총각김치': '/assets/default-images/kimchi.png',
  '보쌈김치': '/assets/default-images/kimchi.png',
  '열무김치': '/assets/default-images/kimchi.png',
  
  // 국류
  '미역국': '/assets/default-images/soup.png',
  '된장국': '/assets/default-images/soup.png',
  '어묵국': '/assets/default-images/soup.png',
  '무국': '/assets/default-images/soup.png',
  '계란국': '/assets/default-images/soup.png',
  '만둣국': '/assets/default-images/soup.png',
  '시금치된장국': '/assets/default-images/soup.png',
  '배추된장국': '/assets/default-images/soup.png',
  '아욱된장국': '/assets/default-images/soup.png',
  
  // 우유/간식류
  '우유': '/assets/default-images/milk.png',
  '요구르트': '/assets/default-images/yogurt.png',
  '사과': '/assets/default-images/apple.png',
  '배': '/assets/default-images/pear.png',
  '귤': '/assets/default-images/tangerine.png',
  '바나나': '/assets/default-images/banana.png',
  '방울토마토': '/assets/default-images/tomato.png',
};

/**
 * 정제된 메뉴명으로 기본(로컬) 에셋 이미지가 있는지 확인합니다.
 */
export function getDefaultImage(refinedName: string): string | null {
  // 정확히 일치하는 경우
  if (defaultImageMap[refinedName]) {
    return defaultImageMap[refinedName];
  }
  
  // 부분 일치하는 경우 (예: '쇠고기미역국' -> '미역국' 매칭)
  for (const [key, value] of Object.entries(defaultImageMap)) {
    if (refinedName.includes(key)) {
      return value;
    }
  }
  
  return null;
}
