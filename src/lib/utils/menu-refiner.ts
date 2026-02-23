/**
 * 나이스 API에서 받아온 급식 메뉴명을 정제하여 이미지 검색/생성에 적합한 핵심 명사만 추출합니다.
 */
export function refineMenuName(rawName: string): string {
  let name = rawName;

  // 1. Remove allergy info like (1.2.3) or ①②③
  name = name.replace(/\([0-9\.]+\)/g, '');
  name = name.replace(/[①-⑲]/g, '');

  // 2. Remove specific modifiers
  const modifiers = [
    '친환경', '무농약', '수제', '오븐에구운', '오븐에', '구운', 
    '우리밀', '유기농', '산간', '\\(산간\\)', '\\(채식\\)', '\\(페스코\\)',
    '우리땅', '국산', '국내산', '\\(강조\\)', '\\(염도\\)',
    'GAP', '무항생제', '저당', '저나트륨', '수다날', '특', '오븐'
  ];
  
  const regex = new RegExp(modifiers.join('|'), 'gi');
  name = name.replace(regex, '');

  // 3. Remove symbols and extra spaces
  name = name.replace(/[\*\[\]\(\)<>\/]/g, ' '); // remove brackets, asterisk, slash
  name = name.replace(/\s+/g, ' ').trim(); // remove multiple spaces

  // 4. Special cases handling
  // "현미밥" -> "현미밥"
  // "깍두기(자율)" -> "깍두기"
  name = name.replace(/자율/g, '').trim();

  return name;
}
