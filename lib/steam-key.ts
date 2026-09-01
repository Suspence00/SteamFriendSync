import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Retrieves the Steam Web API key from:
 * 1. User/Client override (if provided)
 * 2. process.env.STEAM_API_KEY (Local Node / Next.js .env.local)
 * 3. Cloudflare Worker Environment bindings (via getCloudflareContext)
 */
export async function getEffectiveApiKey(clientKey?: string): Promise<string> {
  if (clientKey && clientKey.trim()) {
    return clientKey.trim();
  }

  // 1. Local environment variables (.env.local)
  if (typeof process !== 'undefined' && process.env && process.env.STEAM_API_KEY) {
    const key = process.env.STEAM_API_KEY.trim();
    if (key) return key;
  }

  // 2. Cloudflare Worker Environment (Async)
  try {
    const cf = await getCloudflareContext({ async: true });
    const cfKey = (cf?.env as Record<string, string> | undefined)?.STEAM_API_KEY;
    if (cfKey && cfKey.trim()) {
      return cfKey.trim();
    }
  } catch {
    // Not running inside Cloudflare async context
  }

  // 3. Cloudflare Worker Environment (Sync fallback)
  try {
    const cfSync = getCloudflareContext();
    const cfKeySync = (cfSync?.env as Record<string, string> | undefined)?.STEAM_API_KEY;
    if (cfKeySync && cfKeySync.trim()) {
      return cfKeySync.trim();
    }
  } catch {
    // Not running inside Cloudflare sync context
  }

  return '';
}
