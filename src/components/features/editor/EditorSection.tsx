'use client';

import { useState, useEffect, useRef } from 'react';
import { useMenuStore } from '@/store/useMenuStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { RefreshCw, Search, Sparkles, Loader2, Eye, EyeOff } from 'lucide-react';
import { getDefaultImage } from '@/lib/utils/default-images';
import { MenuItem } from '@/types/database';
import { supabase } from '@/lib/supabase/client';

export function EditorSection() {
  const { menuItems, updateMenuItemImage, isLoading, showTracingText, toggleTracingText, toggleMenuItemVisibility, updateMenuItemName } = useMenuStore();
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  
  // Dialog States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Editing Name State
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const loadedMenusRef = useRef<Set<string>>(new Set());
  
  // 자동 이미지 로딩 (Tier 1 -> Tier 2 DB 캐시 -> 수동)
  useEffect(() => {
    const loadMissingImages = async () => {
      for (const item of menuItems) {
        // 이미지가 없고, 아직 캐시 조회를 시도하지 않은 메뉴만 처리
        if (!item.image && !loadedMenusRef.current.has(item.id)) {
          loadedMenusRef.current.add(item.id); // 처리 중/완료 마킹
          
          // 1. Tier 1 (기본 에셋 확인)
          const defaultImg = getDefaultImage(item.refined_name);
          if (defaultImg) {
            updateMenuItemImage(item.id, defaultImg, 'tier1_preset');
            continue;
          }
          
          // 2. Tier 2 (Supabase DB 캐시 확인)
          try {
            const { data, error } = await supabase
              .from('tool3_menu_images')
              .select('image_url, source')
              .eq('refined_name', item.refined_name)
              .order('created_at', { ascending: false })
              .limit(1);
              
            if (!error && data && data.length > 0) {
              updateMenuItemImage(item.id, data[0].image_url, 'tier2_cache');
            }
          } catch (e) {
            console.error('Failed to fetch from DB cache:', e);
          }
        }
      }
    };
    
    if (menuItems.length > 0) {
      loadMissingImages();
    }
  }, [menuItems, updateMenuItemImage]);

  // 메뉴 리스트가 새로 변경되었을 때 (예: 학교/날짜 변경) loadedMenusRef 초기화
  useEffect(() => {
    loadedMenusRef.current = new Set();
  }, [menuItems.length]); // length가 바뀌거나 아예 새로운 배열이 들어올 때 대략적 초기화. 완벽하게 하려면 SearchSection에서 reset action을 호출하는 것이 더 좋으나 일단 임시 조치

  // 다이얼로그 열릴 때 검색어 자동 세팅
  useEffect(() => {
    if (activeItem) {
      setSearchQuery(activeItem.refined_name);
      setSearchResults([]);
    }
  }, [activeItem]);

  // 이름 수정 모드 진입 시 포커스
  useEffect(() => {
    if (editingItemId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingItemId]);

  const handleNameEditSave = (id: string) => {
    if (editingName.trim()) {
      updateMenuItemName(id, editingName.trim());
    }
    setEditingItemId(null);
  };

  // DB에 생성/검색한 이미지 URL 캐싱
  const saveToDbCache = async (refinedName: string, originalName: string, imageUrl: string, source: string) => {
    try {
      await supabase.from('tool3_menu_images').insert({
        refined_name: refinedName,
        original_name: originalName,
        image_url: imageUrl,
        source: source
      });
    } catch (e) {
      console.error('Failed to save to DB cache:', e);
    }
  };

  const handleSearchPixabay = async () => {
    if (!searchQuery.trim() || !activeItem) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`/api/images/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (data.urls && data.urls.length > 0) {
        setSearchResults(data.urls);
        toast.success(`${data.urls.length}개의 이미지를 찾았습니다.`);
      } else {
        setSearchResults([]);
        toast.error('검색 결과가 없습니다. 다른 검색어나 AI 생성을 시도해보세요.');
      }
    } catch (error) {
      toast.error('이미지 검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!searchQuery.trim() || !activeItem) return;
    
    setIsGenerating(true);
    try {
      const res = await fetch('/api/images/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: searchQuery })
      });
      
      const data = await res.json();
      
      if (data.url) {
        updateMenuItemImage(activeItem.id, data.url, 'tier4_openai');
        saveToDbCache(activeItem.refined_name, activeItem.original_name, data.url, 'tier4_openai');
        toast.success('AI 이미지가 성공적으로 생성되었습니다!');
        setActiveItem(null);
      } else {
        toast.error(data.error || 'AI 이미지 생성에 실패했습니다.');
      }
    } catch (error) {
      toast.error('AI 이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectImage = async (url: string) => {
    if (!activeItem) return;
    
    updateMenuItemImage(activeItem.id, url, 'tier3_pixabay');
    saveToDbCache(activeItem.refined_name, activeItem.original_name, url, 'tier3_pixabay');
    toast.success('웹 검색 이미지가 적용되었습니다!');
    setActiveItem(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (menuItems.length === 0) return null;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>메뉴 편집 및 확인</CardTitle>
          <CardDescription>출력될 이미지들을 확인하고 변경할 수 있습니다.</CardDescription>
        </div>
        
        {/* 인쇄 옵션 토글 */}
        <div className="flex items-center space-x-2 border p-3 rounded-md bg-slate-50 w-full sm:w-auto">
          <Switch 
            id="tracing-mode" 
            checked={showTracingText}
            onCheckedChange={toggleTracingText}
          />
          <Label htmlFor="tracing-mode" className="cursor-pointer font-medium text-sm">
            따라쓰기 (2페이지 분리) 켜기
          </Label>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {menuItems.map((item) => (
            <div 
              key={item.id} 
              className={`border rounded-lg p-3 flex flex-col items-center gap-2 hover:border-slate-400 transition-colors bg-white shadow-sm relative group ${item.isHidden ? 'opacity-40 grayscale-[50%]' : ''}`}
            >
              {/* 눈 아이콘 (숨김/보임 토글) */}
              <button
                onClick={() => toggleMenuItemVisibility(item.id)}
                className="absolute -top-3 -right-3 bg-white border border-slate-200 shadow-sm p-1.5 rounded-full text-slate-500 hover:text-slate-800 z-10 transition-colors"
                title={item.isHidden ? "인쇄 포함하기" : "인쇄에서 제외하기"}
              >
                {item.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              {/* 메뉴 이름 (클릭 시 수정) */}
              <div className="w-full h-8 flex items-center justify-center">
                {editingItemId === item.id ? (
                  <Input 
                    ref={inputRef}
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => handleNameEditSave(item.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameEditSave(item.id)}
                    className="h-7 text-sm text-center font-semibold px-1"
                  />
                ) : (
                  <div 
                    className="text-center w-full truncate font-semibold cursor-text hover:bg-slate-100 rounded px-1 py-0.5 transition-colors" 
                    title="클릭하여 이름 수정"
                    onClick={() => {
                      setEditingName(item.refined_name);
                      setEditingItemId(item.id);
                    }}
                  >
                    {item.refined_name}
                  </div>
                )}
              </div>
              
              <div className="w-full aspect-square bg-slate-50 rounded-md flex items-center justify-center overflow-hidden border border-dashed relative">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={item.image.image_url} 
                    alt={item.refined_name} 
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <Search className="w-6 h-6 mb-1 opacity-60" />
                    <span className="text-xs font-bold">검색</span>
                  </div>
                )}
                
                {/* 호버 시 나타나는 편집 오버레이 */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="shadow-lg"
                    onClick={() => setActiveItem(item)}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    교체하기
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* 이미지 교체 다이얼로그 */}
      <Dialog open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>이미지 찾기 및 교체</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>검색어 (메뉴명)</Label>
              <div className="flex gap-2">
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchPixabay()}
                  placeholder="예: 돈까스, 사과"
                />
                <Button onClick={handleSearchPixabay} disabled={isSearching} variant="secondary">
                  {isSearching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                  웹 검색 (무료)
                </Button>
                <Button onClick={handleGenerateAI} disabled={isGenerating} className="bg-purple-600 hover:bg-purple-700 text-white">
                  {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  AI 생성
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                원하는 이미지가 안 나오면 검색어를 단순하게 수정해보세요. (예: 수제돈까스 → 돈까스)
              </p>
            </div>
            
            {/* 검색 결과 표시 영역 */}
            <div className="min-h-[200px] border-2 border-dashed rounded-lg bg-slate-50 p-4">
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-700">웹 검색 결과</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {searchResults.map((url, idx) => (
                      <div 
                        key={idx} 
                        className="aspect-square bg-white rounded-md overflow-hidden border hover:border-blue-500 hover:ring-2 ring-blue-200 cursor-pointer transition-all"
                        onClick={() => handleSelectImage(url)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Search result ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Search className="w-8 h-8 opacity-50" />
                  <p className="text-sm">검색 버튼을 눌러 이미지를 찾거나 AI로 생성하세요.</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
