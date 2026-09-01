import { NextRequest, NextResponse } from 'next/server';
import { fetchOwnedGames } from '@/lib/steam-api';
import { getEffectiveApiKey } from '@/lib/steam-key';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const playerIds: string[] = body.playerIds || [];
    const clientApiKey: string = body.apiKey || '';
    const apiKey = await getEffectiveApiKey(clientApiKey);

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
