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
      <div className="h-[45%] w-full border-b-2 border-dashed border-slate-300 pb-8 relative">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {schoolName} 오늘의 급식 ({format(selectedDate, 'yyyy년 M월 d일 (E)', { locale: ko })})
        </h1>
        
        {/* 식판 (간단한 CSS 드로잉 또는 이미지 에셋) */}
        <div className="w-[80%] mx-auto h-[70%] border-4 border-slate-800 rounded-3xl p-4 grid grid-cols-3 grid-rows-2 gap-4 bg-slate-50">
          {/* 반찬칸 (위 3개) */}
          <div className="border-2 border-slate-300 rounded-xl bg-white flex items-center justify-center text-slate-300 font-medium text-lg">반찬</div>
          <div className="border-2 border-slate-300 rounded-xl bg-white flex items-center justify-center text-slate-300 font-medium text-lg">반찬</div>
          <div className="border-2 border-slate-300 rounded-xl bg-white flex items-center justify-center text-slate-300 font-medium text-lg">반찬</div>
          
          {/* 밥, 국칸 (아래 2개 - 더 넓게) */}
          <div className="col-span-1 border-2 border-slate-300 rounded-xl bg-white flex items-center justify-center text-slate-300 font-medium text-xl">밥</div>
          <div className="col-span-2 border-2 border-slate-300 rounded-xl bg-white flex items-center justify-center text-slate-300 font-medium text-xl">국 / 찌개</div>
        </div>

        {/* 간식/우유 (식판 옆) */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-sm text-slate-400 text-center">
          간식<br/>우유
        </div>
      </div>

      {/* 절취선 표시 */}
      <div className="absolute top-[48%] left-0 w-full flex items-center justify-center text-slate-400">
        <span className="bg-white px-4 text-sm">✂️ 여기를 잘라주세요 ✂️</span>
      </div>

      {/* 2. 하단/우측: 오려 붙일 스티커 & 경필칸 영역 */}
      <div className="h-[45%] w-full pt-12">
        <h2 className="text-xl font-bold mb-6 text-center">급식 스티커 & 따라 쓰기</h2>
        
        <div className="grid grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-4">
              {/* 이미지 영역 (가위로 자르기 쉽게 점선 테두리) */}
              <div className="w-32 h-32 border-2 border-dashed border-slate-400 rounded-full flex items-center justify-center p-2 relative overflow-hidden">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={item.image.image_url} 
                    alt={item.refined_name} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-slate-300 text-sm">이미지 없음</span>
                )}
                {/* 자르기 가이드 가위 아이콘 */}
                <span className="absolute -top-1 -right-1 text-sm bg-white">✂️</span>
              </div>

              {/* 경필칸 (따라쓰기 영역) */}
              <div className="w-full h-12 border-2 border-slate-300 flex items-center justify-center relative bg-white">
                {/* 십자 유도선 */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                  <div className="w-full h-[1px] bg-slate-400 border-dashed border-t"></div>
                  <div className="absolute h-full w-[1px] bg-slate-400 border-dashed border-l"></div>
                </div>
                
                {/* 텍스트 (옵션에 따라 회색 덧쓰기용 또는 빈칸) */}
                {showTracingText ? (
                  <span className="font-bold text-2xl tracking-[0.5em] text-slate-200 z-10" style={{ fontFamily: 'sans-serif' }}>
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
