import axios from 'axios';

const NEIS_API_KEY = process.env.NEIS_API_KEY;
const BASE_URL = 'https://open.neis.go.kr/hub';

export interface School {
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  ORG_RDNMA: string; // 주소
}

export const searchSchools = async (query: string): Promise<School[]> => {
  if (!query) return [];
  
  if (!NEIS_API_KEY) {
    throw new Error('NEIS_API_KEY 환경변수가 설정되지 않았습니다.');
  }

  const response = await axios.get(`${BASE_URL}/schoolInfo`, {
    params: {
      KEY: NEIS_API_KEY,
      Type: 'json',
      pIndex: 1,
      pSize: 20,
      SCHUL_NM: query,
    },
  });

  if (response.data.schoolInfo && response.data.schoolInfo[1].row) {
    return response.data.schoolInfo[1].row;
  }
  return [];
};

export const getDailyMenu = async (
  officeCode: string,
  schoolCode: string,
  date: string // YYYYMMDD format
): Promise<string[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/mealServiceDietInfo`, {
      params: {
        KEY: NEIS_API_KEY,
        Type: 'json',
        pIndex: 1,
        pSize: 10,
        ATPT_OFCDC_SC_CODE: officeCode,
        SD_SCHUL_CODE: schoolCode,
        MLSV_YMD: date,
      },
    });

    if (response.data.mealServiceDietInfo && response.data.mealServiceDietInfo[1].row) {
      // row[0].DDISH_NM contains the menu string, e.g., "친환경현미밥(1.2)<br/>쇠고기미역국<br/>..."
      const menuString = response.data.mealServiceDietInfo[1].row[0].DDISH_NM as string;
      
      // Split by <br/>
      const rawItems = menuString.split(/<br\/>|<br>/i);
      
      return rawItems.map(item => item.trim()).filter(Boolean);
    }
    return [];
  } catch (error) {
    console.error('Meal fetch failed:', error);
    return [];
  }
};
