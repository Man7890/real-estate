/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Parcel, Building, Floor, PropertyUnit } from '../../types';
import { ChevronRight, ChevronDown, MapPin, Building2, Layers, Home, CheckCircle2 } from 'lucide-react';

interface VerticalPropertyTreeProps {
  parcel: Parcel;
  selectedBuildingId: string | null;
  selectedFloorId: string | null;
  selectedUnitId: string | null;
  onSelectBuilding: (bldgId: string) => void;
  onSelectFloor: (flrId: string) => void;
  onSelectUnit: (unitId: string) => void;
}

export const VerticalPropertyTree: React.FC<VerticalPropertyTreeProps> = ({
  parcel,
  selectedBuildingId,
  selectedFloorId,
  selectedUnitId,
  onSelectBuilding,
  onSelectFloor,
  onSelectUnit,
}) => {
  const [expandedBuildings, setExpandedBuildings] = useState<Record<string, boolean>>({
    [parcel.buildings[0]?.id || '']: true,
  });
  const [expandedFloors, setExpandedFloors] = useState<Record<string, boolean>>({
    [parcel.buildings[0]?.floors[0]?.id || '']: true,
  });

  const toggleBuilding = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedBuildings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFloor = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFloors((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="font-mono text-xs select-none">
      {/* Root Node: Parcel */}
      <div className="flex items-center gap-2 py-1.5 px-2 bg-slate-100 rounded-md text-slate-800 font-semibold mb-1">
        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span className="truncate">Parcel {parcel.surveyNumber} ({parcel.ulpin})</span>
      </div>

      {/* Buildings list */}
      <div className="pl-3 border-l-2 border-slate-200 ml-2 space-y-1 mt-1">
        {parcel.buildings.map((bldg) => {
          const isBldgSelected = bldg.id === selectedBuildingId;
          const isBldgExpanded = !!expandedBuildings[bldg.id];

          return (
            <div key={bldg.id} className="space-y-1">
              {/* Building Node */}
              <div
                onClick={() => onSelectBuilding(bldg.id)}
                className={`flex items-center justify-between py-1 px-2 rounded cursor-pointer transition-colors ${
                  isBldgSelected
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <button
                    onClick={(e) => toggleBuilding(bldg.id, e)}
                    className="p-0.5 hover:bg-slate-200 rounded text-slate-500"
                  >
                    {isBldgExpanded ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                  <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{bldg.buildingName}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">
                  {bldg.totalFloors} flrs
                </span>
              </div>

              {/* Floors sub-tree */}
              {isBldgExpanded && (
                <div className="pl-3 border-l-2 border-blue-200 ml-2 space-y-0.5">
                  {bldg.floors.map((floor) => {
                    const isFloorSelected = floor.id === selectedFloorId;
                    const isFloorExpanded = !!expandedFloors[floor.id];

                    return (
                      <div key={floor.id} className="space-y-0.5">
                        {/* Floor Node */}
                        <div
                          onClick={() => onSelectFloor(floor.id)}
                          className={`flex items-center justify-between py-1 px-2 rounded cursor-pointer transition-colors ${
                            isFloorSelected
                              ? 'bg-blue-600 text-white font-bold'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <button
                              onClick={(e) => toggleFloor(floor.id, e)}
                              className={`p-0.5 rounded ${
                                isFloorSelected ? 'hover:bg-blue-700 text-blue-100' : 'hover:bg-slate-200 text-slate-400'
                              }`}
                            >
                              {isFloorExpanded ? (
                                <ChevronDown className="w-3 h-3" />
                              ) : (
                                <ChevronRight className="w-3 h-3" />
                              )}
                            </button>
                            <Layers className="w-3 h-3 shrink-0" />
                            <span className="truncate">{floor.floorName}</span>
                          </div>
                          <span
                            className={`text-[10px] ${
                              isFloorSelected ? 'text-blue-100' : 'text-slate-400'
                            }`}
                          >
                            {floor.units.length} units
                          </span>
                        </div>

                        {/* Units list */}
                        {isFloorExpanded && (
                          <div className="pl-4 border-l border-slate-300 ml-2 space-y-0.5 py-0.5">
                            {floor.units.map((unit) => {
                              const isUnitSelected = unit.id === selectedUnitId;
                              return (
                                <div
                                  key={unit.id}
                                  onClick={() => onSelectUnit(unit.id)}
                                  className={`flex items-center justify-between py-0.5 px-2 rounded cursor-pointer text-[11px] transition-colors ${
                                    isUnitSelected
                                      ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 truncate">
                                    <Home className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                    <span>Unit {unit.unitNumber}</span>
                                    <span className="text-slate-400 text-[10px] truncate max-w-[80px]">
                                      ({unit.unitType})
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-400">{unit.areaSqM}m²</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
