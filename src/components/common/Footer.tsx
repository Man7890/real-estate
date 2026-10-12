/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { usePropertyStore } from '../../store';

export const Footer: React.FC = () => {
  const { setActiveView } = usePropertyStore();

  return (
    <footer className="border-t border-slate-200 bg-white py-6 px-4 sm:px-6 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span className="font-semibold text-slate-800">BhuSetu 3D</span>
          <span className="hidden sm:inline text-slate-300">·</span>
          <span>3D ULPIN Generation &amp; Vertical Property Mapping System</span>
          <span className="hidden sm:inline text-slate-300">·</span>
          <span className="text-slate-500">Hackathon Prototype</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={() => setActiveView('about')}
            className="hover:text-slate-900 transition-colors underline-offset-4 hover:underline"
          >
            Methodology
          </button>
          <button
            onClick={() => setActiveView('ulpin')}
            className="hover:text-slate-900 transition-colors underline-offset-4 hover:underline"
          >
            ULPIN Algorithm
          </button>
          <button
            onClick={() => setActiveView('map')}
            className="hover:text-slate-900 transition-colors underline-offset-4 hover:underline"
          >
            GIS Explorer
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
        Notice: BhuSetu 3D is a hackathon prototype. ULPINs shown in this application are demonstration identifiers and are not official government land records.
      </div>
    </footer>
  );
};
