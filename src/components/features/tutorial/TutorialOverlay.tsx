'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Step } from 'react-joyride';

// 클라이언트 사이드에서만 렌더링되도록 dynamic import
const Joyride = dynamic(() => import('react-joyride'), { ssr: false });

const steps: Step[] = [
  {
    target: '[data-tour="search-section"]',
    content: (
      <div className="text-left">
        <h3 className="font-bold text-lg mb-1">학교와 날짜 선택</h3>
        <p className="text-sm text-slate-600">학교 이름을 검색하고 메뉴를 불러올 날짜를 선택하세요.</p>
      </div>
    ),
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '[data-tour="editor-section"]',
    content: (
      <div className="text-left">
        <h3 className="font-bold text-lg mb-1">메뉴 확인 및 수정</h3>
        <p className="text-sm text-slate-600">불러온 급식 메뉴가 이곳에 표시됩니다.<br/>메뉴 이름을 클릭해 수정하거나, 눈동자 아이콘을 눌러 인쇄에서 제외할 수 있어요.</p>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '[data-tour="image-edit"]',
    content: (
      <div className="text-left">
        <h3 className="font-bold text-lg mb-1">이미지 교체 및 업로드</h3>
        <p className="text-sm text-slate-600">이미지에 마우스를 올리면 교체 버튼이 나타납니다.<br/>원하는 사진으로 검색하거나 직접 찍은 사진을 올릴 수 있습니다.</p>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '[data-tour="tracing-toggle"]',
    content: (
      <div className="text-left">
        <h3 className="font-bold text-lg mb-1">따라쓰기 학습지 옵션</h3>
        <p className="text-sm text-slate-600">이 스위치를 켜면 급식판 외에 글씨 따라쓰기 학습지 2페이지가 추가로 생성됩니다.</p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="print-button"]',
    content: (
      <div className="text-left">
        <h3 className="font-bold text-lg mb-1">인쇄하기</h3>
        <p className="text-sm text-slate-600">준비가 끝났다면 이 버튼을 눌러 A4 용지에 인쇄하세요.<br/>(가운데를 자르면 A5 사이즈 2장이 됩니다!)</p>
      </div>
    ),
    placement: 'bottom-end',
  }
];

export function TutorialOverlay() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 localStorage 확인
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      // 메뉴 데이터 로딩 등 초기 지연을 고려해 약간 딜레이 후 시작
      setTimeout(() => setRun(true), 500);
    }
  }, []);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    // finished 또는 skipped 상태가 되면 localStorage에 저장하고 종료
    if (['finished', 'skipped'].includes(status)) {
      setRun(false);
      localStorage.setItem('hasSeenTutorial', 'true');
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#4f46e5', // indigo-600
          zIndex: 10000,
        },
        buttonClose: {
          display: 'none',
        }
      }}
      locale={{
        back: '이전',
        close: '닫기',
        last: '완료',
        next: '다음',
        skip: '건너뛰기'
      }}
    />
  );
}
