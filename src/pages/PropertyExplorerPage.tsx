/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePropertyStore } from '../store';
import {
  Search,
  Filter,
  ArrowUpDown,
  Compass,
  FileText,
  Building2,
  Layers,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const PropertyExplorerPage: React.FC = () => {
  const { parcels, selectParcel, setActiveView, openCertificateModal } = usePropertyStore();

  const [search, setSearch] = useState('');
  const [selectedLandUse, setSelectedLandUse] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'survey' | 'area' | 'floors'>('survey');
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = parcels
    .filter((p) => {
      if (selectedLandUse !== 'All' && p.landUse !== selectedLandUse) return false;
      if (!search.trim()) return true;

      const q = search.toLowerCase();
      const matchUlpin = p.ulpin.toLowerCase().includes(q);
      const matchSurvey = p.surveyNumber.toLowerCase().includes(q);
      const matchWard = p.ward.toLowerCase().includes(q);
      const matchBldg = p.buildings[0]?.buildingName.toLowerCase().includes(q);
      const matchOwner = p.buildings.some((b) =>
        b.floors.some((f) => f.units.some((u) => u.ownerName.toLowerCase().includes(q)))
      );

      return matchUlpin || matchSurvey || matchWard || matchBldg || matchOwner;
    })
    .sort((a, b) => {
      if (sortBy === 'area') {
        return sortAsc ? a.areaSqM - b.areaSqM : b.areaSqM - a.areaSqM;
      }
      if (sortBy === 'floors') {
        const fA = a.buildings[0]?.totalFloors || 0;
        const fB = b.buildings[0]?.totalFloors || 0;
        return sortAsc ? fA - fB : fB - fA;
      }
      return sortAsc
        ? a.surveyNumber.localeCompare(b.surveyNumber)
        : b.surveyNumber.localeCompare(a.surveyNumber);
    });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-950 tracking-tight">
            Cadastral Property Records Explorer
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Searchable cadastre database for {parcels.length} mapped parcels with vertical strata
          </p>
        </div>

        <button
          onClick={() => setActiveView('map')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>View All in 3D Map</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ULPIN, survey no, ward, owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Land Use:</span>
          {['All', 'Residential', 'Commercial', 'Mixed Use', 'Institutional'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedLandUse(type)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedLandUse === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Demo ULPIN</th>
                <th
                  className="p-3.5 cursor-pointer hover:text-blue-600"
                  onClick={() => {
                    setSortBy('survey');
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Survey No.</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5">Location Ward</th>
                <th className="p-3.5">Land Use</th>
                <th
                  className="p-3.5 cursor-pointer hover:text-blue-600"
                  onClick={() => {
                    setSortBy('area');
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Cadastral Area</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5">Building Name</th>
                <th
                  className="p-3.5 cursor-pointer hover:text-blue-600"
                  onClick={() => {
                    setSortBy('floors');
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Strata Levels</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((parcel) => {
                const bldg = parcel.buildings[0];
                const totalUnits = bldg?.floors.reduce((acc, f) => acc + f.units.length, 0) || 0;

                return (
                  <tr key={parcel.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-blue-700">
                      {parcel.ulpin}
                    </td>
                    <td className="p-3.5 font-mono font-semibold">{parcel.surveyNumber}</td>
                    <td className="p-3.5 text-slate-600 truncate max-w-[150px]">{parcel.ward}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium text-[11px]">
                        {parcel.landUse}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono tabular-nums font-medium">
                      {parcel.areaSqM.toLocaleString()} m²
                    </td>
                    <td className="p-3.5 text-slate-800 font-medium">
                      {bldg?.buildingName || 'Cadastral Parcel'}
                    </td>
                    <td className="p-3.5 font-mono">
                      {bldg?.totalFloors} Flrs · {totalUnits} Units
                    </td>
                    <td className="p-3.5">
                      <span className="text-emerald-700 font-medium flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        {parcel.parcelStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => {
                          selectParcel(parcel.id);
                          setActiveView('map');
                        }}
                        className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded font-semibold transition-colors text-[11px]"
                      >
                        Explore 3D
                      </button>
                      <button
                        onClick={() => {
                          selectParcel(parcel.id);
                          openCertificateModal();
                        }}
                        className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-medium transition-colors text-[11px]"
                        title="Print Property Card"
                      >
                        <FileText className="w-3 h-3 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state if search found nothing */}
        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <p className="font-semibold text-slate-700">No cadastral records found</p>
            <p className="text-xs">Try clearing the search query or changing the land use filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
