/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Parcel, Building, Floor, PropertyUnit } from '../../types';
import { VerticalPropertyTree } from './VerticalPropertyTree';
import {
  Copy,
  Check,
  QrCode,
  FileText,
  GitCompare,
  Layers,
  MapPin,
  Calendar,
  Building2,
  Home,
  Download,
  Info,
  ChevronRight,
} from 'lucide-react';

interface PropertyDetailPanelProps {
  parcel: Parcel;
  selectedBuilding?: Building;
  selectedFloor?: Floor;
  selectedUnit?: PropertyUnit;
  onSelectBuilding: (id: string) => void;
  onSelectFloor: (id: string) => void;
  onSelectUnit: (id: string) => void;
  onOpenCertificate: () => void;
  onOpenComparison: () => void;
  onToggleExploded: () => void;
  isExploded: boolean;
}

export const PropertyDetailPanel: React.FC<PropertyDetailPanelProps> = ({
  parcel,
  selectedBuilding,
  selectedFloor,
  selectedUnit,
  onSelectBuilding,
  onSelectFloor,
  onSelectUnit,
  onOpenCertificate,
  onOpenComparison,
  onToggleExploded,
  isExploded,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'hierarchy' | 'timeline'>('details');
  const [copied, setCopied] = useState(false);

  const handleCopyULPIN = () => {
    navigator.clipboard.writeText(parcel.ulpin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentBldg = selectedBuilding || parcel.buildings[0];
  const currentFloor = selectedFloor || currentBldg?.floors[0];

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(parcel, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `bhusetu-property-${parcel.ulpin}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    // Generate simple CSV of all units in this parcel
    const rows = [
      ['ULPIN', 'SurveyNumber', 'Building', 'Floor', 'UnitNumber', 'UnitType', 'Usage', 'AreaSqM', 'Owner', 'TaxNo'],
    ];

    parcel.buildings.forEach((b) => {
      b.floors.forEach((f) => {
        f.units.forEach((u) => {
          rows.push([
            parcel.ulpin,
            parcel.surveyNumber,
            b.buildingName,
            f.floorName,
            u.unitNumber,
            u.unitType,
            u.usage,
            u.areaSqM.toString(),
            u.ownerName,
            u.taxAssessmentNo,
          ]);
        });
      });
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `bhusetu-units-${parcel.ulpin}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 text-slate-800 text-sm overflow-hidden select-none">
      {/* Top Header Card */}
      <div className="p-4 bg-slate-900 text-white shrink-0 border-b border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 text-xs text-blue-400 font-mono">
            <span>DEMO ULPIN</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{parcel.parcelStatus}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyULPIN}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Copy Demo ULPIN"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onOpenCertificate}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="View Digital Property Certificate & QR Code"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-400" />
            </button>
          </div>
        </div>

        <div className="text-base sm:text-lg font-mono font-bold tracking-tight text-white mb-1 truncate">
          {parcel.ulpin}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Survey No. {parcel.surveyNumber}</span>
          <span>{parcel.ward}</span>
        </div>

        <div className="mt-2 text-[10px] text-amber-300/80 bg-amber-950/40 border border-amber-900/60 rounded px-2 py-1 flex items-center gap-1">
          <Info className="w-3 h-3 shrink-0" />
          <span>Prototype identifier only — not an official government ULPIN.</span>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center border-b border-slate-200 bg-slate-50 px-3 py-1.5 gap-2 shrink-0">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'details'
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Property Profile
        </button>
        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'hierarchy'
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Strata Tree
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'timeline'
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cadastral Timeline
        </button>
      </div>

      {/* Tab Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'details' && (
          <>
            {/* Quick Summary Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                <div className="text-slate-400 text-[11px] mb-0.5">Plot Land Area</div>
                <div className="font-bold text-slate-800 text-sm font-mono">
                  {parcel.areaSqM.toLocaleString()} m²
                </div>
                <div className="text-slate-400 text-[10px]">
                  ~{Math.round(parcel.areaSqM * 10.764).toLocaleString()} sq.ft
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                <div className="text-slate-400 text-[11px] mb-0.5">Land Use / Zone</div>
                <div className="font-bold text-slate-800 text-sm">{parcel.landUse}</div>
                <div className="text-slate-400 text-[10px]">FSI: {parcel.fsiConsumed} / {parcel.fsiAllowed}</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                <div className="text-slate-400 text-[11px] mb-0.5">Vertical Slabs</div>
                <div className="font-bold text-slate-800 text-sm font-mono">
                  {currentBldg?.totalFloors || 1} Floors
                </div>
                <div className="text-slate-400 text-[10px]">Height: {currentBldg?.heightMeters || 12}m</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                <div className="text-slate-400 text-[11px] mb-0.5">Strata Units</div>
                <div className="font-bold text-blue-600 text-sm font-mono">
                  {currentBldg ? currentBldg.floors.reduce((acc, f) => acc + f.units.length, 0) : 0} Units
                </div>
                <div className="text-slate-400 text-[10px]">Independently Deedable</div>
              </div>
            </div>

            {/* Geographic Coordinates & Cadastral Jurisdiction */}
            <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Geographic &amp; Administrative Jurisdiction</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">State &amp; District</span>
                  <span>{parcel.state}, {parcel.district}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tehsil / Taluk</span>
                  <span>{parcel.tehsil}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Village / Ward</span>
                  <span className="truncate block">{parcel.village}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Centroid Coordinates</span>
                  <span className="font-mono text-[11px]">
                    {parcel.latitude.toFixed(4)}°N, {parcel.longitude.toFixed(4)}°E
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Floor & Units Drilldown */}
            {currentFloor && (
              <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Active Floor: {currentFloor.floorName}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {currentFloor.units.length} Units · {currentFloor.areaSqM} m²
                  </span>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                  <div className="text-[10px] text-slate-400">Designated Usage</div>
                  <div className="font-medium text-slate-700">{currentFloor.usage}</div>
                </div>

                {/* Units List */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Units on this Strata
                  </div>
                  {currentFloor.units.map((unit) => {
                    const isUnitSelected = unit.id === selectedUnit?.id;
                    return (
                      <div
                        key={unit.id}
                        onClick={() => onSelectUnit(unit.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          isUnitSelected
                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-400'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 font-mono">
                              Unit {unit.unitNumber}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                              {unit.unitType}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono font-semibold text-blue-600">
                            {unit.areaSqM} m²
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 flex items-center justify-between">
                          <span className="truncate max-w-[170px]">
                            Owner: <span className="text-slate-800">{unit.ownerName}</span>
                          </span>
                          <span className="text-[10px] text-emerald-600 font-medium">
                            {unit.status}
                          </span>
                        </div>

                        <div className="mt-1 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                          <span>{unit.taxAssessmentNo}</span>
                          <span>Share: {unit.sharePercentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'hierarchy' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-500">
              Interactive 3D Strata Tree. Click any building, floor or unit to focus the 3D model.
            </div>
            <VerticalPropertyTree
              parcel={parcel}
              selectedBuildingId={selectedBuilding?.id || null}
              selectedFloorId={selectedFloor?.id || null}
              selectedUnitId={selectedUnit?.id || null}
              onSelectBuilding={onSelectBuilding}
              onSelectFloor={onSelectFloor}
              onSelectUnit={onSelectUnit}
            />
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-500">
              Auditable Cadastral Mutation &amp; Strata Registration Log
            </div>
            <div className="space-y-3 pl-2 border-l-2 border-slate-200 ml-2">
              {parcel.events.map((evt) => (
                <div key={evt.id} className="relative pl-3 space-y-1">
                  <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white ring-1 ring-blue-300" />
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>{evt.eventType.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{evt.eventDate}</span>
                  </div>
                  <div className="text-xs text-slate-600">{evt.description}</div>
                  <div className="text-[10px] text-slate-400 italic">Auth: {evt.authority}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between gap-2">
        <button
          onClick={onOpenCertificate}
          className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Property Card</span>
        </button>

        <button
          onClick={onOpenComparison}
          className="py-2 px-2.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
          title="Compare with another parcel"
        >
          <GitCompare className="w-3.5 h-3.5 text-slate-500" />
          <span>Compare</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={handleExportJSON}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            title="Export Parcel JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
