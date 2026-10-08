import { getCloudflareContext } from '@opennextjs/cloudflare';

export interface ApiKeyCheckResult {
  key: string;
  source: 'client' | 'process.env' | 'cf_sync' | 'cf_async' | 'global' | 'none';
}

/**
 * Checks for the Steam Web API key across all runtime environments.
 */
export async function getEffectiveApiKeyDetails(clientKey?: string): Promise<ApiKeyCheckResult> {
  if (clientKey && clientKey.trim()) {
    return { key: clientKey.trim(), source: 'client' };
  }

  // 1. Cloudflare Context (Synchronous - standard for OpenNext route handlers)
  try {
    const cf = getCloudflareContext();
    const cfKey = (cf?.env as Record<string, string> | undefined)?.STEAM_API_KEY;
    if (cfKey && cfKey.trim()) {
      return { key: cfKey.trim(), source: 'cf_sync' };
    }
  } catch {
    // Not running inside Cloudflare sync context
  }

  // 2. Cloudflare Context (Async mode fallback)
  try {
    const cfAsync = await getCloudflareContext({ async: true });
    const cfKeyAsync = (cfAsync?.env as Record<string, string> | undefined)?.STEAM_API_KEY;
    if (cfKeyAsync && cfKeyAsync.trim()) {
      return { key: cfKeyAsync.trim(), source: 'cf_async' };
    }
  } catch {
    // Not running inside Cloudflare async context
  }

  // 3. Node.js process.env (.env.local or injected runtime environment)
  try {
    if (typeof process !== 'undefined' && process.env) {
      const pKey = process.env.STEAM_API_KEY || (process.env as Record<string, string>)['STEAM_API_KEY'];
      if (pKey && pKey.trim()) {
        return { key: pKey.trim(), source: 'process.env' };
      }
    }
  } catch {
    // Ignore
  }

  // 4. Global scope fallback (Cloudflare Workers globalThis)
  try {
    const g = globalThis as unknown as { env?: Record<string, string>; STEAM_API_KEY?: string };
    if (g.STEAM_API_KEY && g.STEAM_API_KEY.trim()) {
      return { key: g.STEAM_API_KEY.trim(), source: 'global' };
    }
    if (g.env?.STEAM_API_KEY && g.env.STEAM_API_KEY.trim()) {
      return { key: g.env.STEAM_API_KEY.trim(), source: 'global' };
    }
  } catch {
    // Ignore
  }

  return { key: '', source: 'none' };
}

export async function getEffectiveApiKey(clientKey?: string): Promise<string> {
  const result = await getEffectiveApiKeyDetails(clientKey);
  return result.key;
}
