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
    const schools = await searchSchools(query);
    return NextResponse.json({ schools });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('School search API error:', message);
    return NextResponse.json({ error: 'Failed to search schools', detail: message }, { status: 500 });
  }
}
