'use client';

import React from 'react';
import { X, Lock, Globe } from 'lucide-react';

interface PrivateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  privatePlayerNames?: string[];
}

export function PrivateProfileModal({ isOpen, onClose, privatePlayerNames = [] }: PrivateProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="relative w-full max-w-lg rounded-lg bg-neutral-950 border border-neutral-800 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-white">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Steam Privacy Settings Guide</h3>
            <p className="text-xs text-neutral-400">How to make game libraries visible to the Steam Web API</p>
          </div>
        </div>

        {privatePlayerNames.length > 0 && (
          <div className="mb-4 p-3 rounded bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
            Private libraries detected for: <strong className="text-white">{privatePlayerNames.join(', ')}</strong>
          </div>
        )}

        <div className="space-y-3 mb-5 text-xs text-neutral-300">
          <div className="p-3 rounded bg-black border border-neutral-900">
            <div className="font-semibold text-white mb-1">1. Open Steam Privacy Settings</div>
            <p className="text-neutral-400">
              In Steam, go to your Profile → <strong>Edit Profile</strong> → <strong>Privacy Settings</strong>.
            </p>
          </div>

          <div className="p-3 rounded bg-black border border-neutral-900">
            <div className="font-semibold text-white mb-1">2. Set &quot;Game details&quot; to Public</div>
            <p className="text-neutral-400">
              Under <em>Game details</em>, select <strong className="text-white">Public</strong>.
            </p>
          </div>

          <div className="p-3 rounded bg-black border border-neutral-900">
            <div className="font-semibold text-white mb-1">3. Uncheck &quot;Keep total playtime private&quot;</div>
            <p className="text-neutral-400">
              Ensure playtime visibility is enabled to calculate group playtime stats.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
          <a
            href="https://steamcommunity.com/my/edit/settings"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white underline"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Open Steam Privacy Settings</span>
          </a>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
