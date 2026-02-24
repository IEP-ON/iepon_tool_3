'use client';

import Image from "next/image";
import { SearchSection } from '@/components/features/search/SearchSection';
import { EditorSection } from '@/components/features/editor/EditorSection';
import { PrintLayout } from '@/components/features/print/PrintLayout';
import { TutorialOverlay } from '@/components/features/tutorial/TutorialOverlay';
import { Button } from '@/components/ui/button';
import { useMenuStore } from '@/store/useMenuStore';
import { PrinterIcon } from 'lucide-react';
import { Toaster } from 'sonner';

export default function Home() {
  const { menuItems } = useMenuStore();

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <TutorialOverlay />
      <Toaster position="top-center" richColors />
      
      {/* 화면용 UI (인쇄 시 숨김 - print:hidden 추가) */}
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black print:hidden">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start shadow-sm">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 w-full">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">오늘 급식판 만들기</h1>
              <p className="text-slate-500 mt-2">나이스 급식 메뉴로 나만의 A5 학습지를 만들어보세요.</p>
            </div>
            
            <div data-tour="print-button">
              <Button onClick={handlePrint} size="lg" className="shadow-md shrink-0">
                <PrinterIcon className="w-5 h-5 mr-2" />
                A4 인쇄하기
              </Button>
            </div>
          </header>

          <div className="w-full space-y-8 mt-8">
            <SearchSection />
            <EditorSection />
          </div>
          
          <footer className="pt-8 mt-8 border-t w-full text-center text-sm text-slate-400">
            * 제공되는 급식 데이터는 나이스(NEIS) 교육정보 개방 포털 API를 활용합니다.
          </footer>
        </main>
      </div>

      {/* 인쇄용 UI (화면에서는 숨김, 인쇄 시에만 A4 크기로 표시) */}
      <PrintLayout />
    </>
  );
}
