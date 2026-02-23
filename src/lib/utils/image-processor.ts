import { removeBackground, Config } from '@imgly/background-removal';

/**
 * 브라우저 단에서 이미지의 배경을 제거하는 함수입니다.
 * 모델 파일은 기본적으로 UNPKG CDN에서 동적으로 로드됩니다.
 * @param imageUrl 배경을 제거할 원본 이미지 URL 또는 Blob
 * @returns 배경이 제거된 이미지의 Blob 객체
 */
export async function removeImageBackground(imageUrl: string | Blob): Promise<Blob | null> {
  try {
    const config: Config = {
      debug: false,
    };

    const imageBlob = await removeBackground(imageUrl, config);
    return imageBlob;
  } catch (error) {
    console.error('Background removal failed:', error);
    return null;
  }
}

/**
 * Blob을 브라우저에서 표시할 수 있는 임시 URL로 변환합니다.
 */
export function blobToUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}
