/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { usePropertyStore } from '../../store';
import { X, GitCompare, Building2, MapPin, Layers, Home, CheckCircle2 } from 'lucide-react';

export const ParcelComparisonModal: React.FC = () => {
  const {
    isComparisonOpen,
    closeComparison,
    parcels,
    comparisonParcelIds,
    setComparisonSlot,
  } = usePropertyStore();

  if (!isComparisonOpen) return null;

  const parcelA = parcels.find((p) => p.id === comparisonParcelIds[0]) || parcels[0];
  const parcelB = parcels.find((p) => p.id === comparisonParcelIds[1]) || parcels[1] || parcels[0];

  const getBldgTotalUnits = (parcel: typeof parcelA) => {
    return parcel?.buildings.reduce((acc, b) => acc + b.floors.reduce((fAcc, f) => fAcc + f.units.length, 0), 0) || 0;
  };

  const getBldgTotalBuiltUp = (parcel: typeof parcelA) => {
    return parcel?.buildings.reduce((acc, b) => acc + b.builtUpAreaSqM, 0) || 0;
  };

  const getBldgTotalFloors = (parcel: typeof parcelA) => {
    return parcel?.buildings.reduce((acc, b) => acc + b.totalFloors, 0) || 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold font-display">Cadastral &amp; 3D Strata Comparison</h2>
              <p className="text-xs text-slate-400">
                Direct comparative benchmark of 2D land footprint and 3D vertical density
              </p>
            </div>
          </div>
          <button
            onClick={closeComparison}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Parcel Selector Bar */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border-b border-slate-200">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Parcel A Identifier
            </label>
            <select
              value={parcelA?.id}
              onChange={(e) => setComparisonSlot(0, e.target.value)}
              className="w-full text-xs font-mono font-medium p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {parcels.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.ulpin} (Survey #{p.surveyNumber} - {p.landUse})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Parcel B Identifier
            </label>
            <select
              value={parcelB?.id}
              onChange={(e) => setComparisonSlot(1, e.target.value)}
              className="w-full text-xs font-mono font-medium p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {parcels.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.ulpin} (Survey #{p.surveyNumber} - {p.landUse})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 w-1/3">Cadastral Metric</th>
                  <th className="p-3 w-1/3 text-blue-700">{parcelA?.ulpin}</th>
                  <th className="p-3 w-1/3 text-indigo-700">{parcelB?.ulpin}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Survey Reference No.</td>
                  <td className="p-3 font-mono">{parcelA?.surveyNumber}</td>
                  <td className="p-3 font-mono">{parcelB?.surveyNumber}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Land Use Classification</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">
                      {parcelA?.landUse}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-medium">
                      {parcelB?.landUse}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Cadastral Plot Area</td>
                  <td className="p-3 font-mono font-bold">{parcelA?.areaSqM.toLocaleString()} m²</td>
                  <td className="p-3 font-mono font-bold">{parcelB?.areaSqM.toLocaleString()} m²</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Primary Building Name</td>
                  <td className="p-3">{parcelA?.buildings[0]?.buildingName || 'N/A'}</td>
                  <td className="p-3">{parcelB?.buildings[0]?.buildingName || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Vertical Strata (Floors)</td>
                  <td className="p-3 font-mono">{getBldgTotalFloors(parcelA)} Floors</td>
                  <td className="p-3 font-mono">{getBldgTotalFloors(parcelB)} Floors</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Total Built-Up Area</td>
                  <td className="p-3 font-mono">{getBldgTotalBuiltUp(parcelA).toLocaleString()} m²</td>
                  <td className="p-3 font-mono">{getBldgTotalBuiltUp(parcelB).toLocaleString()} m²</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">FSI / FAR Consumed</td>
                  <td className="p-3 font-mono font-semibold">
                    {parcelA?.fsiConsumed} <span className="text-slate-400 font-normal">/ {parcelA?.fsiAllowed} limit</span>
                  </td>
                  <td className="p-3 font-mono font-semibold">
                    {parcelB?.fsiConsumed} <span className="text-slate-400 font-normal">/ {parcelB?.fsiAllowed} limit</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Subdivided Units Count</td>
                  <td className="p-3 font-mono font-bold text-blue-600">
                    {getBldgTotalUnits(parcelA)} Property Units
                  </td>
                  <td className="p-3 font-mono font-bold text-indigo-600">
                    {getBldgTotalUnits(parcelB)} Property Units
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Ward &amp; Sector Location</td>
                  <td className="p-3 text-slate-600">{parcelA?.ward}</td>
                  <td className="p-3 text-slate-600">{parcelB?.ward}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Title &amp; Mutation Status</td>
                  <td className="p-3">
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {parcelA?.parcelStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {parcelB?.parcelStatus}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={closeComparison}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
