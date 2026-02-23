# 오늘 급식판 만들기

특수교육대상자 및 학생들을 위한 오늘의 급식판 만들기 학습지 자동 생성 도구입니다.

## 🌟 주요 기능
- **나이스(NEIS) 연동**: 학교명과 날짜만으로 그날의 급식 식단을 자동으로 불러옵니다.
- **메뉴명 자동 정제**: "친환경현미밥(1.2)" 같은 복잡한 메뉴명에서 알레르기 정보와 수식어를 제거하여 핵심 메뉴명만 추출합니다.
- **자동 이미지 매칭 (다단계 폴백)**:
  1. **Tier 1 (기본 에셋)**: 밥, 김치, 우유 등 고빈도 메뉴는 미리 등록된 예쁜 일러스트로 즉시 표시
  2. **Tier 2 (DB 캐시)**: 이전에 다른 교사가 검색/생성했던 이미지를 Supabase DB에서 가져와 재사용 (비용 절감)
  3. **Tier 3 (무료 검색 + 누끼)**: Pixabay 무료 API로 사진을 찾고, 브라우저 단에서 WASM 라이브러리를 통해 배경을 자동 제거(누끼)
  4. **Tier 4 (AI 생성)**: 기상천외한 메뉴명은 OpenAI DALL-E 3 API를 통해 일러스트로 자동 생성
- **특수교육 맞춤 인쇄 레이아웃**:
  - 오려 붙이기 좋은 A4 분할 레이아웃 (좌상단: 식판 / 우하단: 스티커 및 글씨 쓰기칸)
  - 따라 쓰기 옵션: 메뉴명을 연한 회색 점선 글씨로 제공하여 소근육 발달 및 한글 쓰기 연습 지원

## 🚀 환경 변수 설정
로컬 또는 Vercel 배포 시 아래 환경 변수가 필요합니다. (`.env.local` 참조)

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEIS_API_KEY=your-neis-api-key
PIXABAY_API_KEY=your-pixabay-api-key
OPENAI_API_KEY=your-openai-api-key
```

## 🛠️ Supabase DB 설정
`supabase/migrations` 폴더에 있는 SQL 파일을 Supabase SQL Editor에 복사하여 실행해주세요.

```sql
create table public.menu_images (
  id uuid default gen_random_uuid() primary key,
  refined_name text not null,
  original_name text not null,
  image_url text not null,
  source text not null check (source in ('tier1_preset', 'tier2_cache', 'tier3_pixabay', 'tier4_openai', 'user_upload')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## 💻 로컬 개발 실행 방법
```bash
npm install
npm run dev
```
