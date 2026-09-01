import { NextRequest, NextResponse } from 'next/server';
import { parseSteamInput, resolveVanityUrl, fetchPlayerSummaries } from '@/lib/steam-api';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inputs: string[] = body.inputs || [];
    const clientApiKey: string = body.apiKey || '';
    const apiKey = clientApiKey || process.env.STEAM_API_KEY || '';

    if (!inputs || inputs.length === 0) {
      return NextResponse.json({ error: 'No player inputs provided' }, { status: 400 });
    }

    const resolvedResults: Array<{
      inputQuery: string;
      id: string | null;
      error?: string;
    }> = [];

    // Step 1: Parse and resolve vanity URLs or SteamIDs
    for (const rawInput of inputs) {
      const parsed = parseSteamInput(rawInput);

      if (parsed.type === 'steamid') {
        resolvedResults.push({ inputQuery: rawInput, id: parsed.value });
      } else {
        // Resolve vanity URL
        const resolvedId = await resolveVanityUrl(parsed.value, apiKey);
        if (resolvedId) {
          resolvedResults.push({ inputQuery: rawInput, id: resolvedId });
        } else {
          resolvedResults.push({
            inputQuery: rawInput,
            id: null,
            error: apiKey
              ? `Could not resolve vanity username "${parsed.value}"`
              : `Steam API Key required to resolve "${parsed.value}". Enter key in API Key modal or set in .env.local.`,
          });
        }
      }
    }

    // Step 2: Fetch Player Summaries in batch
    const validIds = resolvedResults.map((r) => r.id).filter((id): id is string => Boolean(id));
    const summaries = await fetchPlayerSummaries(validIds, apiKey);

    // Step 3: Combine into response
    const players = resolvedResults.map((r) => {
      if (!r.id) {
        return {
          id: '',
          inputQuery: r.inputQuery,
          summary: {
            steamid: '',
            personaname: r.inputQuery,
            profileurl: '',
            avatar: '',
            avatarmedium: '',
            avatarfull: '',
          },
          games: [],
          gamesCount: 0,
          isPrivate: false,
          error: r.error || 'Failed to resolve user',
        };
      }

      const summary = summaries[r.id] || {
        steamid: r.id,
        personaname: r.inputQuery,
        profileurl: `https://steamcommunity.com/profiles/${r.id}`,
        avatar: '',
        avatarmedium: '',
        avatarfull: '',
      };

      return {
        id: r.id,
        inputQuery: r.inputQuery,
        summary,
        games: [],
        gamesCount: 0,
        isPrivate: summary.communityvisibilitystate === 1,
      };
    });

    return NextResponse.json({ players });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
