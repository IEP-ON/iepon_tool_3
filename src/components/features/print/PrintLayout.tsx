'use client';

import { useMenuStore } from '@/store/useMenuStore';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function PrintLayout() {
  const { schoolName, selectedDate, menuItems, showTracingText } = useMenuStore();

  // 인쇄 대상 항목 필터링 (숨김 처리된 것 제외)
  const visibleItems = menuItems.filter(item => !item.isHidden);
  
  if (visibleItems.length === 0) return null;

  // 따라쓰기 페이지 단위 분할 (8개씩)
  const tracingChunks: typeof visibleItems[] = [];
  for (let i = 0; i < visibleItems.length; i += 8) {
    tracingChunks.push(visibleItems.slice(i, i + 8));
  }

  return (
    // 전체 컨테이너
    <div className="print-container hidden print:flex bg-white w-full flex-col">
      
      {/* ================= 1페이지 (급식판 + 스티커) ================= */}
      {/* 정확한 A4 크기 지정 (210mm x 297mm) */}
      <div 
        className="w-[210mm] h-[297mm] mx-auto flex flex-col box-border overflow-hidden relative bg-white shrink-0"
        style={{ pageBreakAfter: 'always', breakAfter: 'page' }}
      >
        {/* 1. 상단: 급식판 영역 (정확히 148.5mm = 297mm의 절반 사이즈로 분할하여 완벽한 A5 비율 맞춤) */}
        <div className="h-[148.5mm] w-full px-6 py-6 border-b-[2px] border-dashed border-slate-300 relative flex flex-col items-center justify-center box-border">
          <h1 className="text-3xl font-black text-slate-700 mb-3 text-center tracking-tight">
            {schoolName} 오늘의 급식 <span className="text-xl font-bold text-slate-500 ml-2">({format(selectedDate, 'yyyy년 M월 d일', { locale: ko })})</span>
          </h1>
          
          {/* 급식판 디자인 (상단 높이 꽉 채우도록 확대) */}
          <div 
            className="w-full max-w-[195mm] flex-1 max-h-[440px] rounded-[40px] p-5 flex flex-col gap-4 relative bg-[#f1f5f9] border-2 border-white shrink-0"
            style={{
              boxShadow: '12px 12px 24px rgba(166, 180, 200, 0.4), -12px -12px 24px rgba(255, 255, 255, 0.9)'
            }}
          >
            {/* 반찬칸 3개 (상단) */}
            <div className="flex h-[45%] gap-5 px-3">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className="flex-1 rounded-[35px] flex items-center justify-center text-slate-400 font-bold text-xl bg-[#e2e8f0]"
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
                className="flex-[4] rounded-[40px] flex items-center justify-center text-slate-400 font-bold text-3xl bg-[#e2e8f0]"
                style={{
                  boxShadow: 'inset 8px 8px 16px rgba(166, 180, 200, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.9)'
                }}
              >
                밥
              </div>
              <div 
                className="flex-[5] rounded-[40px] flex items-center justify-center text-slate-400 font-bold text-3xl bg-[#e2e8f0]"
                style={{
                  boxShadow: 'inset 8px 8px 16px rgba(166, 180, 200, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.9)'
                }}
              >
                국 / 찌개
              </div>
            </div>
          </div>

          {/* 간식/우유 칸 (잘림 방지를 위해 right-8로 여유있게 배치) */}
          <div 
            className="absolute top-[55%] right-8 -translate-y-1/2 w-24 h-24 rounded-[25px] flex flex-col items-center justify-center text-base text-slate-500 font-bold bg-[#f1f5f9] border-2 border-white"
            style={{
              boxShadow: '8px 8px 16px rgba(166, 180, 200, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.9)'
            }}
          >
            <span>우유</span>
            <span>간식</span>
          </div>
        </div>

        {/* 절취선 표시 (정확히 A4의 50% 세로 중앙 지점 148.5mm에 강제 고정) */}
        <div className="absolute top-[148.5mm] left-0 w-full flex items-center justify-center z-20 -translate-y-1/2 pointer-events-none">
          <span className="bg-white px-5 py-1.5 text-sm font-bold flex items-center gap-2 text-slate-500 rounded-full border border-slate-200 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
            반으로 접거나 오려주세요 (정확히 A5 사이즈)
          </span>
        </div>

        {/* 2. 하단: 오려 붙일 스티커 (정확히 148.5mm 높이 차지) */}
        <div className="h-[148.5mm] w-full px-6 py-6 flex flex-col overflow-hidden box-border">
          <h2 className="text-2xl font-black mb-3 text-center text-slate-700 bg-slate-100 py-2.5 rounded-full mx-auto w-[60%] shrink-0">
            오늘의 메뉴 스티커
          </h2>
          
          <div className={`grid ${visibleItems.length > 6 ? 'grid-cols-4' : 'grid-cols-3'} gap-x-4 gap-y-4 px-2 content-start justify-items-center flex-1 overflow-hidden pb-4`}>
            {visibleItems.map((item) => (
              <div key={item.id} className="flex flex-col items-center shrink-0">
                {/* 원형 스티커 영역 (기존 100px -> 150px로 1.5배 확대) */}
                <div 
                  className="w-[150px] h-[150px] rounded-full p-2 relative flex items-center justify-center bg-[#f1f5f9]"
                  style={{
                    boxShadow: '6px 6px 12px rgba(166, 180, 200, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <div className="w-full h-full rounded-full border-[3px] border-dashed border-slate-300 overflow-hidden bg-white">
                    {item.image?.image_url ? (
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
                <div className="mt-2 text-sm font-bold text-slate-500">
                  {item.refined_name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 2페이지~ (경필쓰기 8개 단위 분할, 90도 회전 적용) ================= */}
      {showTracingText && tracingChunks.map((chunk, pageIndex) => (
        <div 
          key={`tracing-page-${pageIndex}`}
          className="w-[210mm] h-[297mm] mx-auto relative box-border overflow-hidden bg-white shrink-0" 
          style={{ pageBreakBefore: 'always', breakBefore: 'page' }}
        >
          {/* 90도 회전된 내부 컨테이너 (실제 내용은 가로 레이아웃 w-297 h-210) */}
          <div 
            className="absolute top-0 left-full origin-top-left rotate-90 w-[297mm] h-[210mm] flex flex-col p-6 box-border bg-white"
          >
            <div className="flex flex-col gap-0 flex-1 justify-between pb-2">
              {chunk.map((item) => {
                const chars = item.refined_name.split('');
                
                return (
                  <div key={`tracing-${item.id}`} className="flex items-center gap-6 py-2 border-b border-dashed border-slate-200 break-inside-avoid flex-1">
                    
                    {/* 좌측: 음식 이미지 및 이름 */}
                    <div className="w-[100px] flex flex-col items-center gap-1.5 shrink-0">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm bg-white">
                        {item.image?.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={item.image.image_url} 
                            alt={item.refined_name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px] font-bold text-center leading-tight">
                            사진<br/>없음
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-slate-700 text-[13px] truncate w-full text-center leading-tight">{item.refined_name}</span>
                    </div>

                    {/* 우측: 따라쓰기 4세트 반복 */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 flex-1 items-center overflow-hidden h-full content-center">
                      {[1, 2, 3, 4].map((setIndex) => (
                        <div key={setIndex} className="flex gap-1 shrink-0">
                          {chars.map((char: string, charIdx: number) => (
                            <div 
                              key={`${setIndex}-${charIdx}`} 
                              className="w-[38px] h-[38px] border-[2px] border-slate-400 flex items-center justify-center relative bg-white rounded-md shadow-sm shrink-0"
                            >
                              {/* 십자 유도선 */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-full h-[1px] bg-slate-300 border-dashed border-t"></div>
                                <div className="absolute h-full w-[1px] bg-slate-300 border-dashed border-l"></div>
                              </div>
                              
                              {/* 글자 (점차 흐리게) */}
                              <span className={`font-bold text-xl font-sans leading-none z-10 ${
                                setIndex === 1 ? 'text-slate-300' : 
                                setIndex === 2 ? 'text-slate-200/60' : 
                                'text-slate-100/30'
                              }`}>
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
        </div>
      ))}
    </div>
  );
}
