import { create } from 'zustand';
import { MenuItem } from '@/types/database';

interface MenuState {
  // 학교 및 날짜 정보
  officeCode: string;
  schoolCode: string;
  schoolName: string;
  selectedDate: Date;
  
  // 메뉴 데이터
  menuItems: MenuItem[];
  isLoading: boolean;
  
  // UI 상태
  showTracingText: boolean; // 따라쓰기 옵션
  
  // Actions
  setSchoolInfo: (officeCode: string, schoolCode: string, schoolName: string) => void;
  setDate: (date: Date) => void;
  setMenuItems: (items: MenuItem[]) => void;
  updateMenuItemImage: (itemId: string, imageUrl: string, source: any) => void;
  toggleMenuItemVisibility: (itemId: string) => void;
  updateMenuItemName: (itemId: string, newName: string) => void;
  setLoading: (loading: boolean) => void;
  toggleTracingText: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  officeCode: '',
  schoolCode: '',
  schoolName: '',
  selectedDate: new Date(),
  menuItems: [],
  isLoading: false,
  showTracingText: true, // 기본값: 켜짐 (특수교육대상자 배려)

  setSchoolInfo: (officeCode, schoolCode, schoolName) => 
    set({ officeCode, schoolCode, schoolName }),
    
  setDate: (date) => set({ selectedDate: date }),
  
  setMenuItems: (items) => set({ menuItems: items }),
  
  updateMenuItemImage: (itemId, imageUrl, source) => 
    set((state) => ({
      menuItems: state.menuItems.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              image: { 
                id: item.image?.id || Math.random().toString(), 
                name: item.refined_name,
                original_name: item.original_name,
                image_url: imageUrl,
                source,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              } 
            }
          : item
      )
    })),

  toggleMenuItemVisibility: (itemId) =>
    set((state) => ({
      menuItems: state.menuItems.map(item =>
        item.id === itemId
          ? { ...item, isHidden: !item.isHidden }
          : item
      )
    })),

  updateMenuItemName: (itemId, newName) =>
    set((state) => ({
      menuItems: state.menuItems.map(item =>
        item.id === itemId
          ? { ...item, refined_name: newName }
          : item
      )
    })),
    
  setLoading: (loading) => set({ isLoading: loading }),
  
  toggleTracingText: () => set((state) => ({ showTracingText: !state.showTracingText }))
}));
