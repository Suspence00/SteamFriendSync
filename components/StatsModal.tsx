'use client';

import React, { useState, useMemo } from 'react';
import { IntersectedGame, PlayerData } from '@/types/steam';
import {
  calculateLibraryStats,
  formatPlaytimeDetailed,
  LibraryStatsResult,
} from '@/lib/steam-stats';
import { formatPlaytime, getSteamStoreUrl, getSteamRunUrl } from '@/lib/utils';
import {
  X,
  BarChart3,
  Clock,
  TrendingUp,
  Layers,
  Filter,
  Check,
  Copy,
  Users,
  Trophy,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Play,
  Flame,
  Gamepad2,
  PieChart,
} from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  allGames: IntersectedGame[];
  displayedGames: IntersectedGame[];
  activePlayers: PlayerData[];
  activePresetLabel: string;
}

export function StatsModal({
  isOpen,
  onClose,
  allGames,
  displayedGames,
  activePlayers,
  activePresetLabel,
}: StatsModalProps) {
  // Player scope: 'all' (combined group) or specific steamid
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('all');

  // Library scope: 'all' (all unique games) or 'filtered' (current preset games)
  const [libraryScope, setLibraryScope] = useState<'all' | 'filtered'>('all');

  // Minimum playtime in hours (default 5 hours to exclude card-farming)
  const [minPlaytimeHours, setMinPlaytimeHours] = useState<number>(5);

  // Genre sorting
  const [genreSortBy, setGenreSortBy] = useState<'playtime' | 'games' | 'avg'>('playtime');

  // Expanded genre for viewing its top games
  const [expandedGenre, setExpandedGenre] = useState<string | null>(null);

  // Active view tab inside modal
  const [activeTab, setActiveTab] = useState<'overview' | 'genres' | 'top_games' | 'players'>('overview');

  // Copy status
  const [copied, setCopied] = useState(false);

  // Source games to analyze
  const gamesToAnalyze = libraryScope === 'filtered' ? displayedGames : allGames;

  // Compute statistics
  const stats: LibraryStatsResult = useMemo(() => {
    return calculateLibraryStats(gamesToAnalyze, activePlayers, {
      minPlaytimeMinutes: Math.max(0, Math.round(minPlaytimeHours * 60)),
      selectedPlayerId,
    });
  }, [gamesToAnalyze, activePlayers, minPlaytimeHours, selectedPlayerId]);

  // Selected player info
  const selectedPlayer = useMemo(() => {
    if (selectedPlayerId === 'all') return null;
    return activePlayers.find((p) => p.id === selectedPlayerId) || null;
  }, [selectedPlayerId, activePlayers]);

  // Sort genres
  const sortedGenres = useMemo(() => {
    const list = [...stats.genres];
    switch (genreSortBy) {
      case 'games':
        return list.sort((a, b) => b.gameCount - a.gameCount);
      case 'avg':
        return list.sort((a, b) => b.avgPlaytimeMinutes - a.avgPlaytimeMinutes);
      case 'playtime':
      default:
        return list.sort((a, b) => b.totalPlaytimeMinutes - a.totalPlaytimeMinutes);
    }
  }, [stats.genres, genreSortBy]);

  if (!isOpen) return null;

  const totalTimeFormatted = formatPlaytimeDetailed(stats.totalPlaytimeMinutes);
  const filteredTimeFormatted = formatPlaytimeDetailed(stats.filteredOutPlaytimeMinutes);

  const handleCopySummary = () => {
    const scopeLabel = selectedPlayer ? selectedPlayer.summary.personaname : 'Group Combined';
    const top3Genres = stats.genres
      .slice(0, 3)
      .map((g, i) => `  ${i + 1}. ${g.genre}: ${formatPlaytime(g.totalPlaytimeMinutes)} (${g.percentageOfTotal}%)`)
      .join('\n');

    const top3Games = stats.topGames
      .slice(0, 3)
      .map((g, i) => `  ${i + 1}. ${g.name}: ${formatPlaytime(g.playtimeMinutes)}`)
      .join('\n');

    const text = `🎮 SteamSync Playtime & Library Stats (${scopeLabel})
⏱️ Total Playtime: ${totalTimeFormatted.hoursStr} (${totalTimeFormatted.daysStr})
📊 Average Playtime: ${formatPlaytime(stats.avgPlaytimeMinutes)} per game
🎯 Qualifying Games: ${stats.qualifyingGamesCount} (Filter: ≥${minPlaytimeHours} hrs)
🚫 Excluded (< ${minPlaytimeHours}h / card farming): ${stats.filteredOutCount} games (${filteredTimeFormatted.hoursStr})
📦 Unplayed Backlog: ${stats.unplayedGamesCount} games

🏷️ Top Genres:
${top3Genres || '  None'}

🏆 Top Games:
${top3Games || '  None'}`;

    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden text-neutral-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-neutral-800 bg-neutral-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Library &amp; Playtime Statistics</span>
              </h2>
              <p className="text-xs text-neutral-400">
                Playtime breakdown by genre, average time per game, and card-farming filters.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
              title="Copy Summary to Clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Stats</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controls Toolbar: Scope Selectors & Tabs */}
        <div className="px-5 sm:px-6 py-3 border-b border-neutral-800 bg-black/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Player Scope Toggle */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>Scope:</span>
            </span>

            <button
              onClick={() => setSelectedPlayerId('all')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-colors ${
                selectedPlayerId === 'all'
                  ? 'bg-white text-black'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Group Combined ({activePlayers.length})</span>
            </button>

            {activePlayers.map((player) => (
              <button
                key={player.id}
                onClick={() => setSelectedPlayerId(player.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  selectedPlayerId === player.id
                    ? 'bg-white text-black'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                <img
                  src={player.summary.avatar || 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg'}
                  alt={player.summary.personaname}
                  className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
                />
                <span className="truncate max-w-[100px]">{player.summary.personaname}</span>
              </button>
            ))}
          </div>

          {/* Library Scope Selector & Internal Tabs */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 rounded bg-neutral-900 border border-neutral-800 text-xs">
              <button
                onClick={() => setLibraryScope('all')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  libraryScope === 'all' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Games ({allGames.length})
              </button>
              <button
                onClick={() => setLibraryScope('filtered')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  libraryScope === 'filtered' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {activePresetLabel} ({displayedGames.length})
              </button>
            </div>
          </div>
        </div>

        {/* Card Farming / Minimum Playtime Filter Banner */}
        <div className="px-5 sm:px-6 py-3 bg-neutral-950 border-b border-neutral-800/80 shrink-0">
          <div className="p-3 rounded-lg bg-neutral-900/70 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded bg-neutral-800 text-neutral-300">
                <Filter className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Trading Card Farming Filter (Min Playtime)</span>
                  {minPlaytimeHours === 5 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
                      Standard (~4-5h drops)
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-neutral-400">
                  Exclude games with fewer than {minPlaytimeHours} hours played from total playtime, averages, and genre stats.
                </div>
              </div>
            </div>

            {/* Threshold Quick Presets & Input */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setMinPlaytimeHours(0)}
                className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                  minPlaytimeHours === 0
                    ? 'bg-white text-black'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                0h (All)
              </button>

              <button
                onClick={() => setMinPlaytimeHours(1)}
                className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                  minPlaytimeHours === 1
                    ? 'bg-white text-black'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                1h+
              </button>

              <button
                onClick={() => setMinPlaytimeHours(5)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors border ${
                  minPlaytimeHours === 5
                    ? 'bg-white text-black border-white'
                    : 'bg-neutral-800 text-neutral-200 border-neutral-700 hover:text-white'
                }`}
                title="Filters out trading card farming idled games (typically 3.5 - 4.5 hours)"
              >
                ≥ 5h (Exclude Card Farms)
              </button>

              <button
                onClick={() => setMinPlaytimeHours(10)}
                className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                  minPlaytimeHours === 10
                    ? 'bg-white text-black'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                10h+
              </button>

              <div className="flex items-center gap-1 pl-1">
                <input
                  type="number"
                  min={0}
                  max={200}
                  value={minPlaytimeHours}
                  onChange={(e) => setMinPlaytimeHours(Math.max(0, Number(e.target.value) || 0))}
                  className="w-14 px-2 py-1 rounded bg-black text-xs font-bold text-white text-center border border-neutral-800 focus:outline-none focus:border-white"
                />
                <span className="text-xs text-neutral-500 font-medium">hrs</span>
              </div>
            </div>
          </div>

          {/* Feedback note on filtered out games */}
          {stats.filteredOutCount > 0 && (
            <div className="mt-2 text-xs text-neutral-400 flex items-center justify-between">
              <span>
                Filtered out <strong className="text-neutral-200">{stats.filteredOutCount} games</strong> with under {minPlaytimeHours} hrs (omitted <strong>{filteredTimeFormatted.hoursStr}</strong> of idle/card-farming time).
              </span>
              <button
                onClick={() => setMinPlaytimeHours(0)}
                className="text-[11px] text-neutral-400 hover:text-white underline ml-2"
              >
                Reset to 0h
              </button>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 sm:px-6 pt-3 pb-2 border-b border-neutral-800/80 bg-neutral-950 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Overview &amp; Distribution</span>
          </button>

          <button
            onClick={() => setActiveTab('genres')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'genres'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Playtime by Genre ({stats.genres.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('top_games')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'top_games'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Top Played Games</span>
          </button>

          {activePlayers.length > 1 && (
            <button
              onClick={() => setActiveTab('players')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'players'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Player Comparison ({activePlayers.length})</span>
            </button>
          )}
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-6">
          {/* Hero KPI Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Total Playtime Card */}
            <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Playtime</span>
                <Clock className="w-4 h-4 text-neutral-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                  {totalTimeFormatted.hoursStr}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  ≈ {totalTimeFormatted.daysStr} of game time
                </div>
              </div>
            </div>

            {/* Average Playtime Per Game Card */}
            <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Avg Playtime / Game</span>
                <TrendingUp className="w-4 h-4 text-neutral-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                  {formatPlaytime(stats.avgPlaytimeMinutes)}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  Across {stats.qualifyingGamesCount} qualifying games
                </div>
              </div>
            </div>

            {/* Median Playtime Card */}
            <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Median Playtime</span>
                <Flame className="w-4 h-4 text-neutral-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                  {formatPlaytime(stats.medianPlaytimeMinutes)}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  Midpoint across played games
                </div>
              </div>
            </div>

            {/* Library Composition Card */}
            <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Games Evaluated</span>
                <Layers className="w-4 h-4 text-neutral-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                  {stats.qualifyingGamesCount} <span className="text-sm font-normal text-neutral-400">/ {stats.totalGamesCount}</span>
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  {stats.unplayedGamesCount} unplayed (0h) • {stats.filteredOutCount} &lt;{minPlaytimeHours}h
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & DISTRIBUTION */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Playtime Distribution Histogram */}
              <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">Playtime Distribution</h3>
                    <p className="text-xs text-neutral-400">
                      Breakdown of all {stats.totalGamesCount} unique games by hours played.
                    </p>
                  </div>
                  <div className="text-xs text-neutral-400 font-mono">
                    {stats.qualifyingGamesCount} active games
                  </div>
                </div>

                {/* Stacked visual distribution bar */}
                <div className="h-3 w-full rounded-full bg-neutral-950 border border-neutral-800 flex overflow-hidden mb-3">
                  {stats.playtimeDistribution.map((b, i) => {
                    if (b.percentage <= 0) return null;
                    const shades = [
                      'bg-neutral-700', // unplayed
                      'bg-neutral-600', // < 5h
                      'bg-neutral-400', // 5-20h
                      'bg-neutral-300', // 20-50h
                      'bg-white',       // 50-100h
                      'bg-zinc-100',    // 100h+
                    ];
                    return (
                      <div
                        key={b.label}
                        style={{ width: `${b.percentage}%` }}
                        className={`${shades[i % shades.length]} h-full transition-all`}
                        title={`${b.label}: ${b.count} games (${b.percentage}%)`}
                      />
                    );
                  })}
                </div>

                {/* Legend & Count Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {stats.playtimeDistribution.map((b, i) => (
                    <div
                      key={b.label}
                      className="p-2.5 rounded bg-neutral-950 border border-neutral-800/80 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-white">{b.label}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">{b.percentage}%</span>
                      </div>
                      <div className="text-base font-bold text-neutral-200 font-mono">
                        {b.count} <span className="text-[11px] font-normal text-neutral-500">games</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate mt-1">
                        {b.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Two Column Grid: Top Genres Preview & Top Games Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Top Genres Preview */}
                <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <PieChart className="w-4 h-4 text-neutral-400" />
                      <span>Top Genres by Playtime</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('genres')}
                      className="text-xs text-neutral-400 hover:text-white underline font-medium"
                    >
                      View All ({stats.genres.length})
                    </button>
                  </div>

                  {stats.genres.length === 0 ? (
                    <div className="text-center py-8 text-xs text-neutral-500">
                      No games meet the current playtime filter (≥{minPlaytimeHours}h).
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stats.genres.slice(0, 5).map((g) => (
                        <div key={g.genre} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-neutral-200">{g.genre}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-neutral-400 font-mono">{formatPlaytime(g.totalPlaytimeMinutes)}</span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-neutral-800 text-neutral-300 font-mono font-bold">
                                {g.percentageOfTotal}%
                              </span>
                            </div>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-neutral-950 overflow-hidden">
                            <div
                              className="h-full bg-neutral-300 rounded-full"
                              style={{ width: `${Math.min(100, g.percentageOfTotal)}%` }}
                            />
                          </div>
                          <div className="text-[11px] text-neutral-500 flex items-center justify-between">
                            <span>{g.gameCount} games</span>
                            <span>{formatPlaytime(g.avgPlaytimeMinutes)} avg / game</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Top 5 Games Preview */}
                <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-neutral-400" />
                      <span>Most Played Games</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('top_games')}
                      className="text-xs text-neutral-400 hover:text-white underline font-medium"
                    >
                      View Top 10
                    </button>
                  </div>

                  {stats.topGames.length === 0 ? (
                    <div className="text-center py-8 text-xs text-neutral-500">
                      No games meet the current playtime filter (≥{minPlaytimeHours}h).
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {stats.topGames.slice(0, 5).map((game, idx) => (
                        <div
                          key={game.appid}
                          className="flex items-center justify-between gap-3 p-2 rounded bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xs font-bold text-neutral-500 w-4 text-center shrink-0">
                              #{idx + 1}
                            </span>
                            <img
                              src={game.iconUrl || 'https://via.placeholder.com/32x32/121212/888888?text=G'}
                              alt=""
                              className="w-7 h-7 rounded object-cover shrink-0 border border-neutral-800"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-white truncate" title={game.name}>
                                {game.name}
                              </h4>
                              <div className="text-[10px] text-neutral-400 flex items-center gap-1.5 truncate">
                                <span>{game.genres.slice(0, 2).join(', ')}</span>
                                {selectedPlayerId === 'all' && (
                                  <span>• {game.ownerCount} owners</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            <span className="text-xs font-bold text-neutral-200 font-mono">
                              {formatPlaytime(game.playtimeMinutes)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TOTAL PLAYTIME BY GENRE */}
          {activeTab === 'genres' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">All Playtime by Genre</h3>
                  <p className="text-xs text-neutral-400">
                    Aggregated total hours and games per genre (games with ≥{minPlaytimeHours}h playtime).
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-neutral-400 font-medium">Sort By:</span>
                  <select
                    value={genreSortBy}
                    onChange={(e) => setGenreSortBy(e.target.value as any)}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none"
                  >
                    <option value="playtime">Total Playtime (High → Low)</option>
                    <option value="games">Game Count (High → Low)</option>
                    <option value="avg">Avg Time per Game (High → Low)</option>
                  </select>
                </div>
              </div>

              {sortedGenres.length === 0 ? (
                <div className="text-center py-12 rounded-lg bg-neutral-900/40 border border-neutral-800 text-neutral-500 text-sm">
                  No genres found for qualifying games. Try adjusting the minimum playtime filter.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sortedGenres.map((genre) => {
                    const isExpanded = expandedGenre === genre.genre;

                    return (
                      <div
                        key={genre.genre}
                        className="p-3.5 rounded-lg bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors flex flex-col justify-between"
                      >
                        <div>
                          {/* Header row */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-bold text-sm text-white">{genre.genre}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white font-mono">
                                {formatPlaytime(genre.totalPlaytimeMinutes)}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300 font-mono">
                                {genre.percentageOfTotal}%
                              </span>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="h-2 w-full rounded-full bg-neutral-950 overflow-hidden mb-2">
                            <div
                              className="h-full bg-neutral-200 rounded-full transition-all"
                              style={{ width: `${Math.min(100, genre.percentageOfTotal)}%` }}
                            />
                          </div>

                          {/* Meta row */}
                          <div className="flex items-center justify-between text-xs text-neutral-400">
                            <span>{genre.gameCount} games in library</span>
                            <span>{formatPlaytime(genre.avgPlaytimeMinutes)} avg / game</span>
                          </div>
                        </div>

                        {/* Top games in genre toggle */}
                        {genre.topGames.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-neutral-800/80">
                            <button
                              onClick={() => setExpandedGenre(isExpanded ? null : genre.genre)}
                              className="flex items-center justify-between w-full text-xs text-neutral-400 hover:text-white transition-colors"
                            >
                              <span>Top games in {genre.genre}</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>

                            {isExpanded && (
                              <div className="mt-2 space-y-1.5 animate-in fade-in duration-150">
                                {genre.topGames.map((tg) => (
                                  <div
                                    key={tg.appid}
                                    className="flex items-center justify-between gap-2 px-2 py-1 rounded bg-black/60 border border-neutral-800 text-xs"
                                  >
                                    <span className="truncate text-neutral-200 font-medium">{tg.name}</span>
                                    <span className="shrink-0 text-neutral-400 font-mono font-bold">
                                      {formatPlaytime(tg.playtimeMinutes)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TOP PLAYED GAMES */}
          {activeTab === 'top_games' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Top 10 Most Played Games</h3>
                <p className="text-xs text-neutral-400">
                  Games with the highest playtime meeting the ≥{minPlaytimeHours}h threshold.
                </p>
              </div>

              {stats.topGames.length === 0 ? (
                <div className="text-center py-12 rounded-lg bg-neutral-900/40 border border-neutral-800 text-neutral-500 text-sm">
                  No games meet the current playtime filter (≥{minPlaytimeHours}h).
                </div>
              ) : (
                <div className="space-y-2.5">
                  {stats.topGames.map((game, index) => {
                    const maxPlaytime = stats.topGames[0]?.playtimeMinutes || 1;
                    const relativePercent = Math.round((game.playtimeMinutes / maxPlaytime) * 100);

                    return (
                      <div
                        key={game.appid}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Rank badge */}
                          <div className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs shrink-0 ${
                            index === 0
                              ? 'bg-white text-black'
                              : index === 1
                              ? 'bg-neutral-200 text-black'
                              : index === 2
                              ? 'bg-neutral-400 text-black'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}>
                            #{index + 1}
                          </div>

                          {/* Capsule / Icon */}
                          <div className="w-16 h-8 sm:w-20 sm:h-10 rounded overflow-hidden bg-black shrink-0 border border-neutral-800">
                            <img
                              src={game.headerUrl}
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate group-hover:underline">
                              {game.name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              {game.genres.slice(0, 3).map((g) => (
                                <span
                                  key={g}
                                  className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-neutral-950 text-neutral-400 border border-neutral-800"
                                >
                                  {g}
                                </span>
                              ))}
                              {selectedPlayerId === 'all' && (
                                <span className="text-[10px] text-neutral-500">
                                  • {game.ownerCount} / {activePlayers.length} own
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right side stats & actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/80">
                          <div className="text-left sm:text-right">
                            <div className="text-sm font-bold text-white font-mono">
                              {formatPlaytime(game.playtimeMinutes)}
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              {stats.totalPlaytimeMinutes > 0
                                ? `${Math.round((game.playtimeMinutes / stats.totalPlaytimeMinutes) * 1000) / 10}% of total`
                                : ''}
                            </div>
                          </div>

                          {/* Action Links */}
                          <div className="flex items-center gap-1.5">
                            <a
                              href={getSteamRunUrl(game.appid)}
                              className="p-1.5 rounded bg-neutral-800 hover:bg-white hover:text-black text-neutral-300 transition-colors"
                              title="Launch in Steam"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </a>
                            <a
                              href={getSteamStoreUrl(game.appid)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                              title="View Steam Store"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PLAYER COMPARISON */}
          {activeTab === 'players' && activePlayers.length > 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Player Comparison</h3>
                <p className="text-xs text-neutral-400">
                  Side-by-side comparison of active players (excluding games with &lt;{minPlaytimeHours}h).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {stats.playerSummaries.map((ps) => {
                  const pTimeFormatted = formatPlaytimeDetailed(ps.totalPlaytimeMinutes);

                  return (
                    <div
                      key={ps.steamid}
                      className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 flex flex-col justify-between"
                    >
                      <div>
                        {/* Player Header */}
                        <div className="flex items-center gap-3 pb-3 border-b border-neutral-800">
                          <img
                            src={ps.avatar || 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg'}
                            alt={ps.personaname}
                            className="w-10 h-10 rounded-full object-cover border border-neutral-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">
                              {ps.personaname}
                            </h4>
                            <span className="text-xs text-neutral-400 font-mono">
                              {pTimeFormatted.hoursStr}
                            </span>
                          </div>
                        </div>

                        {/* Player Metrics */}
                        <div className="space-y-2 py-3 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400">Qualifying Games:</span>
                            <span className="font-bold text-white font-mono">{ps.qualifyingGamesCount}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400">Avg Playtime:</span>
                            <span className="font-bold text-white font-mono">{formatPlaytime(ps.avgPlaytimeMinutes)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400">Card Farmed (&lt;{minPlaytimeHours}h):</span>
                            <span className="font-bold text-neutral-300 font-mono">{ps.filteredOutCount} games</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400">Unplayed Backlog:</span>
                            <span className="font-bold text-neutral-500 font-mono">{ps.unplayedGamesCount} games</span>
                          </div>
                          {ps.topGenre && (
                            <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80">
                              <span className="text-neutral-400">Favorite Genre:</span>
                              <span className="font-bold text-white">{ps.topGenre}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Top Game for this player */}
                      {ps.topGame && (
                        <div className="mt-2 p-2.5 rounded bg-black/60 border border-neutral-800/80 text-xs">
                          <div className="text-[10px] uppercase font-bold text-neutral-500 mb-0.5">
                            Most Played
                          </div>
                          <div className="font-bold text-neutral-200 truncate">{ps.topGame.name}</div>
                          <div className="text-neutral-400 font-mono font-semibold">
                            {formatPlaytime(ps.topGame.playtimeMinutes)}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-t border-neutral-800 bg-neutral-900/60 shrink-0 text-xs text-neutral-500">
          <span>
            Calculated from Steam Web API playtime records.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
