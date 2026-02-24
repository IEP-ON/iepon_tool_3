'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon, Search, SearchIcon } from 'lucide-react';
import { useMenuStore } from '@/store/useMenuStore';
import { School } from '@/services/neis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function SearchSection() {
  const { 
    officeCode, schoolCode, schoolName, selectedDate, 
    setSchoolInfo, setDate, setMenuItems, setLoading, isLoading 
  } = useMenuStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchSchool = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`/api/schools?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (data.schools && data.schools.length > 0) {
        setSchools(data.schools);
      } else {
        setSchools([]);
        toast.error('검색 결과가 없습니다.');
      }
    } catch (error) {
      toast.error('학교 검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSchool = (school: School) => {
    setSchoolInfo(school.ATPT_OFCDC_SC_CODE, school.SD_SCHUL_CODE, school.SCHUL_NM);
    setSchools([]);
    setSearchQuery('');
  };

  const fetchMenu = async () => {
    if (!officeCode || !schoolCode) {
      toast.warning('학교를 먼저 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyyMMdd');
      const res = await fetch(`/api/menu?officeCode=${officeCode}&schoolCode=${schoolCode}&date=${dateStr}`);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        setMenuItems(data.items);
        toast.success('메뉴를 성공적으로 불러왔습니다.');
      } else {
        setMenuItems([]);
        toast.error('해당 날짜에 급식 정보가 없습니다.');
      }
    } catch (error) {
      toast.error('메뉴 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full" data-tour="search-section">
      <CardHeader>
        <CardTitle>급식판 만들기</CardTitle>
        <CardDescription>학교를 검색하고 날짜를 선택하여 급식 메뉴를 불러오세요.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 학교 검색 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">학교 검색</label>
          <div className="flex gap-2">
            <Input 
              placeholder="학교명을 입력하세요 (예: 서울초)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSchool()}
            />
            <Button onClick={handleSearchSchool} disabled={isSearching} variant="secondary">
              <SearchIcon className="w-4 h-4 mr-2" />
              검색
            </Button>
          </div>
          
          {/* 학교 검색 결과 */}
          {schools.length > 0 && (
            <div className="border rounded-md mt-2 max-h-48 overflow-y-auto bg-white p-1">
              {schools.map((school) => (
                <div 
                  key={school.SD_SCHUL_CODE}
                  className="p-2 hover:bg-slate-100 cursor-pointer rounded text-sm flex flex-col"
                  onClick={() => handleSelectSchool(school)}
                >
                  <span className="font-semibold">{school.SCHUL_NM}</span>
                  <span className="text-xs text-slate-500">{school.ORG_RDNMA}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 선택된 학교 및 날짜, 조회 버튼 */}
        <div className="flex flex-col sm:flex-row items-end gap-4 p-4 bg-slate-50 rounded-lg">
          <div className="flex-1 w-full space-y-1">
            <label className="text-xs text-slate-500">선택된 학교</label>
            <div className="font-medium h-10 flex items-center px-3 border rounded-md bg-white">
              {schoolName || '학교를 선택해주세요'}
            </div>
          </div>
          
          <div className="flex-1 w-full space-y-1">
            <label className="text-xs text-slate-500">조회할 날짜</label>
            <Input 
              type="date" 
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setDate(new Date(e.target.value))}
              className="w-full bg-white h-10"
            />
          </div>

          <Button 
            onClick={fetchMenu} 
            disabled={isLoading || !schoolCode} 
            className="w-full sm:w-auto h-10"
          >
            {isLoading ? '불러오는 중...' : '메뉴 불러오기'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
