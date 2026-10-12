/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { usePropertyStore, AppView } from '../../store';
import { Layers, Sparkles, RefreshCw, GitCompare } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeView, setActiveView, resetDemoCity, openComparison } = usePropertyStore();

  const navLinks: { label: string; view: AppView }[] = [
    { label: 'Dashboard', view: 'dashboard' },
    { label: '3D GIS Map', view: 'map' },
    { label: 'ULPIN Generator', view: 'ulpin' },
    { label: 'Properties', view: 'properties' },
    { label: 'Analytics', view: 'analytics' },
    { label: 'About', view: 'about' },
  ];

  return (
    <header className="sticky top-0 z-50 h-16 bg-[#0F172A] border-b border-slate-800 text-white flex items-center justify-between px-4 sm:px-6 shadow-sm">
      {/* Zone 1: Brand title wordmark (Single text element) */}
      <button
        onClick={() => setActiveView('landing')}
        className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-95"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-sm tracking-tighter">
          3D
        </div>
        <span className="text-lg font-bold tracking-tight text-white font-display">
          BhuSetu 3D
        </span>
      </button>

      {/* Zone 2: 4–6 text navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
        {navLinks.map((item) => {
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`whitespace-nowrap transition-colors py-1 relative ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {item.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => openComparison()}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 whitespace-nowrap"
          title="Compare two cadastral parcels side by side"
        >
          <GitCompare className="w-3.5 h-3.5 text-blue-400" />
          <span>Compare</span>
        </button>

        <button
          onClick={() => {
            resetDemoCity();
            setActiveView('map');
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm whitespace-nowrap active:scale-[0.98]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Demo City</span>
        </button>
      </div>
    </header>
  );
};
