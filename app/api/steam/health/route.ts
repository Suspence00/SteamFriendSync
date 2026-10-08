import { NextResponse } from 'next/server';
import { getEffectiveApiKeyDetails } from '@/lib/steam-key';

export const dynamic = 'force-dynamic';

export async function GET() {
  const details = await getEffectiveApiKeyDetails();
  return NextResponse.json({
    status: 'ok',
    configured: Boolean(details.key),
    keyLength: details.key ? details.key.length : 0,
    source: details.source,
  });
}
