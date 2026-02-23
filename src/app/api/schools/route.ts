import { NextResponse } from 'next/server';
import { searchSchools } from '@/services/neis';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  try {
    const hasKey = !!process.env.NEIS_API_KEY;
    const keyPrefix = process.env.NEIS_API_KEY?.substring(0, 4) || 'N/A';
    const schools = await searchSchools(query);
    return NextResponse.json({ schools, _debug: { hasKey, keyPrefix, count: schools.length } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('School search API error:', message);
    return NextResponse.json({ error: 'Failed to search schools', detail: message }, { status: 500 });
  }
}
