export const defaultImageMap: Record<string, string> = {
  // 실제 이미지가 준비되기 전까지는 빈 맵으로 유지하여 깨진 이미지가 뜨지 않도록 함
};

/**
 * 정제된 메뉴명으로 기본(로컬) 에셋 이미지가 있는지 확인합니다.
 */
export function getDefaultImage(refinedName: string): string | null {
  // 실제 에셋 이미지가 추가될 때까지 기본 이미지 사용을 중단하고 항상 null을 반환하여
  // UI에서 '검색' 아이콘이 정상적으로 표시되도록 유도합니다.
  return null;

  /* 실제 에셋 추가 후 복구할 로직:
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
  */
}
