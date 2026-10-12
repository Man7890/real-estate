/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { usePropertyStore } from '../store';
import { CadastralMap } from '../components/map/CadastralMap';
import {
  Building2,
  Layers,
  Home,
  MapPin,
  ArrowUpRight,
  TrendingUp,
  Search,
  CheckCircle2,
  Compass,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    parcels,
    getStats,
    selectParcel,
    setActiveView,
    selectedParcelId,
    mapLayer,
    setMapLayer,
  } = usePropertyStore();

  const stats = getStats();
  const recentParcels = parcels.slice(0, 5);

  // Group land use counts
  const landUseCounts = parcels.reduce((acc, p) => {
    acc[p.landUse] = (acc[p.landUse] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group building height
  const heightBuckets = {
    '1–2 Floors': parcels.filter((p) => (p.buildings[0]?.totalFloors || 1) <= 2).length,
    '3–5 Floors': parcels.filter((p) => {
      const f = p.buildings[0]?.totalFloors || 1;
      return f >= 3 && f <= 5;
    }).length,
    '6–10 Floors': parcels.filter((p) => {
      const f = p.buildings[0]?.totalFloors || 1;
      return f >= 6 && f <= 10;
    }).length,
    '10+ Floors': parcels.filter((p) => (p.buildings[0]?.totalFloors || 1) > 10).length,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            Cadastral &amp; 3D Strata Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time cadastral metrics for BhuSetu Smart District (Demo Registry)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('map')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Open 3D GIS Map</span>
          </button>
          <button
            onClick={() => setActiveView('ulpin')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            Generate ULPIN
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">TOTAL PARCELS</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {stats.totalParcels.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">100%</span> mapped
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">TOTAL BUILDINGS</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {stats.totalBuildings.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Extruded in 3D</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">TOTAL FLOORS</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {stats.totalFloors.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Vertical Strata Slabs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">PROPERTY UNITS</div>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-1 tabular-nums">
            {stats.totalUnits.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Deedable entities</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
          <div className="text-xs text-slate-500 font-medium">3D MAPPED AREA</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {stats.mappedAreaSqKm} km²
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Digital Cadastre Coverage</div>
        </div>
      </div>

      {/* Main Grid: Mini Map + Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Interactive Map Preview */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[440px]">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-800">
                District Cadastre GIS Overview
              </span>
            </div>
            <button
              onClick={() => setActiveView('map')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              <span>Expand Full Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 relative">
            <CadastralMap
              parcels={parcels}
              selectedParcelId={selectedParcelId}
              onSelectParcel={(id) => {
                selectParcel(id);
                setActiveView('map');
              }}
              mapLayer={mapLayer}
              onToggleLayer={setMapLayer}
            />
          </div>
        </div>

        {/* Right 5 Cols: Land Use & Height Charts */}
        <div className="lg:col-span-5 space-y-4">
          {/* Land Use Distribution */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Cadastral Land Use Distribution
            </h3>
            <div className="space-y-2">
              {Object.entries(landUseCounts).map(([type, count]) => {
                const pct = Math.round((count / parcels.length) * 100);
                return (
                  <div key={type} className="text-xs space-y-1">
                    <div className="flex justify-between text-slate-700">
                      <span>{type}</span>
                      <span className="font-mono tabular-nums text-slate-500">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Building Height Distribution */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Vertical Stratification (Height Distribution)
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {Object.entries(heightBuckets).map(([bucket, count]) => (
                <div key={bucket} className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                  <div className="text-slate-500 text-[11px]">{bucket}</div>
                  <div className="font-bold text-base text-slate-800 font-mono mt-0.5">
                    {count} Buildings
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Properties Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Recent Cadastral Parcel Records
            </h3>
            <p className="text-xs text-slate-500">
              Live records mapped with 3D vertical structures and demo ULPINs
            </p>
          </div>
          <button
            onClick={() => setActiveView('properties')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3">Demo ULPIN</th>
                <th className="p-3">Survey No.</th>
                <th className="p-3">Location Ward</th>
                <th className="p-3">Land Use</th>
                <th className="p-3">Building Structure</th>
                <th className="p-3">Floors / Units</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentParcels.map((parcel) => {
                const bldg = parcel.buildings[0];
                const totalUnits = bldg?.floors.reduce((acc, f) => acc + f.units.length, 0) || 0;
                return (
                  <tr key={parcel.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-mono font-bold text-blue-700">{parcel.ulpin}</td>
                    <td className="p-3 font-mono">{parcel.surveyNumber}</td>
                    <td className="p-3 text-slate-600 truncate max-w-[150px]">{parcel.ward}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium">
                        {parcel.landUse}
                      </span>
                    </td>
                    <td className="p-3">{bldg?.buildingName || 'N/A'}</td>
                    <td className="p-3 font-mono">
                      {bldg?.totalFloors} Flrs · {totalUnits} Units
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          selectParcel(parcel.id);
                          setActiveView('map');
                        }}
                        className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded font-semibold transition-colors"
                      >
                        Inspect 3D
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
