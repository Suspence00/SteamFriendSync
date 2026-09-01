import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// In-memory cache for Steam Store App categories, genres, and community tags
const tagCache = new Map<number, { categories: string[]; genres: string[]; expiresAt: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Fetch Steam Community Tags & Store details
async function fetchTagsForAppId(appid: number): Promise<{ categories: string[]; genres: string[] } | null> {
  const cached = tagCache.get(appid);
  if (cached && cached.expiresAt > Date.now()) {
    return { categories: cached.categories, genres: cached.genres };
  }

  const allCategories = new Set<string>();
  const allGenres = new Set<string>();

  try {
    // 1. Try SteamSpy API for rich community tags (e.g. "Crafting", "Open World Survival Craft", "Deckbuilder")
    try {
      const spyRes = await fetch(`https://steamspy.com/api.php?request=appdetails&appid=${appid}`, {
        headers: { 'User-Agent': 'SteamSync/1.0' },
      });
      if (spyRes.ok) {
        const spyJson = await spyRes.json();
        if (spyJson.tags && typeof spyJson.tags === 'object') {
          Object.keys(spyJson.tags).slice(0, 20).forEach((t) => {
            allCategories.add(t);
          });
        }
        if (spyJson.genre) {
          spyJson.genre.split(',').map((g: string) => g.trim()).filter(Boolean).forEach((g: string) => allGenres.add(g));
        }
      }
    } catch {
      // Continue to Steam store fallback
    }

    // 2. Fetch official Steam Store API for categories (Single-player, Co-op, PvP, etc.)
    try {
      const storeRes = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&filters=categories,genres`, {
        headers: {
          'User-Agent': 'SteamSync/1.0',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });
      if (storeRes.ok) {
        const storeJson = await storeRes.json();
        const appData = storeJson[appid];
        if (appData && appData.success && appData.data) {
          (appData.data.categories || []).forEach((c: { description: string }) => allCategories.add(c.description));
          (appData.data.genres || []).forEach((g: { description: string }) => allGenres.add(g.description));
        }
      }
    } catch {
      // Continue
    }

    if (allCategories.size > 0 || allGenres.size > 0) {
      const result = {
        categories: Array.from(allCategories),
        genres: Array.from(allGenres),
      };
      tagCache.set(appid, {
        ...result,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
      return result;
    }
  } catch (err) {
    // Fail gracefully
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const appids: number[] = body.appids || [];

    if (!appids || appids.length === 0) {
      return NextResponse.json({ tags: {} });
    }

    const slice = appids.slice(0, 100);
    const results: Record<number, { categories: string[]; genres: string[] }> = {};

    const missingAppIds: number[] = [];
    slice.forEach((id) => {
      const cached = tagCache.get(id);
      if (cached && cached.expiresAt > Date.now()) {
        results[id] = { categories: cached.categories, genres: cached.genres };
      } else {
        missingAppIds.push(id);
      }
    });

    // Fetch missing in parallel with chunks of 8
    const chunkSize = 8;
    for (let i = 0; i < missingAppIds.length; i += chunkSize) {
      const chunk = missingAppIds.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map(async (id) => {
          const data = await fetchTagsForAppId(id);
          if (data) {
            results[id] = data;
          }
        })
      );
    }

    return NextResponse.json({ tags: results });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
