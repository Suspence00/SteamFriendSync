'use client';

import React, { useState } from 'react';
import { PlayerData } from '@/types/steam';
import { Plus, X, Check, Lock, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

interface PlayerBarProps {
  players: PlayerData[];
  activePlayerIds: string[];
  onTogglePlayer: (id: string) => void;
  onRemovePlayer: (id: string) => void;
  onAddPlayer: (input: string) => Promise<void>;
  onOpenPrivacyGuide: (playerName?: string) => void;
  isLoading: boolean;
}

export function PlayerBar({
  players,
  activePlayerIds,
  onTogglePlayer,
  onRemovePlayer,
  onAddPlayer,
  onOpenPrivacyGuide,
  isLoading,
}: PlayerBarProps) {
  const [inputVal, setInputVal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setInputError(null);
    setIsSubmitting(true);
    try {
      await onAddPlayer(inputVal.trim());
      setInputVal('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add player';
      setInputError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      {/* Player Input Form */}
      <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                if (inputError) setInputError(null);
              }}
              placeholder="Enter SteamID64, Vanity Username, or Profile URL..."
              disabled={isSubmitting || isLoading}
              className="w-full px-3.5 py-2 text-sm rounded bg-black text-white placeholder:text-neutral-500 border border-neutral-800 focus:border-white focus:outline-none pr-9"
            />
            {isSubmitting && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!inputVal.trim() || isSubmitting || isLoading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded bg-white text-black hover:bg-neutral-200 disabled:opacity-40 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Player</span>
          </button>
        </form>

        {players.length > 0 && (
          <div className="text-xs text-neutral-400 self-end sm:self-auto shrink-0">
            Active: <strong className="text-white font-semibold">{activePlayerIds.length}</strong> of {players.length}
          </div>
        )}
      </div>

      {inputError && (
        <div className="mt-2.5 px-3.5 py-2 rounded bg-neutral-950 border border-red-900/60 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{inputError}</span>
        </div>
      )}

      {/* Players List */}
      {players.length > 0 && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {players.map((player, idx) => {
            const isActive = activePlayerIds.includes(player.id);
            const isError = Boolean(player.error && !player.isPrivate);

            return (
              <div
                key={player.id || `idx-${idx}`}
                className={`flex items-center justify-between gap-3 p-3 rounded border transition-all ${
                  isActive
                    ? 'bg-neutral-950 border-neutral-700'
                    : 'bg-black border-neutral-900 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Toggle Checkbox */}
                  <button
                    onClick={() => onTogglePlayer(player.id)}
                    title={isActive ? 'Exclude from comparison' : 'Include in comparison'}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                      isActive
                        ? 'bg-white border-white text-black'
                        : 'border-neutral-700 bg-neutral-900 text-transparent hover:border-neutral-500'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </button>

                  {/* Avatar */}
                  <img
                    src={player.summary.avatar || 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg'}
                    alt={player.summary.personaname}
                    className="w-8 h-8 rounded object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                  />

                  {/* Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white truncate" title={player.summary.personaname}>
                        {player.summary.personaname || player.inputQuery}
                      </span>
                      {player.summary.profileurl && (
                        <a
                          href={player.summary.profileurl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-500 hover:text-white shrink-0"
                          title="Open Steam profile"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="mt-0.5">
                      {player.isPrivate ? (
                        <button
                          onClick={() => onOpenPrivacyGuide(player.summary.personaname)}
                          className="flex items-center gap-1 text-[11px] font-medium text-amber-400 hover:underline"
                          title="Click to view privacy fix guide"
                        >
                          <Lock className="w-3 h-3" />
                          <span>Private Profile</span>
                        </button>
                      ) : isError ? (
                        <span className="text-[11px] text-red-400 truncate block" title={player.error}>
                          {player.error}
                        </span>
                      ) : (
                        <span className="text-[11px] text-neutral-400">
                          <strong className="text-neutral-200">{player.gamesCount}</strong> games
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemovePlayer(player.id)}
                  title="Remove player"
                  className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
