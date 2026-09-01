import { SteamPlayerSummary, SteamOwnedGame } from '@/types/steam';

// Simple in-memory LRU-like cache with TTL (1 hour)
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const summaryCache = new Map<string, CacheEntry<SteamPlayerSummary>>();
const gamesCache = new Map<string, CacheEntry<SteamOwnedGame[]>>();
const vanityCache = new Map<string, CacheEntry<string>>();

export function getCachedPlayerSummary(steamid: string): SteamPlayerSummary | null {
  const entry = summaryCache.get(steamid);
  if (entry && entry.expiresAt > Date.now()) {
    return entry.data;
  }
  return null;
}

export function setCachedPlayerSummary(steamid: string, summary: SteamPlayerSummary): void {
  summaryCache.set(steamid, {
    data: summary,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

export function getCachedPlayerGames(steamid: string): SteamOwnedGame[] | null {
  const entry = gamesCache.get(steamid);
  if (entry && entry.expiresAt > Date.now()) {
    return entry.data;
  }
  return null;
}

export function setCachedPlayerGames(steamid: string, games: SteamOwnedGame[]): void {
  gamesCache.set(steamid, {
    data: games,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

/**
 * Extracts vanity username or SteamID64 from various input formats:
 * - 76561198000000000
 * - https://steamcommunity.com/profiles/76561198000000000/
 * - https://steamcommunity.com/id/username/
 * - username
 */
export function parseSteamInput(input: string): { type: 'steamid' | 'vanity'; value: string } {
  const trimmed = input.trim();

  // Check if it's a URL
  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const url = new URL(trimmed);
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts[0] === 'profiles' && parts[1]) {
        return { type: 'steamid', value: parts[1] };
      }
      if (parts[0] === 'id' && parts[1]) {
        return { type: 'vanity', value: parts[1] };
      }
    }
  } catch {
    // Not a valid URL, continue to string match
  }

  // Pure 17-digit numeric string starting with 7656
  if (/^7656\d{13}$/.test(trimmed)) {
    return { type: 'steamid', value: trimmed };
  }

  // Otherwise assume it's a vanity name
  return { type: 'vanity', value: trimmed };
}

/**
 * Resolves a vanity name to a 64-bit Steam ID via Steam API.
 */
export async function resolveVanityUrl(vanityName: string, apiKey?: string): Promise<string | null> {
  const cached = vanityCache.get(vanityName.toLowerCase());
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  if (!apiKey) {
    return null;
  }

  try {
    const url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${encodeURIComponent(
      vanityName
    )}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();

    if (json.response && json.response.success === 1 && json.response.steamid) {
      const steamid = json.response.steamid;
      vanityCache.set(vanityName.toLowerCase(), {
        data: steamid,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
      return steamid;
    }
  } catch (err) {
    console.error(`Error resolving vanity URL "${vanityName}":`, err);
  }

  return null;
}

/**
 * Fetches player summaries in batch for an array of Steam IDs.
 */
export async function fetchPlayerSummaries(
  steamIds: string[],
  apiKey?: string
): Promise<Record<string, SteamPlayerSummary>> {
  const result: Record<string, SteamPlayerSummary> = {};
  const idsToFetch: string[] = [];

  steamIds.forEach((id) => {
    const cached = getCachedPlayerSummary(id);
    if (cached) {
      result[id] = cached;
    } else {
      idsToFetch.push(id);
    }
  });

  if (idsToFetch.length === 0 || !apiKey) {
    return result;
  }

  try {
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${idsToFetch.join(
      ','
    )}`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      const players: SteamPlayerSummary[] = json.response?.players || [];
      players.forEach((p) => {
        result[p.steamid] = p;
        setCachedPlayerSummary(p.steamid, p);
      });
    }
  } catch (err) {
    console.error('Error fetching player summaries:', err);
  }

  return result;
}

/**
 * Fetches owned games for a specific Steam ID.
 */
export async function fetchOwnedGames(
  steamid: string,
  apiKey?: string
): Promise<{ games: SteamOwnedGame[]; isPrivate: boolean; error?: string }> {
  const cached = getCachedPlayerGames(steamid);
  if (cached) {
    return { games: cached, isPrivate: false };
  }

  if (!apiKey) {
    return {
      games: [],
      isPrivate: false,
      error: 'Steam API key is missing. Set STEAM_API_KEY in .env.local or enter your key in the API Key settings.',
    };
  }

  try {
    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamid}&include_appinfo=1&include_played_free_games=1&format=json`;
    const res = await fetch(url);

    if (!res.ok) {
      return { games: [], isPrivate: false, error: `Steam API HTTP ${res.status}` };
    }

    const json = await res.json();
    const responseData = json.response;

    // When a user profile is private or game details are set to private, Steam returns an empty response object `{}`
    if (!responseData || Object.keys(responseData).length === 0 || !responseData.games) {
      return {
        games: [],
        isPrivate: true,
        error: 'Profile game library is private. Game details must be set to Public in Steam Privacy Settings.',
      };
    }

    const games: SteamOwnedGame[] = responseData.games || [];
    setCachedPlayerGames(steamid, games);

    return { games, isPrivate: false };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { games: [], isPrivate: false, error: `Network error: ${message}` };
  }
}
