export type MenuImage = {
  id: string;
  name: string; // 정제된 음식명 (예: '현미밥')
  original_name: string; // 원래 음식명 (예: '친환경현미밥(1.2)')
  image_url: string; // Storage 또는 외부 URL
  source: 'tier1_preset' | 'tier2_cache' | 'tier3_pixabay' | 'tier4_openai' | 'user_upload';
  created_at: string;
  updated_at: string;
};

export type DailyMenu = {
  date: string;
  school_code: string;
  school_name: string;
  items: MenuItem[];
};

export type MenuItem = {
  id: string; // uuid
  original_name: string;
  refined_name: string;
  image?: MenuImage;
};
