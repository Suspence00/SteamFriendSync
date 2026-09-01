import { NextRequest, NextResponse } from 'next/server';
import { parseSteamInput, resolveVanityUrl, fetchPlayerSummaries } from '@/lib/steam-api';

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
    const inputs: string[] = body.inputs || [];
    const clientApiKey: string = body.apiKey || '';
    const apiKey = getEffectiveApiKey(clientApiKey);

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
          let errorMsg = `Could not resolve vanity username "${parsed.value}".`;
          if (!apiKey) {
            errorMsg = `Steam API Key is missing. Set STEAM_API_KEY in .env.local / Cloudflare or enter your key in the API Key settings.`;
          } else if (apiKey.length !== 32) {
            errorMsg = `Steam API Key is invalid (${apiKey.length} characters instead of 32). Check for missing characters from steamcommunity.com/dev/apikey.`;
          }
          resolvedResults.push({
            inputQuery: rawInput,
            id: null,
            error: errorMsg,
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
