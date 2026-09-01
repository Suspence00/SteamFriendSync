'use client';

import React, { useState } from 'react';
import { IntersectedGame, PlayerData } from '@/types/steam';
import { formatPlaytime, getSteamStoreUrl, getSteamRunUrl } from '@/lib/utils';
import { Play, ExternalLink, Check, Clock, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface GameTableProps {
  games: IntersectedGame[];
  activePlayers: PlayerData[];
}

type TableSortField = 'name' | 'match' | 'playtime' | string;

export function GameTable({ games, activePlayers }: GameTableProps) {
  const activeCount = activePlayers.length;
  const [sortField, setSortField] = useState<TableSortField>('match');
  const [sortAsc, setSortAsc] = useState(false);

  if (games.length === 0) {
    return (
      <div className="text-center py-16 rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-400 text-sm">
        No games match the current filter criteria.
      </div>
    );
  }

  const handleSort = (field: TableSortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedGames = [...games].sort((a, b) => {
    let diff = 0;
    if (sortField === 'name') {
      diff = a.name.localeCompare(b.name);
    } else if (sortField === 'match') {
      diff = a.ownerCount - b.ownerCount || a.totalGroupPlaytimeMinutes - b.totalGroupPlaytimeMinutes;
    } else if (sortField === 'playtime') {
      diff = a.totalGroupPlaytimeMinutes - b.totalGroupPlaytimeMinutes;
    } else {
      const pId = sortField;
      const aPlaytime = a.owners.find((o) => o.steamid === pId)?.playtimeMinutes ?? -1;
      const bPlaytime = b.owners.find((o) => o.steamid === pId)?.playtimeMinutes ?? -1;
      diff = aPlaytime - bPlaytime;
    }
    return sortAsc ? diff : -diff;
  });

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-950 shadow-sm">
      <table className="w-full text-left border-collapse text-sm">
        <thead className="sticky top-0 z-20">
          <tr className="border-b border-neutral-800 bg-neutral-900 text-neutral-300">
            <th className="py-3 px-3 font-semibold text-neutral-400 w-10 text-center text-xs">#</th>

            {/* Compact Multi-Line Game Title Header */}
            <th
              onClick={() => handleSort('name')}
              className="py-3 px-3.5 font-bold text-white w-52 max-w-[210px] cursor-pointer hover:bg-neutral-800 transition-colors select-none"
            >
              <div className="flex items-center gap-1.5">
                <span>Game</span>
                {sortField === 'name' ? (
                  sortAsc ? <ArrowUp className="w-4 h-4 text-white" /> : <ArrowDown className="w-4 h-4 text-white" />
                ) : (
                  <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
                )}
              </div>
            </th>

            {/* Match Ratio Header */}
            <th
              onClick={() => handleSort('match')}
              className="py-3 px-3 font-bold text-center w-24 cursor-pointer hover:bg-neutral-800 transition-colors select-none"
            >
              <div className="flex items-center justify-center gap-1.5">
                <span>Match</span>
                {sortField === 'match' ? (
                  sortAsc ? <ArrowUp className="w-4 h-4 text-white" /> : <ArrowDown className="w-4 h-4 text-white" />
                ) : (
                  <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
                )}
              </div>
            </th>

            {/* Total Playtime Header */}
            <th
              onClick={() => handleSort('playtime')}
              className="py-3 px-3 font-bold text-right w-28 cursor-pointer hover:bg-neutral-800 transition-colors select-none"
            >
              <div className="flex items-center justify-end gap-1.5">
                <span>Total Time</span>
                {sortField === 'playtime' ? (
                  sortAsc ? <ArrowUp className="w-4 h-4 text-white" /> : <ArrowDown className="w-4 h-4 text-white" />
                ) : (
                  <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
                )}
              </div>
            </th>

            {/* Individual Player Columns */}
            {activePlayers.map((player) => (
              <th
                key={player.id}
                onClick={() => handleSort(player.id)}
                className="py-3 px-3 font-bold text-center min-w-[110px] cursor-pointer hover:bg-neutral-800 transition-colors select-none"
                title={`Sort by ${player.summary.personaname}'s playtime`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className="truncate max-w-[90px] text-neutral-200 text-xs sm:text-sm">
                    {player.summary.personaname}
                  </span>
                  {sortField === player.id ? (
                    sortAsc ? <ArrowUp className="w-4 h-4 text-white" /> : <ArrowDown className="w-4 h-4 text-white" />
                  ) : (
                    <ArrowUpDown className="w-3.5 h-3.5 text-neutral-600" />
                  )}
                </div>
              </th>
            ))}

            <th className="py-3 px-3 font-bold text-center w-20 text-xs">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {sortedGames.map((game, index) => {
            const isFullMatch = game.ownerCount === activeCount;
            const isMissingOne = activeCount >= 3 && game.ownerCount === activeCount - 1;

            return (
              <tr key={game.appid} className="hover:bg-neutral-900/80 transition-colors group">
                {/* Row Number */}
                <td className="py-3 px-3 text-neutral-500 font-mono text-xs text-center">
                  {index + 1}
                </td>

                {/* Compact Multi-Line Game Title */}
                <td className="py-3 px-3.5 w-52 max-w-[210px] whitespace-normal break-words">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start gap-2.5">
                      <img
                        src={game.headerUrl}
                        alt={game.name}
                        className="w-12 h-6 object-cover rounded bg-black border border-neutral-800 shrink-0 mt-0.5"
                        loading="lazy"
                      />
                      <span className="font-semibold text-white text-sm leading-snug group-hover:underline">
                        {game.name}
                      </span>
                    </div>
                    {(game.categories || []).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {(game.categories || []).slice(0, 2).map((cat) => (
                          <span key={cat} className="text-[10px] text-neutral-400 font-medium px-1 rounded bg-neutral-900 border border-neutral-800">
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>

                {/* Match Badge */}
                <td className="py-3 px-3 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                      isFullMatch
                        ? 'bg-white text-black'
                        : isMissingOne
                        ? 'bg-neutral-300 text-black'
                        : 'bg-neutral-900 text-neutral-300 border border-neutral-700'
                    }`}
                  >
                    {game.ownerCount} / {activeCount}
                  </span>
                </td>

                {/* Total Group Playtime */}
                <td className="py-3 px-3 text-right text-neutral-200 font-mono text-sm font-medium">
                  {game.totalGroupPlaytimeMinutes > 0 ? (
                    formatPlaytime(game.totalGroupPlaytimeMinutes)
                  ) : (
                    <span className="text-neutral-600">—</span>
                  )}
                </td>

                {/* Individual Player Ownership */}
                {activePlayers.map((player) => {
                  const ownership = game.owners.find((o) => o.steamid === player.id);
                  const owns = Boolean(ownership);

                  return (
                    <td key={player.id} className="py-3 px-3 text-center">
                      {owns ? (
                        <div
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-900 text-white border border-neutral-700 text-xs font-mono font-medium"
                          title={`${player.summary.personaname}: ${formatPlaytime(ownership?.playtimeMinutes || 0)}`}
                        >
                          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                          <span>{formatPlaytime(ownership?.playtimeMinutes || 0)}</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center justify-center text-neutral-700 font-bold text-sm">
                          —
                        </span>
                      )}
                    </td>
                  );
                })}

                {/* Actions */}
                <td className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <a
                      href={getSteamRunUrl(game.appid)}
                      className="p-1.5 rounded bg-neutral-900 hover:bg-white text-neutral-300 hover:text-black transition-colors"
                      title="Launch Game in Steam"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </a>
                    <a
                      href={getSteamStoreUrl(game.appid)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                      title="Steam Store Page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
