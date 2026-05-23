import { NextResponse } from 'next/server';
import catalog from '@/data/catalog.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const includeDiscontinued = searchParams.get('legacy') === 'true';

  let results = catalog;

  if (!includeDiscontinued) {
    results = results.filter(device => !device.isDiscontinued);
  }

  if (query) {
    results = results.filter(device => 
      device.manufacturer.toLowerCase().includes(query) ||
      device.modelName.toLowerCase().includes(query) ||
      device.category.toLowerCase().includes(query) ||
      device.protocol.toLowerCase().includes(query)
    );
  }

  return NextResponse.json(results.slice(0, 50));
}
