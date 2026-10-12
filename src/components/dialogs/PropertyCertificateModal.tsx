/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { usePropertyStore } from '../../store';
import { X, Printer, Shield, CheckCircle2, QrCode, MapPin, Building2, Layers } from 'lucide-react';

export const PropertyCertificateModal: React.FC = () => {
  const {
    isCertificateModalOpen,
    closeCertificateModal,
    getSelectedParcel,
    getSelectedBuilding,
    getSelectedFloor,
    getSelectedUnit,
  } = usePropertyStore();

  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isCertificateModalOpen) return null;

  const parcel = getSelectedParcel();
  if (!parcel) return null;

  const bldg = getSelectedBuilding() || parcel.buildings[0];
  const floor = getSelectedFloor() || bldg?.floors[0];
  const unit = getSelectedUnit() || floor?.units[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Top Dialog Bar */}
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold">
              BhuSetu 3D — Prototype Digital Property Record Card
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={closeCertificateModal}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Content */}
        <div ref={printAreaRef} className="p-8 bg-white overflow-y-auto space-y-6 text-slate-900">
          {/* Certificate Header with Emblem styling */}
          <div className="border-b-2 border-slate-800 pb-4 text-center relative">
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-600 mb-1">
              DEMONSTRATION CADASTRE INTELLIGENCE SYSTEM
            </div>
            <h1 className="text-2xl font-bold font-display text-slate-950 tracking-tight">
              3D VERTICAL PROPERTY IDENTITY RECORD
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              BhuSetu Cadastral Integration Prototype · Form 3D-ULPIN
            </p>

            <div className="absolute top-0 right-0 hidden sm:block">
              <div className="border-2 border-amber-600/60 rounded px-2.5 py-1 text-[10px] font-mono font-bold text-amber-700 rotate-2 uppercase">
                Demo Prototype
              </div>
            </div>
          </div>

          {/* Primary ID Matrix & QR section */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50 border border-slate-200 rounded-lg p-4 items-center">
            <div className="sm:col-span-3 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Unique Land Parcel &amp; Vertical Identification Number (ULPIN)
              </span>
              <div className="text-xl font-mono font-extrabold text-blue-800 tracking-wider">
                {parcel.ulpin}
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                <span>
                  <strong>Survey No:</strong> {parcel.surveyNumber}
                </span>
                <span>·</span>
                <span>
                  <strong>Jurisdiction:</strong> {parcel.tehsil}, {parcel.district} ({parcel.state})
                </span>
              </div>
            </div>

            {/* Simulated Vector QR Code */}
            <div className="flex flex-col items-center justify-center p-2 bg-white rounded border border-slate-300">
              <div className="w-20 h-20 bg-slate-900 p-1 flex items-center justify-center rounded">
                {/* SVG QR Code Pattern */}
                <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h2v2h-2v-2zm2-2h2v2h-2v-2zm-2-4h2v2h-2v-2zm4 0h2v2h-2v-2zm-2 2h2v2h-2v-2z" />
                </svg>
              </div>
              <span className="text-[9px] font-mono text-slate-500 mt-1">Scan for 3D Map</span>
            </div>
          </div>

          {/* 2D Land Parcel Specifications */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Section I: 2D Land Cadastre Parameters</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="border border-slate-200 p-2.5 rounded bg-white">
                <span className="text-slate-500 block text-[10px]">Cadastral Land Area</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{parcel.areaSqM} m²</span>
                <span className="text-[10px] text-slate-400 block">(~{Math.round(parcel.areaSqM * 10.764)} sq.ft)</span>
              </div>
              <div className="border border-slate-200 p-2.5 rounded bg-white">
                <span className="text-slate-500 block text-[10px]">Zoning / Land Use</span>
                <span className="font-bold text-slate-900 text-sm">{parcel.landUse}</span>
                <span className="text-[10px] text-slate-400 block">Development Permitted</span>
              </div>
              <div className="border border-slate-200 p-2.5 rounded bg-white">
                <span className="text-slate-500 block text-[10px]">FSI Utilization</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{parcel.fsiConsumed}</span>
                <span className="text-[10px] text-slate-400 block">Max Permitted: {parcel.fsiAllowed}</span>
              </div>
              <div className="border border-slate-200 p-2.5 rounded bg-white">
                <span className="text-slate-500 block text-[10px]">Title Status</span>
                <span className="font-bold text-emerald-700 text-sm">{parcel.parcelStatus}</span>
                <span className="text-[10px] text-slate-400 block">Zero Encumbrances (Demo)</span>
              </div>
            </div>
          </div>

          {/* Vertical 3D Strata Specifications */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Section II: 3D Vertical Property Hierarchy (Building &amp; Units)</span>
            </h2>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-2.5">Structure Name</th>
                    <th className="p-2.5">Vertical Floors</th>
                    <th className="p-2.5">Built-Up Area</th>
                    <th className="p-2.5">Total Strata Units</th>
                    <th className="p-2.5">Sanction Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parcel.buildings.map((b) => (
                    <tr key={b.id}>
                      <td className="p-2.5 font-medium">{b.buildingName}</td>
                      <td className="p-2.5 font-mono">{b.totalFloors} Floors</td>
                      <td className="p-2.5 font-mono">{b.builtUpAreaSqM} m²</td>
                      <td className="p-2.5 font-mono font-bold text-blue-700">
                        {b.floors.reduce((acc, f) => acc + f.units.length, 0)} Units
                      </td>
                      <td className="p-2.5 font-mono">{b.constructionYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Individual Unit Focus (if selected) */}
          {unit && (
            <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-3 text-xs space-y-1.5">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Selected Sample Strata Deed: Unit {unit.unitNumber} ({floor?.floorName})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-500 block">Unit Type &amp; Usage</span>
                  <span>{unit.unitType} · {unit.usage}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Carpet Area</span>
                  <span className="font-mono font-semibold">{unit.areaSqM} m²</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Demo Registered Holder</span>
                  <span className="font-medium text-slate-900">{unit.ownerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Tax Assessment No.</span>
                  <span className="font-mono">{unit.taxAssessmentNo}</span>
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer Footer */}
          <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">
              LEGAL NOTICE &amp; DISCLAIMER:
            </p>
            <p>
              This document is generated by the BhuSetu 3D hackathon demonstration system. All ULPINs, coordinates, and ownership records displayed are purely synthetic demonstration data for architectural proof-of-concept and do not confer legal land title or municipal certification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
