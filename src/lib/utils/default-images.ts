export const defaultImageMap: Record<string, string> = {
  // 정확히 일치하는 경우를 위한 맵
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
  // 1. 정확히 일치하는 경우
  if (defaultImageMap[refinedName]) {
    return defaultImageMap[refinedName];
  }
  
  // 2. 자주 쓰이는 접미사/키워드 매칭 (끝자리나 포함 단어로 판단)
  const name = refinedName;
  
  if (name.endsWith('밥') || name.includes('볶음밥') || name.includes('덮밥')) {
    return '/assets/default-images/rice.png';
  }
  
  if (name.endsWith('국') || name.endsWith('탕') || name.endsWith('찌개') || name.endsWith('전골')) {
    return '/assets/default-images/soup.png';
  }
  
  if (name.includes('김치') || name.endsWith('두기') || name.includes('석박지')) {
    return '/assets/default-images/kimchi.png';
  }

  // 과일/디저트류 폴백
  if (name.includes('사과')) return '/assets/default-images/apple.png';
  if (name.includes('토마토')) return '/assets/default-images/tomato.png';
  if (name.includes('바나나')) return '/assets/default-images/banana.png';
  if (name.includes('우유')) return '/assets/default-images/milk.png';
  
  return null;
}
