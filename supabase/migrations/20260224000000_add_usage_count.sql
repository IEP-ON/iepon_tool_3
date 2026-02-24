-- usage_count 컬럼 추가 (집단지성 기반 이미지 우선순위 정렬용)
ALTER TABLE public.tool3_menu_images 
ADD COLUMN IF NOT EXISTS usage_count integer DEFAULT 1 NOT NULL;

-- usage_count 인덱스 추가 (정렬 성능 최적화)
CREATE INDEX IF NOT EXISTS tool3_menu_images_usage_count_idx 
ON public.tool3_menu_images (refined_name, usage_count DESC);

-- usage_count 증가용 RPC 함수
-- 현재 RLS 정책이 클라이언트에서의 UPDATE를 차단(using(false))하므로
-- SECURITY DEFINER 함수를 사용하여 서버 권한으로 usage_count만 증가시킴
CREATE OR REPLACE FUNCTION increment_usage_count(target_image_url text)
RETURNS void AS $$
BEGIN
  UPDATE public.tool3_menu_images 
  SET usage_count = usage_count + 1,
      updated_at = now()
  WHERE image_url = target_image_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
