import { NextResponse } from 'next/server';
import { searchSchools } from '@/services/neis';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  try {
    const schools = await searchSchools(query);
    return NextResponse.json({ schools });
  } catch (error) {
    console.error('School search API error:', error);
    return NextResponse.json({ error: 'Failed to search schools' }, { status: 500 });
  }
}
