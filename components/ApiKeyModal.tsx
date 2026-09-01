'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, ExternalLink, ShieldCheck, Check } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export function ApiKeyModal({ isOpen, onClose, apiKey, onSaveApiKey }: ApiKeyModalProps) {
  const [keyInput, setKeyInput] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKeyInput(apiKey);
  }, [apiKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(keyInput.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setKeyInput('');
    onSaveApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="relative w-full max-w-md rounded-lg bg-neutral-950 border border-neutral-800 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-white">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Steam Web API Key</h3>
            <p className="text-xs text-neutral-400">Required to query live Steam profiles and libraries</p>
          </div>
        </div>

        <div className="text-xs text-neutral-300 space-y-2.5 mb-5 bg-black rounded p-3.5 border border-neutral-900">
          <p>
            You can enter your API Key below or configure <code className="px-1.5 py-0.5 rounded bg-neutral-900 text-white font-mono text-[11px]">STEAM_API_KEY</code> in your <code className="px-1.5 py-0.5 rounded bg-neutral-900 text-white font-mono text-[11px]">.env.local</code> file.
          </p>
          <div className="flex items-center gap-2 text-white hover:underline">
            <ExternalLink className="w-3.5 h-3.5" />
            <a href="https://steamcommunity.com/dev/apikey" target="_blank" rel="noopener noreferrer">
              Get your Steam Web API Key
            </a>
          </div>
          <div className="flex items-center gap-2 text-neutral-500 text-[11px] pt-2 border-t border-neutral-900">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>Stored in your local browser session only.</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">API Key (32-character Hex)</label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="e.g. 8A3F9C7D1E2B4A5F6..."
              className="w-full px-3 py-2 rounded bg-black text-white text-xs font-mono border border-neutral-800 focus:border-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            {apiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-400 hover:underline"
              >
                Clear Key
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium rounded border border-neutral-800 text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded bg-white text-black hover:bg-neutral-200 shadow-sm"
              >
                {saved ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Key</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
