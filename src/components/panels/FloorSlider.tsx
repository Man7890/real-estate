/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Floor } from '../../types';
import { Building2, ArrowUp, ArrowDown } from 'lucide-react';

interface FloorSliderProps {
  floors: Floor[];
  selectedFloorId: string | null;
  onSelectFloor: (floorId: string) => void;
  className?: string;
}

export const FloorSlider: React.FC<FloorSliderProps> = ({
  floors,
  selectedFloorId,
  onSelectFloor,
  className = '',
}) => {
  // Sort floors top-down (highest floor number at top, ground at bottom)
  const reversedFloors = [...floors].sort((a, b) => b.floorNumber - a.floorNumber);

  return (
    <div className={`bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 text-white flex flex-col gap-2 shadow-lg ${className}`}>
      <div className="flex items-center justify-between text-xs text-slate-300 font-semibold border-b border-slate-800 pb-2">
        <span className="flex items-center gap-1.5 text-blue-400">
          <Building2 className="w-3.5 h-3.5" />
          <span>Vertical Strata</span>
        </span>
        <span className="text-[10px] text-slate-400">
          {floors.length} Floors
        </span>
      </div>

      {/* Vertical Stack List */}
      <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1">
        {reversedFloors.map((floor) => {
          const isSelected = floor.id === selectedFloorId;
          return (
            <button
              key={floor.id}
              onClick={() => onSelectFloor(floor.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all text-left group ${
                isSelected
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold ${
                    isSelected ? 'bg-white text-blue-700' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {floor.floorNumber === 0 ? 'G' : floor.floorNumber}
                </span>
                <span className="truncate max-w-[90px]">{floor.floorName}</span>
              </div>

              <div className="flex items-center gap-1 text-[10px] opacity-80">
                <span>{floor.units.length}u</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white ml-1 animate-pulse" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
