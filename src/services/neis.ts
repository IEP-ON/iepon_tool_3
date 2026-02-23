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
  try {
    console.log(`[NEIS API] Searching schools with query: ${query}, API Key exists: ${!!NEIS_API_KEY}`);
    
    const response = await axios.get(`${BASE_URL}/schoolInfo`, {
      params: {
        KEY: NEIS_API_KEY,
        Type: 'json',
        pIndex: 1,
        pSize: 20,
        SCHUL_NM: query,
      },
    });

    // NEIS API 에러 메시지 핸들링 (200 OK로 오지만 내부에 RESULT 코드가 있는 경우가 많음)
    if (response.data.RESULT && response.data.RESULT.CODE !== 'INFO-000') {
      console.error('[NEIS API] API Error Response:', response.data.RESULT);
      throw new Error(`NEIS API Error: ${response.data.RESULT.MESSAGE}`);
    }

    if (response.data.schoolInfo && response.data.schoolInfo[1].row) {
      return response.data.schoolInfo[1].row;
    }
    
    console.log('[NEIS API] No results found in response:', response.data);
    return [];
  } catch (error: any) {
    console.error('[NEIS API] School search failed:', error?.response?.data || error.message || error);
    throw error; // 에러를 상위 라우트로 전파해서 500 에러를 띄우도록 함
  }
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

    if (response.data.RESULT && response.data.RESULT.CODE !== 'INFO-000') {
      console.error('[NEIS API] Meal fetch API Error:', response.data.RESULT);
      throw new Error(`NEIS API Error: ${response.data.RESULT.MESSAGE}`);
    }

    if (response.data.mealServiceDietInfo && response.data.mealServiceDietInfo[1].row) {
      // row[0].DDISH_NM contains the menu string, e.g., "친환경현미밥(1.2)<br/>쇠고기미역국<br/>..."
      const menuString = response.data.mealServiceDietInfo[1].row[0].DDISH_NM as string;
      
      // Split by <br/>
      const rawItems = menuString.split(/<br\/>|<br>/i);
      
      return rawItems.map(item => item.trim()).filter(Boolean);
    }
    return [];
  } catch (error: any) {
    console.error('[NEIS API] Meal fetch failed:', error?.response?.data || error.message || error);
    throw error;
  }
};
