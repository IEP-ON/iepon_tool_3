'use client';

import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

// 튜토리얼 스텝 정의
const TUTORIAL_STEPS: Step[] = [
  {
    target: 'body',
    placement: 'center',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-2 text-indigo-600">오늘 급식판 만들기에 오신 것을 환영합니다! 🎉</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          우리 학교의 오늘 급식 메뉴를 예쁜 학습지로 만들어주는 서비스입니다.<br/>
          간단한 사용 방법을 안내해 드릴게요.
        </p>
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.tutorial-search-section',
    content: (
      <div className="text-left">
        <h4 className="font-bold mb-1">1. 학교 및 날짜 선택</h4>
        <p className="text-sm text-slate-600">
          학교 이름을 검색하고 메뉴를 확인할 날짜를 선택한 뒤 <b>[메뉴 가져오기]</b> 버튼을 누르세요.
        </p>
      </div>
    ),
  },
  {
    target: '.tutorial-editor-section',
    content: (
      <div className="text-left">
        <h4 className="font-bold mb-1">2. 이미지 및 이름 수정</h4>
        <p className="text-sm text-slate-600">
          불러온 메뉴의 이미지가 마음에 들지 않으면 <b>이미지를 클릭해서</b> 교체할 수 있습니다.<br/>
          메뉴 이름도 <b>글자를 클릭해서</b> 자유롭게 수정해보세요!
        </p>
      </div>
    ),
  },
  {
    target: '.tutorial-tracing-toggle',
    content: (
      <div className="text-left">
        <h4 className="font-bold mb-1">3. 숨김 및 따라쓰기 옵션</h4>
        <p className="text-sm text-slate-600">
          인쇄하고 싶지 않은 메뉴는 우측 상단의 <b>'눈' 아이콘</b>을 눌러 숨길 수 있습니다.<br/>
          <b>[따라쓰기 켜기]</b>를 활성화하면 글씨 따라쓰기 학습지도 함께 인쇄됩니다.
        </p>
      </div>
    ),
  },
  {
    target: '.tutorial-print-button',
    content: (
      <div className="text-left">
        <h4 className="font-bold mb-1">4. A4 인쇄하기</h4>
        <p className="text-sm text-slate-600">
          모든 준비가 끝났다면 이 버튼을 눌러 인쇄하세요!<br/>
          A4 용지에 출력 후 반으로 자르면 예쁜 <b>A5 학습지 2장</b>이 완성됩니다.
        </p>
      </div>
    ),
  }
];

export function OnboardingTutorial() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 localStorage 확인
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      // hydration mismatch 방지를 위해 약간의 지연 후 실행
      const timer = setTimeout(() => {
        setRun(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      // 튜토리얼 종료 또는 스킵 시 상태 업데이트 및 localStorage 저장
      setRun(false);
      localStorage.setItem('hasSeenTutorial', 'true');
    }
  };

  // 클라이언트 사이드에서만 렌더링
  if (!run) return null;

  return (
    <Joyride
      steps={TUTORIAL_STEPS}
      run={run}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#4f46e5', // indigo-600
          zIndex: 10000,
        },
        buttonClose: {
          display: 'none', // X 버튼 숨김 (Skip 버튼 사용)
        }
      }}
      locale={{
        back: '이전',
        close: '닫기',
        last: '시작하기',
        next: '다음',
        skip: '건너뛰기',
      }}
    />
  );
}
