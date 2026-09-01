import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPlaytime(minutes: number): string {
  if (!minutes || minutes <= 0) return '0 hrs';
  const hours = Math.round((minutes / 60) * 10) / 10;
  if (hours < 1) {
    return `${minutes} mins`;
  }
  return `${hours.toLocaleString()} hrs`;
}

export function getSteamHeaderUrl(appid: number): string {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`;
}

export function getSteamIconUrl(appid: number, iconHash: string): string {
  if (!iconHash) return '';
  return `https://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${iconHash}.jpg`;
}

export function getSteamStoreUrl(appid: number): string {
  return `https://store.steampowered.com/app/${appid}`;
}

export function getSteamRunUrl(appid: number): string {
  return `steam://run/${appid}`;
}

// Clean, high-contrast player indicators
export const PLAYER_PALETTES = [
  { bg: 'bg-white', text: 'text-black', border: 'border-white', hex: '#ffffff', name: 'White' },
  { bg: 'bg-neutral-300', text: 'text-black', border: 'border-neutral-300', hex: '#d4d4d4', name: 'Light Gray' },
  { bg: 'bg-neutral-400', text: 'text-black', border: 'border-neutral-400', hex: '#a3a3a3', name: 'Gray' },
  { bg: 'bg-neutral-500', text: 'text-white', border: 'border-neutral-500', hex: '#737373', name: 'Dark Gray' },
  { bg: 'bg-zinc-200', text: 'text-black', border: 'border-zinc-200', hex: '#e4e4e7', name: 'Zinc Light' },
  { bg: 'bg-stone-300', text: 'text-black', border: 'border-stone-300', hex: '#d6d3d1', name: 'Stone' },
  { bg: 'bg-slate-300', text: 'text-black', border: 'border-slate-300', hex: '#cbd5e1', name: 'Slate Light' },
  { bg: 'bg-zinc-400', text: 'text-black', border: 'border-zinc-400', hex: '#a1a1aa', name: 'Zinc' },
];

export function getPlayerColor(index: number) {
  return PLAYER_PALETTES[index % PLAYER_PALETTES.length];
}
