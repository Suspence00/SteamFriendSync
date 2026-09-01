import { NextRequest, NextResponse } from 'next/server';
import { fetchOwnedGames } from '@/lib/steam-api';

export const dynamic = 'force-dynamic';

function getEffectiveApiKey(clientKey?: string): string {
  if (clientKey && clientKey.trim()) return clientKey.trim();
  if (process.env.STEAM_API_KEY && process.env.STEAM_API_KEY.trim()) return process.env.STEAM_API_KEY.trim();
  try {
    const { getRequestContext } = require('@opennextjs/cloudflare');
    const ctx = getRequestContext();
    if (ctx?.env?.STEAM_API_KEY) return String(ctx.env.STEAM_API_KEY).trim();
  } catch {
    // Ignore in local node
  }
  return '';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const playerIds: string[] = body.playerIds || [];
    const clientApiKey: string = body.apiKey || '';
    const apiKey = getEffectiveApiKey(clientApiKey);

    if (!playerIds || playerIds.length === 0) {
      return NextResponse.json({ error: 'No player IDs provided' }, { status: 400 });
    }

    // Fetch owned games for all players concurrently
    const results = await Promise.all(
      playerIds.map(async (id) => {
        const data = await fetchOwnedGames(id, apiKey);
        return {
          id,
          games: data.games,
          gamesCount: data.games.length,
          isPrivate: data.isPrivate,
          error: data.error,
        };
      })
    );

    const resultMap: Record<
      string,
      { games: typeof results[0]['games']; gamesCount: number; isPrivate: boolean; error?: string }
    > = {};

    results.forEach((r) => {
      resultMap[r.id] = {
        games: r.games,
        gamesCount: r.gamesCount,
        isPrivate: r.isPrivate,
        error: r.error,
      };
    });

    return NextResponse.json({ libraries: resultMap });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
