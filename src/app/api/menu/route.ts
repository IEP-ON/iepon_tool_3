import { NextResponse } from 'next/server';
import { getDailyMenu } from '@/services/neis';
import { refineMenuName } from '@/lib/utils/menu-refiner';
import { v4 as uuidv4 } from 'uuid';
import { MenuItem } from '@/types/database';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const officeCode = searchParams.get('officeCode');
  const schoolCode = searchParams.get('schoolCode');
  const date = searchParams.get('date');

  if (!officeCode || !schoolCode || !date) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const rawMenu = await getDailyMenu(officeCode, schoolCode, date);

    if (!rawMenu || rawMenu.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const items: MenuItem[] = rawMenu.map(rawName => ({
      id: uuidv4(),
      original_name: rawName,
      refined_name: refineMenuName(rawName),
      // image will be resolved in frontend via Supabase / Pixabay
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Menu API error:', error);
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}
