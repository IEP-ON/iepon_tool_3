'use client';

import { useMenuStore } from '@/store/useMenuStore';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function PrintLayout() {
  const { schoolName, selectedDate, menuItems, showTracingText } = useMenuStore();

  if (menuItems.length === 0) return null;

  return (
    <div className="print-container hidden print:block bg-white w-full h-[297mm] mx-auto p-8 relative">
      {/* 1. 상단/좌측: 급식판 영역 */}
      <div className="h-[45%] w-full border-b-2 border-dashed border-slate-300 pb-8 relative flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {schoolName} 오늘의 급식 ({format(selectedDate, 'yyyy년 M월 d일', { locale: ko })})
        </h1>
        
        {/* 실제 식판 디자인 (스테인리스 스틸 느낌의 5구 식판) */}
        <div 
          className="w-[90%] max-w-[800px] h-[280px] rounded-[40px] p-4 flex flex-col gap-4 relative shadow-md border-[1px] border-slate-300"
          style={{
            background: 'linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 50%, #e2e8f0 100%)',
            boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.8), inset 0 -4px 6px rgba(0,0,0,0.1), 0 10px 15px -3px rgba(0,0,0,0.1)'
          }}
        >
          {/* 반찬칸 3개 (상단) */}
          <div className="flex h-[45%] gap-4 px-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="flex-1 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 font-medium text-lg overflow-hidden relative"
                style={{
                  background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
                  boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.15), 0 2px 4px rgba(255,255,255,0.8)'
                }}
              >
                반찬
              </div>
            ))}
          </div>
          
          {/* 밥, 국칸 2개 (하단) */}
          <div className="flex h-[55%] gap-6 px-4">
            <div 
              className="flex-[4] rounded-[40px] border border-slate-300 flex items-center justify-center text-slate-400 font-medium text-2xl overflow-hidden relative"
              style={{
                background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
                boxShadow: 'inset 0 6px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(255,255,255,0.8)'
              }}
            >
              밥
            </div>
            <div 
              className="flex-[5] rounded-[40px] border border-slate-300 flex items-center justify-center text-slate-400 font-medium text-2xl overflow-hidden relative"
              style={{
                background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
                boxShadow: 'inset 0 6px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(255,255,255,0.8)'
              }}
            >
              국 / 찌개
            </div>
          </div>
        </div>

        {/* 간식/우유 칸 */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-20 h-20 border-2 border-dashed border-slate-400 rounded-full flex flex-col items-center justify-center text-sm text-slate-400 font-medium bg-slate-50">
          <span>우유</span>
          <span>간식</span>
        </div>
      </div>

      {/* 절취선 표시 */}
      <div className="absolute top-[47%] left-0 w-full flex items-center justify-center text-slate-400">
        <div className="w-full border-t-2 border-dashed border-slate-300 absolute"></div>
        <span className="bg-white px-4 text-sm relative z-10 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
          여기를 오려주세요
        </span>
      </div>

      {/* 2. 하단/우측: 오려 붙일 스티커 & 경필칸 영역 */}
      <div className="h-[45%] w-full pt-12">
        <h2 className="text-xl font-bold mb-8 text-center text-slate-700">오늘의 메뉴 스티커</h2>
        
        <div className="grid grid-cols-4 gap-x-6 gap-y-10 px-4">
          {menuItems.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-3">
              {/* 원형 스티커 영역 (object-cover로 프레이밍) */}
              <div className="w-[100px] h-[100px] rounded-full border-2 border-dashed border-slate-400 p-1 relative group">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-50 border border-slate-200">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={item.image.image_url} 
                      alt={item.refined_name} 
                      className="w-full h-full object-cover"
                      style={{ objectPosition: 'center' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs text-center p-2">
                      이미지<br/>없음
                    </div>
                  )}
                </div>
                {/* 가위 아이콘 */}
                <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 border border-slate-200 shadow-sm text-xs">
                  ✂️
                </div>
              </div>

              {/* 경필칸 (따라쓰기 영역) */}
              <div className="w-full h-12 border-2 border-slate-300 flex items-center justify-center relative bg-white rounded-sm">
                {/* 십자 유도선 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                  <div className="w-full h-[1px] bg-slate-400 border-dashed border-t"></div>
                  <div className="absolute h-full w-[1px] bg-slate-400 border-dashed border-l"></div>
                </div>
                
                {/* 텍스트 (옵션에 따라 회색 덧쓰기용 또는 빈칸) */}
                {showTracingText ? (
                  <span className="font-bold text-lg tracking-widest text-slate-200 z-10" style={{ fontFamily: 'sans-serif' }}>
                    {item.refined_name}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
