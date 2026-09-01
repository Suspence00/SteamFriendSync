'use client';

import React, { useState } from 'react';
import { IntersectedGame, PlayerData } from '@/types/steam';
import { formatPlaytime, getSteamStoreUrl, getSteamRunUrl } from '@/lib/utils';
import { Play, ExternalLink, Clock, Check, X, ShoppingBag } from 'lucide-react';

interface GameCardProps {
  game: IntersectedGame;
  activePlayers: PlayerData[];
}

export function GameCard({ game, activePlayers }: GameCardProps) {
  const [imageError, setImageError] = useState(false);
  const activeCount = activePlayers.length;
  const isFullMatch = game.ownerCount === activeCount;
  const isMissingOne = activeCount >= 3 && game.ownerCount === activeCount - 1;

  const missingPlayerNames = game.missingPlayers.map((id) => {
    const p = activePlayers.find((ap) => ap.id === id);
    return p ? p.summary.personaname : 'Player';
  });

  return (
    <div className="group flex flex-col rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors overflow-hidden">
      {/* Banner Capsule Image */}
      <div className="relative aspect-[460/215] w-full bg-black overflow-hidden border-b border-neutral-800">
        <img
          src={imageError ? 'https://via.placeholder.com/460x215/121212/888888?text=Steam+Game' : game.headerUrl}
          alt={game.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
          {isFullMatch ? (
            <span className="px-2.5 py-1 rounded text-xs font-extrabold bg-white text-black shadow">
              {game.ownerCount}/{activeCount} ALL OWN
            </span>
          ) : isMissingOne ? (
            <span className="px-2.5 py-1 rounded text-xs font-extrabold bg-neutral-200 text-black shadow">
              {game.ownerCount}/{activeCount} MISSING 1
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-black/85 text-neutral-200 border border-neutral-700">
              {game.ownerCount}/{activeCount} Own
            </span>
          )}

          {game.totalGroupPlaytimeMinutes > 0 && (
            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-black/85 text-white border border-neutral-700 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatPlaytime(game.totalGroupPlaytimeMinutes)}</span>
            </span>
          )}
        </div>

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
          <a
            href={getSteamRunUrl(game.appid)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors"
            title="Launch in Steam Client"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch</span>
          </a>
          <a
            href={getSteamStoreUrl(game.appid)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 border border-neutral-700 transition-colors"
            title="Open Store Page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Store</span>
          </a>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h4 className="font-bold text-white text-base line-clamp-2 leading-snug group-hover:underline" title={game.name}>
          {game.name}
        </h4>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {(game.categories || []).slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="text-xs font-medium px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Missing 1 Buyer Callout */}
        {isMissingOne && (
          <div className="mt-3 px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 flex items-center justify-between gap-1">
            <span className="truncate">
              Missing: <strong className="text-white">{missingPlayerNames.join(', ')}</strong>
            </span>
            <a
              href={getSteamStoreUrl(game.appid)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white shrink-0 flex items-center gap-1 font-semibold"
              title="Store Page"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Buy</span>
            </a>
          </div>
        )}

        {/* Full-Width Player Ownership Rows (No Cramping/Truncation) */}
        <div className="mt-auto pt-4">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Player Ownership</span>
            <span>{Math.round(game.ownerRatio * 100)}%</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {activePlayers.map((player) => {
              const ownership = game.owners.find((o) => o.steamid === player.id);
              const owns = Boolean(ownership);

              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded border text-xs ${
                    owns
                      ? 'bg-neutral-900 border-neutral-800 text-white'
                      : 'bg-black border-neutral-900 text-neutral-600 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={player.summary.avatar || 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg'}
                      alt={player.summary.personaname}
                      className="w-4 h-4 rounded-full object-cover shrink-0 border border-neutral-700"
                    />
                    <span className="font-semibold text-xs text-neutral-200 truncate">
                      {player.summary.personaname}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {owns ? (
                      <>
                        <span className="text-xs text-neutral-400 font-mono font-medium">
                          {formatPlaytime(ownership?.playtimeMinutes || 0)}
                        </span>
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      </>
                    ) : (
                      <span className="text-[11px] text-neutral-600 font-medium">Not Owned</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
