'use client';

import { useMemo } from 'react';
import { useMenuStore } from '@/store/useMenuStore';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MenuItem } from '@/types/database';

interface CategorizedMenu {
  rice: MenuItem | null;
  soup: MenuItem | null;
  sides: MenuItem[];
  snacks: MenuItem[];
}

function categorizeMenuItems(items: MenuItem[]): CategorizedMenu {
  const result: CategorizedMenu = { rice: null, soup: null, sides: [], snacks: [] };
  
  for (const item of items) {
    const name = item.refined_name;
    if (!result.rice && /밥/.test(name)) {
      result.rice = item;
    } else if (!result.soup && /국|찌개|전골|탕|스프/.test(name)) {
      result.soup = item;
    } else if (/우유|요구르트|주스|과일|귤|사과|배$|바나나|단감|딸기|수박|포도|감귤|요플레/.test(name)) {
      result.snacks.push(item);
    } else {
      result.sides.push(item);
    }
  }
  return result;
}

function TrayCell({ item, label }: { item: MenuItem | null; label: string }) {
  return (
    <div className="print-tray-cell">
      {item?.image ? (
        <div className="print-tray-cell-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image.image_url} alt={item.refined_name} className="print-tray-img" />
          <span className="print-tray-label">{item.refined_name}</span>
        </div>
      ) : item ? (
        <div className="print-tray-cell-inner">
          <span className="print-tray-placeholder-name">{item.refined_name}</span>
        </div>
      ) : (
        <span className="print-tray-placeholder">{label}</span>
      )}
    </div>
  );
}

export function PrintLayout() {
  const { schoolName, selectedDate, menuItems, showTracingText } = useMenuStore();

  const categorized = useMemo(() => categorizeMenuItems(menuItems), [menuItems]);

  if (menuItems.length === 0) return null;

  const sideDishes = categorized.sides.slice(0, 3);
  while (sideDishes.length < 3) sideDishes.push(null as unknown as MenuItem);

  return (
    <div className="print-page">
      {/* ===== 상단: 식판 영역 ===== */}
      <div className="print-top">
        <h1 className="print-title">
          {schoolName} 오늘의 급식
        </h1>
        <p className="print-date">
          {format(selectedDate, 'yyyy년 M월 d일 (EEEE)', { locale: ko })}
        </p>

        <div className="print-tray-wrapper">
          {/* 5칸 식판 */}
          <div className="print-tray">
            {/* 위쪽 반찬 3칸 */}
            <div className="print-tray-row-top">
              {sideDishes.map((item, idx) => (
                <TrayCell key={idx} item={item} label={`반찬 ${idx + 1}`} />
              ))}
            </div>
            {/* 아래쪽 밥 + 국 */}
            <div className="print-tray-row-bottom">
              <TrayCell item={categorized.rice} label="밥" />
              <div className="print-tray-cell-wide">
                <TrayCell item={categorized.soup} label="국 / 찌개" />
              </div>
            </div>
          </div>

          {/* 간식/우유 영역 (식판 오른쪽) */}
          {categorized.snacks.length > 0 && (
            <div className="print-snack-area">
              {categorized.snacks.map((snack) => (
                <div key={snack.id} className="print-snack-item">
                  {snack.image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={snack.image.image_url} alt={snack.refined_name} className="print-snack-img" />
                      <span className="print-snack-label">{snack.refined_name}</span>
                    </>
                  ) : (
                    <span className="print-snack-label">{snack.refined_name}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== 절취선 ===== */}
      <div className="print-cut-line">
        <span>✂ 여기를 잘라주세요 ✂</span>
      </div>

      {/* ===== 하단: 스티커 + 따라쓰기 ===== */}
      <div className="print-bottom">
        <h2 className="print-subtitle">급식 스티커 &amp; 따라 쓰기</h2>

        <div className="print-sticker-grid">
          {menuItems.map((item) => (
            <div key={item.id} className="print-sticker-item">
              {/* 원형 스티커 (자르기용 점선) */}
              <div className="print-sticker-circle">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image.image_url} alt={item.refined_name} className="print-sticker-img" />
                ) : (
                  <span className="print-sticker-empty">{item.refined_name}</span>
                )}
                <span className="print-scissors">✂</span>
              </div>

              {/* 따라쓰기 칸 */}
              <div className="print-writing-box">
                <div className="print-writing-guides">
                  <div className="print-guide-h"></div>
                  <div className="print-guide-v"></div>
                </div>
                {showTracingText && (
                  <span className="print-tracing-text">{item.refined_name}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
