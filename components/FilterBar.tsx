'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FilterPreset, SortOption, ViewMode, PlayerData } from '@/types/steam';
import { Search, LayoutGrid, Table, Layers, Filter, Plus, X, Tag } from 'lucide-react';

interface FilterBarProps {
  activePreset: FilterPreset;
  onSelectPreset: (preset: FilterPreset) => void;
  counts: {
    full: number;
    missingOne: number;
    threshold: number;
    combinations: number;
    all: number;
  };
  activePlayerCount: number;
  thresholdVal: number;
  onChangeThreshold: (val: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onClearTags: () => void;
  allAvailableTags: string[];
  activePlayers: PlayerData[];
  selectedMatrixPlayerIds: string[];
  onToggleMatrixPlayer: (id: string) => void;
  onClearMatrixFilter: () => void;
}

export function FilterBar({
  activePreset,
  onSelectPreset,
  counts,
  activePlayerCount,
  thresholdVal,
  onChangeThreshold,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  selectedTags,
  onAddTag,
  onRemoveTag,
  onClearTags,
  allAvailableTags,
  activePlayers,
  selectedMatrixPlayerIds,
  onToggleMatrixPlayer,
  onClearMatrixFilter,
}: FilterBarProps) {
  const [tagSearchInput, setTagSearchInput] = useState('');
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(e.target as Node)) {
        setIsTagDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matchingTags = allAvailableTags.filter(
    (t) =>
      !selectedTags.includes(t) &&
      t.toLowerCase().includes(tagSearchInput.toLowerCase().trim())
  );

  const handleSelectTag = (tag: string) => {
    onAddTag(tag);
    setTagSearchInput('');
    setIsTagDropdownOpen(false);
  };

  const handleCustomTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tagSearchInput.trim()) {
      onAddTag(tagSearchInput.trim());
      setTagSearchInput('');
      setIsTagDropdownOpen(false);
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3.5">
      {/* Preset Tabs & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-neutral-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset: All Own */}
          <button
            onClick={() => onSelectPreset('all_own')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded text-sm font-bold transition-colors ${
              activePreset === 'all_own'
                ? 'bg-white text-black'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <span>All Own ({activePlayerCount}/{activePlayerCount})</span>
            <span
              className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                activePreset === 'all_own' ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {counts.full}
            </span>
          </button>

          {/* Preset: Missing 1 Player */}
          {activePlayerCount >= 3 && (
            <button
              onClick={() => onSelectPreset('missing_one')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded text-sm font-bold transition-colors ${
                activePreset === 'missing_one'
                  ? 'bg-white text-black'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <span>Missing 1 ({activePlayerCount - 1}/{activePlayerCount})</span>
              <span
                className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                  activePreset === 'missing_one' ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {counts.missingOne}
              </span>
            </button>
          )}

          {/* Preset: At Least M */}
          {activePlayerCount > 2 && (
            <div className="flex items-center">
              <button
                onClick={() => onSelectPreset('threshold')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-l text-sm font-bold transition-colors ${
                  activePreset === 'threshold'
                    ? 'bg-white text-black'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 border-r-0'
                }`}
              >
                <span>At Least {thresholdVal}+</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                    activePreset === 'threshold' ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {counts.threshold}
                </span>
              </button>

              <select
                value={thresholdVal}
                onChange={(e) => {
                  onChangeThreshold(Number(e.target.value));
                  onSelectPreset('threshold');
                }}
                className={`h-[36px] px-2 text-sm font-semibold rounded-r border border-l-0 bg-neutral-900 text-white focus:outline-none ${
                  activePreset === 'threshold' ? 'border-white bg-neutral-100 text-black' : 'border-neutral-800'
                }`}
              >
                {Array.from({ length: Math.max(0, activePlayerCount - 1) }, (_, i) => i + 2).map((num) => (
                  <option key={num} value={num}>
                    ≥ {num} Players
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Preset: Subsets */}
          <button
            onClick={() => onSelectPreset('combinations')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded text-sm font-bold transition-colors ${
              activePreset === 'combinations'
                ? 'bg-white text-black'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <span>Subsets</span>
            <span
              className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                activePreset === 'combinations' ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {counts.combinations}
            </span>
          </button>

          {/* Preset: All Games */}
          <button
            onClick={() => onSelectPreset('all')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded text-sm font-bold transition-colors ${
              activePreset === 'all'
                ? 'bg-white text-black'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <span>All Games</span>
            <span
              className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                activePreset === 'all' ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {counts.all}
            </span>
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded border border-neutral-800">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
              viewMode === 'grid'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
              viewMode === 'table'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Filter by Specific Players */}
      {activePlayers.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Must Be Owned By:</span>
          </span>
          {activePlayers.map((player) => {
            const isSelected = selectedMatrixPlayerIds.includes(player.id);

            return (
              <button
                key={player.id}
                onClick={() => onToggleMatrixPlayer(player.id)}
                className={`px-3 py-1 rounded text-sm font-medium border transition-colors ${
                  isSelected
                    ? 'border-white bg-white text-black font-semibold'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-white'
                }`}
              >
                {player.summary.personaname}
              </button>
            );
          })}

          {selectedMatrixPlayerIds.length > 0 && (
            <button
              onClick={onClearMatrixFilter}
              className="text-xs text-neutral-400 hover:text-white underline ml-1"
            >
              Reset owners filter
            </button>
          )}
        </div>
      )}

      {/* Search Input, Searchable Tag Input, and Sort */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
        {/* Game Title Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search game title..."
            className="w-full pl-9 pr-3.5 py-2 text-sm rounded bg-neutral-950 text-white placeholder:text-neutral-500 border border-neutral-800 focus:border-white focus:outline-none"
          />
        </div>

        {/* Searchable Tag Input with Auto-complete Dropdown */}
        <div className="relative flex-1 max-w-md" ref={tagDropdownRef}>
          <form onSubmit={handleCustomTagSubmit} className="relative">
            <Tag className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tagSearchInput}
              onChange={(e) => {
                setTagSearchInput(e.target.value);
                setIsTagDropdownOpen(true);
              }}
              onFocus={() => setIsTagDropdownOpen(true)}
              placeholder="Filter by Steam tag (e.g. Co-op, Survival, Roguelike)..."
              className="w-full pl-9 pr-8 py-2 text-sm rounded bg-neutral-950 text-white placeholder:text-neutral-500 border border-neutral-800 focus:border-white focus:outline-none"
            />
            {tagSearchInput.trim() && (
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white"
                title="Add tag filter"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown */}
          {isTagDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-lg bg-neutral-950 border border-neutral-800 shadow-2xl z-30 p-1.5">
              {matchingTags.length > 0 ? (
                matchingTags.slice(0, 15).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleSelectTag(t)}
                    className="w-full text-left px-3 py-1.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-900 rounded font-medium transition-colors flex items-center justify-between"
                  >
                    <span>{t}</span>
                    <Plus className="w-3.5 h-3.5 text-neutral-500" />
                  </button>
                ))
              ) : tagSearchInput.trim() ? (
                <button
                  type="button"
                  onClick={() => handleSelectTag(tagSearchInput.trim())}
                  className="w-full text-left px-3 py-2 text-xs text-white bg-neutral-900 rounded font-semibold flex items-center justify-between"
                >
                  <span>Filter by &quot;{tagSearchInput.trim()}&quot;</span>
                  <Plus className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="px-3 py-2 text-xs text-neutral-500">
                  Type a tag name to search (e.g. Survival Crafting, PvP, Open World)...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-neutral-400 hidden lg:inline font-medium">Sort:</span>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-2 text-sm font-semibold rounded border border-neutral-800 bg-neutral-950 text-white focus:outline-none focus:border-white"
          >
            <option value="playtime_desc">Group Playtime (High → Low)</option>
            <option value="owners_desc">Owner Count (High → Low)</option>
            <option value="name_asc">Title (A → Z)</option>
            <option value="name_desc">Title (Z → A)</option>
          </select>
        </div>
      </div>

      {/* Selected Tag Filter Badges */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-neutral-400">Active Tag Filters:</span>
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white text-black text-xs font-bold"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="hover:text-red-600 transition-colors"
                title="Remove tag filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={onClearTags}
            className="text-xs text-neutral-400 hover:text-white underline ml-1"
          >
            Clear all tags
          </button>
        </div>
      )}
    </section>
  );
}
