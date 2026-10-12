/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { usePropertyStore } from '../store';
import { Building3DViewer } from '../components/3d/Building3DViewer';
import {
  MapPin,
  Layers,
  Building2,
  Sparkles,
  ArrowRight,
  Shield,
  Search,
  CheckCircle2,
  Compass,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setActiveView,
    selectParcel,
    parcels,
    selectedFloorId,
    selectFloor,
    explodedView,
    toggleExplodedView,
  } = usePropertyStore();

  const heroParcel = parcels[0];
  const heroBuilding = heroParcel?.buildings[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0F172A] text-white py-16 lg:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Mission & Headline */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>Next-Gen Cadastral Prototype</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white leading-tight">
                One Parcel. Every Floor. Every Property.{' '}
                <span className="text-blue-400">One Digital Identity.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Traditional land maps only look at the ground in 2D. <strong>BhuSetu 3D</strong>{' '}
                extends land administration into a volumetric 3D property map—binding unique demo
                ULPINs to parcels, extruding multi-story buildings, and mapping individual deedable
                strata units vertically.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    selectParcel('parcel-001');
                    setActiveView('map');
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-lg shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 group active:scale-[0.98]"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore 3D Map</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveView('ulpin')}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-sm rounded-lg border border-slate-700 transition-colors"
                >
                  Generate Demo ULPIN
                </button>

                <button
                  onClick={() => setActiveView('dashboard')}
                  className="px-5 py-3 text-slate-300 hover:text-white font-medium text-sm transition-colors"
                >
                  View Dashboard
                </button>
              </div>

              {/* Quick Jump Anchors */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="text-slate-500">Quick Test Scenarios:</span>
                <button
                  onClick={() => {
                    selectParcel('parcel-001');
                    setActiveView('map');
                  }}
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                >
                  Parcel 001 (Residential)
                </button>
                <button
                  onClick={() => {
                    selectParcel('parcel-002');
                    setActiveView('map');
                  }}
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                >
                  Parcel 002 (Commercial Plaza)
                </button>
                <button
                  onClick={() => {
                    selectParcel('parcel-003');
                    setActiveView('map');
                  }}
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                >
                  Parcel 003 (Mixed Tower)
                </button>
              </div>
            </div>

            {/* Right Column: Live 3D Miniature Building */}
            <div className="lg:col-span-5 h-[420px] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl relative bg-[#0F172A]">
              <Building3DViewer
                building={heroBuilding}
                selectedFloorId={selectedFloorId}
                onSelectFloor={selectFloor}
                exploded={explodedView}
                onToggleExploded={toggleExplodedView}
                parcelAreaSqM={heroParcel?.areaSqM}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
            The Missing Dimension in Modern Land Records
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Why 2D flat parcels fail in vertical cities, and how BhuSetu 3D solves it through a
            hierarchical digital property schema.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              01. 2D Cadastral &amp; Boundary Precision
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every parcel binds to real geographic coordinates, DGPS surveyed vertices, and
              cadastral village/ward numbers for clear 2D land demarcation.
            </p>
            <div className="pt-2 text-xs font-mono text-blue-600 font-semibold">
              Latitude + Longitude + Survey Polygon
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              02. 3D Vertical Strata Subdivision
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Extrude multi-story buildings into distinct vertical floor slabs with individual
              property unit deed metadata, tax IDs, and real-time exploded inspection.
            </p>
            <div className="pt-2 text-xs font-mono text-amber-600 font-semibold">
              Ground → Floors 1..N → Deedable Units
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              03. Deterministic Demo ULPIN
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generates reproducible demonstration identifiers linking state, district, tehsil, and
              normalized coordinate hashes into a unified digital property code.
            </p>
            <div className="pt-2 text-xs font-mono text-emerald-600 font-semibold">
              IN-CG-RPR-ARN-7F29A102
            </div>
          </div>
        </div>

        {/* Conceptual Hierarchy Flow */}
        <div className="mt-16 bg-slate-900 text-white rounded-2xl p-8 border border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-lg font-bold font-display text-white">
              Unified Digital Property Strata Architecture
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              From traditional 2D land deed to multi-tenant vertical registry
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-1">
              <div className="text-blue-400 font-mono text-xs font-bold">STAGE 01</div>
              <div className="font-bold text-white text-sm">Land Parcel</div>
              <div className="text-slate-400 text-[11px]">2D Cadastral boundary &amp; area</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-1">
              <div className="text-blue-400 font-mono text-xs font-bold">STAGE 02</div>
              <div className="font-bold text-white text-sm">Demo ULPIN</div>
              <div className="text-slate-400 text-[11px]">Unique digital identifier assigned</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-1">
              <div className="text-blue-400 font-mono text-xs font-bold">STAGE 03</div>
              <div className="font-bold text-white text-sm">Building Extrusion</div>
              <div className="text-slate-400 text-[11px]">Volumetric height &amp; footprint</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-1">
              <div className="text-blue-400 font-mono text-xs font-bold">STAGE 04</div>
              <div className="font-bold text-white text-sm">Floor Strata</div>
              <div className="text-slate-400 text-[11px]">Vertical levels &amp; zoning</div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl space-y-1">
              <div className="text-blue-400 font-mono text-xs font-bold">STAGE 05</div>
              <div className="font-bold text-white text-sm">Property Unit</div>
              <div className="text-slate-400 text-[11px]">Ownership, tax ID, deed status</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
