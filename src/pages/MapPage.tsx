/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePropertyStore } from '../store';
import { CadastralMap } from '../components/map/CadastralMap';
import { Building3DViewer } from '../components/3d/Building3DViewer';
import { PropertyDetailPanel } from '../components/panels/PropertyDetailPanel';
import { FloorSlider } from '../components/panels/FloorSlider';
import {
  Search,
  Filter,
  Layers,
  Box,
  Map as MapIcon,
  Columns,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';

export const MapPage: React.FC = () => {
  const {
    parcels,
    selectedParcelId,
    selectParcel,
    selectedBuildingId,
    selectBuilding,
    selectedFloorId,
    selectFloor,
    selectedUnitId,
    selectUnit,
    getSelectedParcel,
    getSelectedBuilding,
    getSelectedFloor,
    getSelectedUnit,
    explodedView,
    toggleExplodedView,
    mapLayer,
    setMapLayer,
    searchQuery,
    setSearchQuery,
    landUseFilter,
    setLandUseFilter,
    openComparison,
    openCertificateModal,
  } = usePropertyStore();

  const [viewMode, setViewMode] = useState<'split' | '3d' | '2d'>('split');
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [minFloors, setMinFloors] = useState<number>(0);

  const selectedParcel = getSelectedParcel() || parcels[0];
  const selectedBuilding = getSelectedBuilding() || selectedParcel?.buildings[0];
  const selectedFloor = getSelectedFloor() || selectedBuilding?.floors[0];
  const selectedUnit = getSelectedUnit();

  // Filter parcels
  const filteredParcels = parcels.filter((p) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchUlpin = p.ulpin.toLowerCase().includes(q);
      const matchSurvey = p.surveyNumber.toLowerCase().includes(q);
      const matchWard = p.ward.toLowerCase().includes(q);
      const matchBldg = p.buildings[0]?.buildingName.toLowerCase().includes(q);
      const matchOwner = p.buildings.some((b) =>
        b.floors.some((f) => f.units.some((u) => u.ownerName.toLowerCase().includes(q)))
      );
      if (!matchUlpin && !matchSurvey && !matchWard && !matchBldg && !matchOwner) {
        return false;
      }
    }

    // Land use filter match
    if (landUseFilter !== 'All' && p.landUse !== landUseFilter) {
      return false;
    }

    // Min floors match
    if (minFloors > 0 && (p.buildings[0]?.totalFloors || 0) < minFloors) {
      return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 overflow-hidden">
      {/* Top Controls Toolbar */}
      <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
              isFilterOpen
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters &amp; Search</span>
          </button>

          {/* View Mode Segmented Switch */}
          <div className="bg-slate-800 p-0.5 rounded-lg border border-slate-700 flex items-center">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'split' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split 2D/3D</span>
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === '3d' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Strata</span>
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === '2d' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>2D Cadastre</span>
            </button>
          </div>
        </div>

        {/* Current Parcel quick readout & actions */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-slate-300">
            <span className="text-slate-500">Selected:</span>
            <span className="font-mono font-bold text-blue-400">{selectedParcel.ulpin}</span>
            <span className="text-slate-500">·</span>
            <span>Survey #{selectedParcel.surveyNumber}</span>
          </div>

          <button
            onClick={toggleExplodedView}
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
              explodedView
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>{explodedView ? 'Collapse Strata' : 'Exploded View'}</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Work Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Drawer / Sidebar: Filters & Parcel List */}
        {isFilterOpen && (
          <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 z-20">
            {/* Search Input */}
            <div className="p-3 border-b border-slate-800 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search ULPIN, survey, owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Land Use Filter Chips */}
              <div className="flex flex-wrap gap-1 pt-1">
                {['All', 'Residential', 'Commercial', 'Mixed Use', 'Institutional'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setLandUseFilter(type)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                      landUseFilter === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Min floors slider */}
              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>Min Floors: {minFloors > 0 ? `${minFloors}+` : 'Any'}</span>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={minFloors}
                  onChange={(e) => setMinFloors(Number(e.target.value))}
                  className="w-24 accent-blue-500"
                />
              </div>
            </div>

            {/* Filtered Parcel Records List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1 py-0.5 flex justify-between">
                <span>Parcels ({filteredParcels.length})</span>
                <span>Click to Inspect</span>
              </div>

              {filteredParcels.map((parcel) => {
                const isSelected = parcel.id === selectedParcel.id;
                const bldg = parcel.buildings[0];
                return (
                  <div
                    key={parcel.id}
                    onClick={() => selectParcel(parcel.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-blue-400">{parcel.ulpin}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                        {parcel.landUse}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="truncate max-w-[130px]">
                        {bldg?.buildingName || `Survey #${parcel.surveyNumber}`}
                      </span>
                      <span className="font-mono text-slate-300">
                        {bldg?.totalFloors} Flrs · {parcel.areaSqM} m²
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* Center Canvas / Map Stage */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Split View (Both 2D Map + 3D Building side-by-side) */}
          {viewMode === 'split' && (
            <div className="w-full h-full flex flex-col md:flex-row">
              {/* 2D Cadastral Map (Half) */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full relative border-r border-slate-800">
                <CadastralMap
                  parcels={parcels}
                  selectedParcelId={selectedParcel.id}
                  onSelectParcel={selectParcel}
                  mapLayer={mapLayer}
                  onToggleLayer={setMapLayer}
                />
                <div className="absolute top-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-md px-2.5 py-1 text-[11px] font-semibold text-slate-200">
                  2D Cadastral Boundary Plane
                </div>
              </div>

              {/* 3D Vertical Building Viewer (Half) */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full relative">
                <Building3DViewer
                  building={selectedBuilding}
                  selectedFloorId={selectedFloorId}
                  onSelectFloor={selectFloor}
                  exploded={explodedView}
                  onToggleExploded={toggleExplodedView}
                  parcelAreaSqM={selectedParcel.areaSqM}
                />

                {/* Floating Floor Slider inside 3D viewer */}
                {selectedBuilding && (
                  <div className="absolute top-4 right-4 z-20 w-44">
                    <FloorSlider
                      floors={selectedBuilding.floors}
                      selectedFloorId={selectedFloorId}
                      onSelectFloor={selectFloor}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3D Only View */}
          {viewMode === '3d' && (
            <div className="w-full h-full relative">
              <Building3DViewer
                building={selectedBuilding}
                selectedFloorId={selectedFloorId}
                onSelectFloor={selectFloor}
                exploded={explodedView}
                onToggleExploded={toggleExplodedView}
                parcelAreaSqM={selectedParcel.areaSqM}
              />

              {/* Floating Floor Slider inside 3D viewer */}
              {selectedBuilding && (
                <div className="absolute top-4 right-4 z-20 w-48">
                  <FloorSlider
                    floors={selectedBuilding.floors}
                    selectedFloorId={selectedFloorId}
                    onSelectFloor={selectFloor}
                  />
                </div>
              )}
            </div>
          )}

          {/* 2D Only View */}
          {viewMode === '2d' && (
            <div className="w-full h-full relative">
              <CadastralMap
                parcels={parcels}
                selectedParcelId={selectedParcel.id}
                onSelectParcel={selectParcel}
                mapLayer={mapLayer}
                onToggleLayer={setMapLayer}
              />
            </div>
          )}
        </div>

        {/* Right Docked Panel: Property Detail Profile */}
        <aside className="w-80 lg:w-96 bg-white shrink-0 z-20 shadow-xl flex flex-col">
          <PropertyDetailPanel
            parcel={selectedParcel}
            selectedBuilding={selectedBuilding}
            selectedFloor={selectedFloor}
            selectedUnit={selectedUnit}
            onSelectBuilding={selectBuilding}
            onSelectFloor={selectFloor}
            onSelectUnit={selectUnit}
            onOpenCertificate={openCertificateModal}
            onOpenComparison={() => openComparison(selectedParcel.id)}
            onToggleExploded={toggleExplodedView}
            isExploded={explodedView}
          />
        </aside>
      </div>
    </div>
  );
};
