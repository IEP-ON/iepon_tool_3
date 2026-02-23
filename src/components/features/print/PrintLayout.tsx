'use client';

import { useMenuStore } from '@/store/useMenuStore';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function PrintLayout() {
  const { schoolName, selectedDate, menuItems, showTracingText } = useMenuStore();

  if (menuItems.length === 0) return null;

  return (
    // h-[297mm]에서 여유를 두어 2페이지로 넘어가지 않도록 h-[290mm]로 수정하고 overflow-hidden 추가
    <div className="print-container hidden print:block bg-white w-[210mm] h-[290mm] mx-auto p-6 relative overflow-hidden box-border">
      {/* 1. 상단: 급식판 영역 (더 예쁘고 부드러운 네우모피즘/파스텔톤 디자인) */}
      <div className="h-[40%] w-full border-b-2 border-dashed border-slate-300 pb-4 relative flex flex-col items-center justify-center">
        <h1 className="text-2xl font-black text-slate-700 mb-4 text-center tracking-tight">
          {schoolName} 오늘의 급식 <span className="text-lg font-bold text-slate-500 ml-2">({format(selectedDate, 'yyyy년 M월 d일', { locale: ko })})</span>
        </h1>
        
        {/* 더 예쁜 급식판 디자인 (파스텔 블루/아이보리 톤 + 부드러운 그림자) */}
        <div 
          className="w-full max-w-[700px] h-[220px] rounded-[50px] p-5 flex flex-col gap-4 relative bg-[#f1f5f9] border-2 border-white"
          style={{
            boxShadow: '10px 10px 20px rgba(166, 180, 200, 0.4), -10px -10px 20px rgba(255, 255, 255, 0.9)'
          }}
        >
          {/* 반찬칸 3개 (상단) */}
          <div className="flex h-[45%] gap-4 px-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="flex-1 rounded-[30px] flex items-center justify-center text-slate-400 font-bold text-lg bg-[#e2e8f0]"
                style={{
                  boxShadow: 'inset 5px 5px 10px rgba(166, 180, 200, 0.5), inset -5px -5px 10px rgba(255, 255, 255, 0.9)'
                }}
              >
                반찬
              </div>
            ))}
          </div>
          
          {/* 밥, 국칸 2개 (하단) */}
          <div className="flex h-[55%] gap-6 px-4">
            <div 
              className="flex-[4] rounded-[35px] flex items-center justify-center text-slate-400 font-bold text-2xl bg-[#e2e8f0]"
              style={{
                boxShadow: 'inset 6px 6px 12px rgba(166, 180, 200, 0.5), inset -6px -6px 12px rgba(255, 255, 255, 0.9)'
              }}
            >
              밥
            </div>
            <div 
              className="flex-[5] rounded-[35px] flex items-center justify-center text-slate-400 font-bold text-2xl bg-[#e2e8f0]"
              style={{
                boxShadow: 'inset 6px 6px 12px rgba(166, 180, 200, 0.5), inset -6px -6px 12px rgba(255, 255, 255, 0.9)'
              }}
            >
              국 / 찌개
            </div>
          </div>
        </div>

        {/* 간식/우유 칸 (둥근 사각형 네우모피즘) */}
        <div 
          className="absolute top-1/2 right-2 -translate-y-1/2 w-20 h-20 rounded-[20px] flex flex-col items-center justify-center text-sm text-slate-500 font-bold bg-[#f1f5f9] border-2 border-white"
          style={{
            boxShadow: '6px 6px 12px rgba(166, 180, 200, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.9)'
          }}
        >
          <span>우유</span>
          <span>간식</span>
        </div>
      </div>

      {/* 절취선 표시 */}
      <div className="absolute top-[41.5%] left-0 w-full flex items-center justify-center text-slate-400">
        <div className="w-full border-t-[3px] border-dashed border-slate-300 absolute"></div>
        <span className="bg-white px-4 text-sm font-bold relative z-10 flex items-center gap-2 text-slate-500 rounded-full">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
          싹둑싹둑 오려주세요
        </span>
      </div>

      {/* 2. 하단: 오려 붙일 스티커 & 글자별 경필칸 영역 */}
      <div className="h-[58%] w-full pt-6">
        <h2 className="text-xl font-black mb-4 text-center text-slate-700 bg-slate-100 py-2 rounded-full mx-auto w-[60%]">
          오늘의 메뉴 스티커 & 따라 쓰기
        </h2>
        
        {/* 메뉴 개수에 따라 그리드 조절하여 잘림 방지 (기본 3열, 많으면 4열) */}
        <div className={`grid ${menuItems.length > 6 ? 'grid-cols-4' : 'grid-cols-3'} gap-x-4 gap-y-6 px-2 content-start`}>
          {menuItems.map((item) => {
            // 글자별로 쪼개기
            const chars = item.refined_name.split('');
            
            return (
              <div key={item.id} className="flex flex-col items-center gap-3">
                {/* 원형 스티커 영역 (네우모피즘 양각 + 점선 가이드) */}
                <div 
                  className="w-[90px] h-[90px] rounded-full p-1 relative flex items-center justify-center bg-[#f1f5f9]"
                  style={{
                    boxShadow: '6px 6px 12px rgba(166, 180, 200, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <div className="w-full h-full rounded-full border-[2.5px] border-dashed border-slate-300 overflow-hidden bg-white">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={item.image.image_url} 
                        alt={item.refined_name} 
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-bold text-center">
                        사진 없음
                      </div>
                    )}
                  </div>
                  {/* 가위 아이콘 */}
                  <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 border shadow-sm text-[10px]">
                    ✂️
                  </div>
                </div>

                {/* 경필칸: 글자 수만큼 정사각형 칸 생성 */}
                <div className="flex gap-1 justify-center">
                  {chars.map((char, idx) => (
                    <div 
                      key={idx} 
                      className="w-10 h-10 border-[1.5px] border-slate-400 flex items-center justify-center relative bg-white rounded-[4px]"
                    >
                      {/* 십자 유도선 */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-[1px] bg-slate-300 border-dashed border-t"></div>
                        <div className="absolute h-full w-[1px] bg-slate-300 border-dashed border-l"></div>
                      </div>
                      
                      {/* 흐린 글자 (따라쓰기용) */}
                      {showTracingText ? (
                        <span className="font-bold text-xl text-slate-200 z-10 font-sans leading-none">
                          {char}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
