'use client';

import { useMenuStore } from '@/store/useMenuStore';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function PrintLayout() {
  const { schoolName, selectedDate, menuItems, showTracingText } = useMenuStore();

  // 인쇄 대상 항목 필터링 (숨김 처리된 것 제외)
  const visibleItems = menuItems.filter(item => !item.isHidden);

  if (visibleItems.length === 0) return null;

  return (
    // 전체 컨테이너는 너비 100%로 두고 하위 페이지들이 210mm를 가짐
    <div className="print-container hidden print:flex bg-white w-full mx-auto flex-col">
      
      {/* ================= 1페이지 (급식판 + 스티커) ================= */}
      {/* 강제 페이지 넘김 스타일 적용 */}
      <div 
        className="w-[210mm] min-h-[297mm] mx-auto p-10 flex flex-col"
        style={{ pageBreakAfter: 'always', breakAfter: 'page' }}
      >
        {/* 1. 상단: 급식판 영역 */}
        <div className="flex-[55] w-full border-b-2 border-dashed border-slate-300 pb-6 relative flex flex-col items-center justify-center">
          <h1 className="text-3xl font-black text-slate-700 mb-6 text-center tracking-tight">
            {schoolName} 오늘의 급식 <span className="text-xl font-bold text-slate-500 ml-2">({format(selectedDate, 'yyyy년 M월 d일', { locale: ko })})</span>
          </h1>
          
          {/* 급식판 디자인 */}
          <div 
            className="w-full max-w-[700px] h-[340px] rounded-[50px] p-6 flex flex-col gap-6 relative bg-[#f1f5f9] border-2 border-white"
            style={{
              boxShadow: '12px 12px 24px rgba(166, 180, 200, 0.4), -12px -12px 24px rgba(255, 255, 255, 0.9)'
            }}
          >
            {/* 반찬칸 3개 (상단) */}
            <div className="flex h-[45%] gap-5 px-3">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="flex-1 rounded-[35px] flex items-center justify-center text-slate-400 font-bold text-2xl bg-[#e2e8f0]"
                  style={{
                    boxShadow: 'inset 6px 6px 12px rgba(166, 180, 200, 0.5), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                  }}
                >
                  반찬
                </div>
              ))}
            </div>
            
            {/* 밥, 국칸 2개 (하단) */}
            <div className="flex h-[55%] gap-8 px-5">
              <div 
                className="flex-[4] rounded-[40px] flex items-center justify-center text-slate-400 font-bold text-4xl bg-[#e2e8f0]"
                style={{
                  boxShadow: 'inset 8px 8px 16px rgba(166, 180, 200, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.9)'
                }}
              >
                밥
              </div>
              <div 
                className="flex-[5] rounded-[40px] flex items-center justify-center text-slate-400 font-bold text-4xl bg-[#e2e8f0]"
                style={{
                  boxShadow: 'inset 8px 8px 16px rgba(166, 180, 200, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.9)'
                }}
              >
                국 / 찌개
              </div>
            </div>
          </div>

          {/* 간식/우유 칸 */}
          <div 
            className="absolute top-1/2 right-4 -translate-y-1/2 w-28 h-28 rounded-[30px] flex flex-col items-center justify-center text-lg text-slate-500 font-bold bg-[#f1f5f9] border-2 border-white"
            style={{
              boxShadow: '8px 8px 16px rgba(166, 180, 200, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.9)'
            }}
          >
            <span>우유</span>
            <span>간식</span>
          </div>
        </div>

        {/* 절취선 표시 */}
        <div className="relative w-full flex items-center justify-center text-slate-400 z-10 -my-3">
          <div className="w-full border-t-[3px] border-dashed border-slate-300 absolute top-1/2 -translate-y-1/2"></div>
          <span className="bg-white px-4 py-1 text-base font-bold relative z-10 flex items-center gap-2 text-slate-500 rounded-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
            싹둑싹둑 오려주세요
          </span>
        </div>

        {/* 2. 하단: 오려 붙일 스티커 */}
        <div className="flex-[45] w-full pt-10 flex flex-col">
          <h2 className="text-2xl font-black mb-8 text-center text-slate-700 bg-slate-100 py-3 rounded-full mx-auto w-[60%]">
            오늘의 메뉴 스티커
          </h2>
          
          <div className={`grid ${visibleItems.length > 6 ? 'grid-cols-4' : 'grid-cols-3'} gap-x-6 gap-y-8 px-4 content-start flex-1`}>
            {visibleItems.map((item) => (
              <div key={item.id} className="flex flex-col items-center">
                {/* 원형 스티커 영역 */}
                <div 
                  className="w-[120px] h-[120px] rounded-full p-2 relative flex items-center justify-center bg-[#f1f5f9]"
                  style={{
                    boxShadow: '8px 8px 16px rgba(166, 180, 200, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <div className="w-full h-full rounded-full border-[3px] border-dashed border-slate-300 overflow-hidden bg-white">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={item.image.image_url} 
                        alt={item.refined_name} 
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm font-bold text-center">
                        사진 없음
                      </div>
                    )}
                  </div>
                  {/* 가위 아이콘 */}
                  <div className="absolute -top-1 -right-1 bg-white rounded-full p-1.5 border shadow-sm text-xs">
                    ✂️
                  </div>
                </div>
                {/* 하단 여백 및 가이드용 이름 */}
                <div className="mt-3 text-sm font-bold text-slate-500">
                  {item.refined_name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 2페이지 (경필쓰기 3회 반복) ================= */}
      {showTracingText && (
        <div 
          className="w-[210mm] min-h-[297mm] mx-auto p-10 flex flex-col"
          style={{ pageBreakBefore: 'always', breakBefore: 'page' }}
        >
          <h1 className="text-3xl font-black text-slate-700 mb-10 text-center tracking-tight border-b-4 border-slate-200 pb-4 inline-block mx-auto mt-4">
            오늘의 메뉴 따라 쓰기
          </h1>

          <div className="flex flex-col gap-10 flex-1 pl-4">
            {visibleItems.map((item) => {
              const chars = item.refined_name.split('');
              
              return (
                <div key={`tracing-${item.id}`} className="flex items-center gap-6 pb-6 border-b border-dashed border-slate-200">
                  
                  {/* 좌측: 작은 음식 이미지 및 이름 */}
                  <div className="w-[120px] flex flex-col items-center gap-2 shrink-0">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm bg-white">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={item.image.image_url} 
                          alt={item.refined_name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200 text-xs">
                          NO IMG
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-slate-700 text-lg">{item.refined_name}</span>
                  </div>

                  {/* 우측: 따라쓰기 3세트 반복 */}
                  <div className="flex flex-wrap gap-x-8 gap-y-4 flex-1 items-center">
                    {[1, 2, 3].map((setIndex) => (
                      <div key={setIndex} className="flex gap-1">
                        {chars.map((char, charIdx) => (
                          <div 
                            key={`${setIndex}-${charIdx}`} 
                            className="w-[45px] h-[45px] border-[2px] border-slate-400 flex items-center justify-center relative bg-white rounded-md shadow-sm"
                          >
                            {/* 십자 유도선 */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-full h-[1px] bg-slate-300 border-dashed border-t"></div>
                              <div className="absolute h-full w-[1px] bg-slate-300 border-dashed border-l"></div>
                            </div>
                            
                            {/* 흐린 글자 (따라쓰기용) - 첫 번째 세트는 진하게, 2/3번째는 흐리게 하여 학습 효과 높임 */}
                            <span className={`font-bold text-2xl font-sans leading-none z-10 ${setIndex === 1 ? 'text-slate-300' : 'text-slate-200/50'}`}>
                              {char}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
