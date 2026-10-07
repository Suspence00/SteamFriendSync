'use client';

import React, { useState } from 'react';
import { Share2, RefreshCw, Check, BarChart3 } from 'lucide-react';

interface NavbarProps {
  onOpenPrivacyGuide: (playerName?: string) => void;
  onOpenStats: () => void;
  onRefreshAll: () => void;
  isLoading: boolean;
  playerCount: number;
}

export function Navbar({
  onOpenPrivacyGuide,
  onOpenStats,
  onRefreshAll,
  isLoading,
  playerCount,
}: NavbarProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight text-white">SteamSync</span>
          <span className="hidden sm:inline-block text-xs text-neutral-500 font-medium pl-3 border-l border-neutral-800">
            Shared Library &amp; Overlap Finder
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {playerCount > 0 && (
            <button
              onClick={onOpenStats}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-neutral-900 text-neutral-200 hover:text-white hover:bg-neutral-800 border border-neutral-700 transition-colors"
              title="View Library & Playtime Statistics"
            >
              <BarChart3 className="w-3.5 h-3.5 text-neutral-400" />
              <span>Stats</span>
            </button>
          )}

          <button
            onClick={() => onOpenPrivacyGuide()}
            className="px-3 py-1.5 text-xs font-medium rounded bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800 transition-colors hidden sm:block"
            title="Steam Privacy Settings Guide"
          >
            Privacy Help
          </button>

          {playerCount > 0 && (
            <button
              onClick={onRefreshAll}
              disabled={isLoading}
              className="p-1.5 text-xs font-medium rounded bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800 disabled:opacity-50 transition-colors"
              title="Refresh All Libraries"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-white' : ''}`} />
            </button>
          )}

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded bg-white text-black hover:bg-neutral-200 transition-colors"
            title="Copy Shareable Link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
