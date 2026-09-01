'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PlayerData, FilterPreset, SortOption, ViewMode, IntersectedGame } from '@/types/steam';
import { calculateLibraryIntersections } from '@/lib/steam-intersections';
import { Navbar } from '@/components/Navbar';
import { PlayerBar } from '@/components/PlayerBar';
import { FilterBar } from '@/components/FilterBar';
import { GameCard } from '@/components/GameCard';
import { GameTable } from '@/components/GameTable';
import { ExactCombinationsView } from '@/components/ExactCombinationsView';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { PrivateProfileModal } from '@/components/PrivateProfileModal';
import { AlertCircle, Users } from 'lucide-react';

export default function HomePage() {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [activePlayerIds, setActivePlayerIds] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dynamicTags, setDynamicTags] = useState<Record<number, { categories: string[]; genres: string[] }>>({});

  // Modals
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [privacyFocusPlayer, setPrivacyFocusPlayer] = useState<string | undefined>();

  // Filters & State
  const [activePreset, setActivePreset] = useState<FilterPreset>('all_own');
  const [thresholdVal, setThresholdVal] = useState<number>(2);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('playtime_desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedMatrixPlayerIds, setSelectedMatrixPlayerIds] = useState<string[]>([]);

  // Load API Key from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('steam_api_key') || '';
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    if (typeof window !== 'undefined') {
      if (key) {
        localStorage.setItem('steam_api_key', key);
      } else {
        localStorage.removeItem('steam_api_key');
      }
    }
  };

  // Sync state to URL params
  const updateUrlParams = useCallback((playerList: PlayerData[]) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (playerList.length > 0) {
      const idsOrNames = playerList.map((p) => p.inputQuery || p.id).join(',');
      url.searchParams.set('users', idsOrNames);
    } else {
      url.searchParams.delete('users');
    }
    window.history.replaceState({}, '', url.toString());
  }, []);

  // Fetch games for players
  const fetchLibrariesForPlayers = async (
    playerSummaries: PlayerData[],
    keyToUse: string
  ): Promise<PlayerData[]> => {
    try {
      const playerIds = playerSummaries.filter((p) => p.id && !p.isPrivate).map((p) => p.id);
      if (playerIds.length === 0) return playerSummaries;

      const res = await fetch('/api/steam/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerIds, apiKey: keyToUse }),
      });

      if (!res.ok) throw new Error('Failed to fetch owned games');
      const data = await res.json();
      const libraries = data.libraries || {};

      return playerSummaries.map((p) => {
        const lib = libraries[p.id];
        if (!lib) return p;
        return {
          ...p,
          games: lib.games || [],
          gamesCount: lib.gamesCount || (lib.games ? lib.games.length : 0),
          isPrivate: lib.isPrivate || false,
          error: lib.error || p.error,
        };
      });
    } catch (err: unknown) {
      console.error('Error fetching libraries:', err);
      return playerSummaries;
    }
  };

  // Background fetch store tags for unique appids
  const fetchStoreTagsForGames = useCallback(async (playerList: PlayerData[]) => {
    const appidSet = new Set<number>();
    playerList.forEach((p) => {
      (p.games || []).forEach((g) => appidSet.add(g.appid));
    });

    const appids = Array.from(appidSet);
    if (appids.length === 0) return;

    try {
      const res = await fetch('/api/steam/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appids }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.tags) {
          setDynamicTags((prev) => ({ ...prev, ...json.tags }));
        }
      }
    } catch {
      // Ignore background tag fetch failures
    }
  }, []);

  // Resolve and load players
  const resolveAndLoadPlayers = async (inputs: string[], keyToUse: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/steam/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs, apiKey: keyToUse }),
      });

      if (!res.ok) throw new Error('Failed to resolve users');
      const data = await res.json();
      const resolvedPlayers: PlayerData[] = data.players || [];

      // Fetch owned games for resolved users
      const enrichedPlayers = await fetchLibrariesForPlayers(resolvedPlayers, keyToUse);

      setPlayers(enrichedPlayers);
      const validIds = enrichedPlayers.filter((p) => p.id).map((p) => p.id);
      setActivePlayerIds(validIds);
      updateUrlParams(enrichedPlayers);

      // Fetch Store tags in background
      fetchStoreTagsForGames(enrichedPlayers);
    } catch (err: unknown) {
      console.error('Error resolving players:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load from URL params on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const usersParam = url.searchParams.get('users');

    if (usersParam) {
      const inputList = usersParam.split(',').map((s) => s.trim()).filter(Boolean);
      if (inputList.length > 0) {
        const savedKey = localStorage.getItem('steam_api_key') || '';
        resolveAndLoadPlayers(inputList, savedKey);
      }
    }
  }, []);

  // Add a single player
  const handleAddPlayer = async (input: string) => {
    const existing = players.find(
      (p) => p.id === input || p.inputQuery.toLowerCase() === input.toLowerCase()
    );
    if (existing) {
      throw new Error(`Player "${input}" is already in your list.`);
    }

    const res = await fetch('/api/steam/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: [input], apiKey }),
    });

    if (!res.ok) throw new Error('Could not connect to Steam service');
    const data = await res.json();
    const resolved: PlayerData[] = data.players || [];

    if (resolved.length === 0 || !resolved[0].id) {
      throw new Error(resolved[0]?.error || `Could not find Steam profile for "${input}"`);
    }

    const newPlayer = resolved[0];
    const enriched = await fetchLibrariesForPlayers([newPlayer], apiKey);
    const fullPlayer = enriched[0];

    const updated = [...players, fullPlayer];
    setPlayers(updated);
    if (fullPlayer.id) {
      setActivePlayerIds((prev) => [...prev, fullPlayer.id]);
    }
    updateUrlParams(updated);
    fetchStoreTagsForGames(updated);
  };

  const handleTogglePlayer = (id: string) => {
    setActivePlayerIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleRemovePlayer = (id: string) => {
    const updated = players.filter((p) => p.id !== id);
    setPlayers(updated);
    setActivePlayerIds((prev) => prev.filter((pId) => pId !== id));
    updateUrlParams(updated);
  };

  const handleRefreshAll = () => {
    if (players.length > 0) {
      const inputs = players.map((p) => p.inputQuery || p.id);
      resolveAndLoadPlayers(inputs, apiKey);
    }
  };

  const handleToggleMatrixPlayer = (id: string) => {
    setSelectedMatrixPlayerIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleClearMatrixFilter = () => {
    setSelectedMatrixPlayerIds([]);
  };

  // Tag filter handlers
  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  // Calculate Intersections
  const intersectionResults = useMemo(() => {
    return calculateLibraryIntersections(players, activePlayerIds, thresholdVal, dynamicTags);
  }, [players, activePlayerIds, thresholdVal, dynamicTags]);

  const activePlayers = useMemo(() => {
    return players.filter((p) => activePlayerIds.includes(p.id) && !p.isPrivate);
  }, [players, activePlayerIds]);

  const privatePlayers = useMemo(() => {
    return players.filter((p) => p.isPrivate);
  }, [players]);

  // All unique available tags for search auto-complete
  const allAvailableTags = useMemo(() => {
    const tagSet = new Set<string>();
    intersectionResults.allGames.forEach((g) => {
      (g.categories || []).forEach((c) => tagSet.add(c));
      (g.genres || []).forEach((gen) => tagSet.add(gen));
    });

    const common = [
      'Co-op',
      'Online Co-op',
      'PvP',
      'Online PvP',
      'Multi-player',
      'Cross-Platform Multiplayer',
      'LAN Co-op',
      'Shared/Split Screen',
      'Single-player',
      'Survival',
      'Open World',
      'RPG',
      'Action',
      'FPS',
      'Shooter',
      'Strategy',
      'Adventure',
      'Simulation',
      'Horror',
      'Roguelike',
      'Puzzle',
      'Sandbox',
      'Crafting',
      'Indie',
      'Casual',
    ];

    common.forEach((c) => tagSet.add(c));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [intersectionResults]);

  // Filtered and Sorted Games
  const displayedGames = useMemo(() => {
    let list: IntersectedGame[] = [];

    switch (activePreset) {
      case 'all_own':
        list = intersectionResults.fullMatches;
        break;
      case 'missing_one':
        list = intersectionResults.missingOneMatches;
        break;
      case 'threshold':
        list = intersectionResults.thresholdMatches;
        break;
      case 'combinations':
        list = intersectionResults.allGames;
        break;
      case 'all':
      default:
        list = intersectionResults.allGames;
        break;
    }

    if (selectedMatrixPlayerIds.length > 0) {
      list = list.filter((game) => {
        const ownerIdSet = new Set(game.owners.map((o) => o.steamid));
        return selectedMatrixPlayerIds.every((id) => ownerIdSet.has(id));
      });
    }

    // Filter by multiple selected tags
    if (selectedTags.length > 0) {
      list = list.filter((game) => {
        const cats = (game.categories || []).map((c) => c.toLowerCase());
        const gens = (game.genres || []).map((g) => g.toLowerCase());
        const nameLower = game.name.toLowerCase();
        const gameTags = [...cats, ...gens];

        return selectedTags.every((selTag) => {
          const tLower = selTag.toLowerCase().trim();
          if (!tLower) return true;

          // Co-op variations
          if (tLower === 'co-op' || tLower === 'coop') {
            return gameTags.some((t) => t.includes('co-op') || t.includes('coop')) || nameLower.includes('co-op');
          }
          // PvP variations
          if (tLower === 'pvp' || tLower === 'online pvp') {
            return gameTags.some((t) => t.includes('pvp') || t.includes('versus') || t.includes('competitive'));
          }
          // Crafting variations
          if (tLower.includes('craft')) {
            return gameTags.some((t) => t.includes('craft') || t.includes('building') || t.includes('sandbox')) || nameLower.includes('craft');
          }
          // Survival variations
          if (tLower.includes('survival')) {
            return gameTags.some((t) => t.includes('survival') || t.includes('open world survival')) || nameLower.includes('survival');
          }

          // General substring match
          return gameTags.some((t) => t.includes(tLower) || tLower.includes(t)) || nameLower.includes(tLower);
        });
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((game) => game.name.toLowerCase().includes(q));
    }

    const sorted = [...list].sort((a, b) => {
      switch (sortOption) {
        case 'playtime_desc':
          return b.totalGroupPlaytimeMinutes - a.totalGroupPlaytimeMinutes;
        case 'owners_desc':
          return b.ownerCount - a.ownerCount || b.totalGroupPlaytimeMinutes - a.totalGroupPlaytimeMinutes;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [
    intersectionResults,
    activePreset,
    selectedMatrixPlayerIds,
    selectedTags,
    searchQuery,
    sortOption,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white text-base">
      {/* Header */}
      <Navbar
        onOpenApiKey={() => setIsApiKeyOpen(true)}
        onOpenPrivacyGuide={(name) => {
          setPrivacyFocusPlayer(name);
          setIsPrivacyOpen(true);
        }}
        onRefreshAll={handleRefreshAll}
        isLoading={isLoading}
        playerCount={players.length}
      />

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {/* Player Bar */}
        <PlayerBar
          players={players}
          activePlayerIds={activePlayerIds}
          onTogglePlayer={handleTogglePlayer}
          onRemovePlayer={handleRemovePlayer}
          onAddPlayer={handleAddPlayer}
          onOpenPrivacyGuide={(name) => {
            setPrivacyFocusPlayer(name);
            setIsPrivacyOpen(true);
          }}
          isLoading={isLoading}
        />

        {/* Private Profile Warning Banner */}
        {privatePlayers.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
            <div className="p-3.5 rounded bg-neutral-950 border border-neutral-800 text-sm text-neutral-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>
                  <strong>{privatePlayers.map((p) => p.summary.personaname).join(', ')}</strong> has a private Steam library. Set game details to Public in Steam Privacy Settings to match games.
                </span>
              </div>
              <button
                onClick={() => {
                  setPrivacyFocusPlayer(privatePlayers[0]?.summary.personaname);
                  setIsPrivacyOpen(true);
                }}
                className="px-3 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs whitespace-nowrap border border-neutral-700 transition-colors"
              >
                How to Fix
              </button>
            </div>
          </div>
        )}

        {/* Filter and View Controls */}
        {activePlayers.length > 0 && (
          <FilterBar
            activePreset={activePreset}
            onSelectPreset={setActivePreset}
            counts={{
              full: intersectionResults.fullMatches.length,
              missingOne: intersectionResults.missingOneMatches.length,
              threshold: intersectionResults.thresholdMatches.length,
              combinations: intersectionResults.exactCombinations.length,
              all: intersectionResults.totalUniqueGames,
            }}
            activePlayerCount={activePlayers.length}
            thresholdVal={thresholdVal}
            onChangeThreshold={setThresholdVal}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortOption={sortOption}
            onSortChange={setSortOption}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedTags={selectedTags}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            onClearTags={handleClearTags}
            allAvailableTags={allAvailableTags}
            activePlayers={activePlayers}
            selectedMatrixPlayerIds={selectedMatrixPlayerIds}
            onToggleMatrixPlayer={handleToggleMatrixPlayer}
            onClearMatrixFilter={handleClearMatrixFilter}
          />
        )}

        {/* Games Display Area */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
          {activePlayers.length === 0 ? (
            <div className="text-center py-20 px-4 rounded-lg bg-neutral-950 border border-neutral-800 mt-6 max-w-xl mx-auto">
              <Users className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No Players Added</h3>
              <p className="text-sm text-neutral-400 max-w-sm mx-auto">
                Add 2 or more Steam players using their SteamID64, profile link, or vanity username above to compare game libraries.
              </p>
            </div>
          ) : activePreset === 'combinations' ? (
            <ExactCombinationsView
              combinations={intersectionResults.exactCombinations}
              activePlayers={activePlayers}
              viewMode={viewMode}
            />
          ) : displayedGames.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400">
              <h4 className="text-base font-semibold text-white">No games match current filter</h4>
              <p className="text-sm text-neutral-500 mt-1">
                Try selecting a different filter tab, clearing search or active tag filters.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedGames.map((game) => (
                <GameCard key={game.appid} game={game} activePlayers={activePlayers} />
              ))}
            </div>
          ) : (
            <GameTable games={displayedGames} activePlayers={activePlayers} />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-900 bg-black py-8 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-neutral-300">SteamSync</span> — Steam Shared Library &amp; Overlap Finder
          </div>
          <div className="text-[11px] text-neutral-600">
            Powered by Steam® Web API. Not affiliated with Valve Corporation.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      <PrivateProfileModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        privatePlayerNames={privatePlayers.map((p) => p.summary.personaname)}
      />
    </div>
  );
}
