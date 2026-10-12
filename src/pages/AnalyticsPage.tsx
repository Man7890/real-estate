/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { usePropertyStore } from '../store';
import { BarChart3, PieChart, Layers, Building2, MapPin, TrendingUp, Compass } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { parcels, getStats, setActiveView } = usePropertyStore();
  const stats = getStats();

  // 1. Land Use distribution
  const landUseCounts = parcels.reduce((acc, p) => {
    acc[p.landUse] = (acc[p.landUse] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 2. Unit usage distribution
  const unitUsageCounts: Record<string, number> = {};
  parcels.forEach((p) => {
    p.buildings.forEach((b) => {
      b.floors.forEach((f) => {
        f.units.forEach((u) => {
          const type = u.unitType;
          unitUsageCounts[type] = (unitUsageCounts[type] || 0) + 1;
        });
      });
    });
  });

  // 3. Height buckets
  const heightBuckets = {
    '1–2 Floors (Low Rise)': parcels.filter((p) => (p.buildings[0]?.totalFloors || 1) <= 2).length,
    '3–5 Floors (Mid Rise)': parcels.filter((p) => {
      const f = p.buildings[0]?.totalFloors || 1;
      return f >= 3 && f <= 5;
    }).length,
    '6–10 Floors (High Rise)': parcels.filter((p) => {
      const f = p.buildings[0]?.totalFloors || 1;
      return f >= 6 && f <= 10;
    }).length,
    '10+ Floors (Tower)': parcels.filter((p) => (p.buildings[0]?.totalFloors || 1) > 10).length,
  };

  // 4. Area distribution buckets
  const areaBuckets = {
    '< 1,000 m²': parcels.filter((p) => p.areaSqM < 1000).length,
    '1,000 – 1,500 m²': parcels.filter((p) => p.areaSqM >= 1000 && p.areaSqM < 1500).length,
    '1,500 – 2,000 m²': parcels.filter((p) => p.areaSqM >= 1500 && p.areaSqM < 2000).length,
    '> 2,000 m²': parcels.filter((p) => p.areaSqM >= 2000).length,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-950 tracking-tight">
            Cadastral &amp; 3D Strata Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Statistical breakdown of urban density, vertical stratification, and property zoning
          </p>
        </div>

        <button
          onClick={() => setActiveView('map')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Inspect on 3D Map</span>
        </button>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">Average Strata Height</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {stats.averageFloors} Floors / Building
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Volumetric Multiplier</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">Commercial Density Ratio</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">
            {stats.commercialRatio}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Cadastral Commercial Zone</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">Residential Density Ratio</div>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-1">
            {stats.residentialRatio}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Residential Housing Units</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500">Total Strata Units</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {stats.totalUnits.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Deedable Verticals</div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Land Use Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Cadastral Land Use Classification</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">{parcels.length} Parcels</span>
          </div>

          <div className="space-y-3">
            {Object.entries(landUseCounts).map(([type, count]) => {
              const pct = Math.round((count / parcels.length) * 100);
              return (
                <div key={type} className="text-xs space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{type}</span>
                    <span className="text-slate-500 font-mono">
                      {count} parcels ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Building Height Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Building Height Stratification</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">{stats.totalBuildings} Structures</span>
          </div>

          <div className="space-y-3">
            {Object.entries(heightBuckets).map(([bucket, count]) => {
              const pct = Math.round((count / Math.max(stats.totalBuildings, 1)) * 100);
              return (
                <div key={bucket} className="text-xs space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{bucket}</span>
                    <span className="text-slate-500 font-mono">
                      {count} structures ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Units by Typology */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Strata Property Unit Typology</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">{stats.totalUnits} Units</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {Object.entries(unitUsageCounts).map(([type, count]) => (
              <div key={type} className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                <div className="text-slate-500 text-[11px]">{type} Units</div>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                  {count}
                </div>
                <div className="text-[10px] text-slate-400">
                  {Math.round((count / stats.totalUnits) * 100)}% of urban strata
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Parcel Area Buckets */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Parcel Area Distribution</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">{stats.mappedAreaSqKm} km²</span>
          </div>

          <div className="space-y-3">
            {Object.entries(areaBuckets).map(([bucket, count]) => {
              const pct = Math.round((count / parcels.length) * 100);
              return (
                <div key={bucket} className="text-xs space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{bucket}</span>
                    <span className="text-slate-500 font-mono">
                      {count} parcels ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
