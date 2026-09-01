'use client';

import React, { useState } from 'react';
import { CombinationGroup, PlayerData, ViewMode } from '@/types/steam';
import { GameCard } from './GameCard';
import { GameTable } from './GameTable';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';

interface ExactCombinationsViewProps {
  combinations: CombinationGroup[];
  activePlayers: PlayerData[];
  viewMode: ViewMode;
}

export function ExactCombinationsView({
  combinations,
  activePlayers,
  viewMode,
}: ExactCombinationsViewProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    [combinations[0]?.key || '']: true,
  });

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleAll = (open: boolean) => {
    const next: Record<string, boolean> = {};
    combinations.forEach((c) => {
      next[c.key] = open;
    });
    setOpenGroups(next);
  };

  if (combinations.length === 0) {
    return (
      <div className="text-center py-16 text-neutral-500 text-xs rounded-lg border border-neutral-800 bg-neutral-950">
        No subset combinations found for the current filter.
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between text-xs text-neutral-400 pb-1">
        <span>
          Showing <strong className="text-white">{combinations.length}</strong> unique combination groups
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleAll(true)}
            className="hover:text-white underline text-[11px]"
          >
            Expand All
          </button>
          <span>•</span>
          <button
            onClick={() => toggleAll(false)}
            className="hover:text-white underline text-[11px]"
          >
            Collapse All
          </button>
        </div>
      </div>

      {combinations.map((group) => {
        const isOpen = openGroups[group.key] ?? false;

        return (
          <div
            key={group.key}
            className="rounded-lg border border-neutral-800 bg-neutral-950 overflow-hidden"
          >
            {/* Header Accordion */}
            <button
              onClick={() => toggleGroup(group.key)}
              className="w-full flex items-center justify-between p-3.5 bg-neutral-900/60 hover:bg-neutral-900 transition-colors text-left border-b border-neutral-800"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="p-1 rounded bg-black text-neutral-400">
                  {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </span>

                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Shared Exclusively By:
                </span>

                <div className="flex flex-wrap items-center gap-1.5">
                  {group.playerIds.map((id) => {
                    const player = activePlayers.find((p) => p.id === id);
                    const name = player ? player.summary.personaname : id;

                    return (
                      <span
                        key={id}
                        className="px-2 py-0.5 rounded text-xs font-medium bg-neutral-800 text-white border border-neutral-700"
                      >
                        {name}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-neutral-800 text-neutral-200 border border-neutral-700">
                  {group.gameCount} {group.gameCount === 1 ? 'game' : 'games'}
                </span>
              </div>
            </button>

            {/* Content Display: Card Grid OR Table depending on viewMode */}
            {isOpen && (
              <div className="p-4 bg-black">
                {viewMode === 'table' ? (
                  <GameTable games={group.games} activePlayers={activePlayers} />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {group.games.map((game) => (
                      <GameCard key={game.appid} game={game} activePlayers={activePlayers} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
