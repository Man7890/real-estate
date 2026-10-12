/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { usePropertyStore } from '../store';
import {
  ShieldAlert,
  Layers,
  Building2,
  MapPin,
  CheckCircle2,
  FileText,
  Compass,
  ArrowRight,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveView } = usePropertyStore();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <span>Research &amp; Architectural Methodology</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-slate-950 tracking-tight">
            About BhuSetu 3D
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Evolving land administration from flat 2D cadastral polygons to volumetric vertical
            property intelligence.
          </p>
        </div>

        {/* Prototype Official Disclaimer Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
            <span>Hackathon Prototype Notice &amp; Legal Boundary</span>
          </div>
          <p className="leading-relaxed">
            <strong>BhuSetu 3D is a hackathon prototype</strong>, built strictly for conceptual
            and technical demonstration. All ULPINs generated in this application are
            demonstration identifiers based on transparent algorithmic hash functions and are{' '}
            <strong>NOT official government cadastral records</strong> or legal land titles. No
            claim is made regarding connection to live state revenue databases.
          </p>
        </div>

        {/* The Core Problem */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold font-display text-slate-900">
            The Core Challenge: 2D Land in a 3D World
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In modern urban centers, cities grow vertically. A single land parcel of 1,200 m² often
            hosts a 15-story tower with 60 distinct commercial and residential units. Traditional
            cadastres assign a single 2D identifier to the plot boundary. When multiple parties hold
            rights to distinct vertical floors or air rights, flat records create ambiguities in
            valuation, taxation, utility management, and mortgage registration.
          </p>
        </div>

        {/* 6-Stage Stratification Pipeline */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold font-display text-slate-900">
            The BhuSetu 3D Property Hierarchy Pipeline
          </h2>

          <div className="space-y-4 text-xs">
            {/* Step 1 */}
            <div className="flex gap-4 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">2D Land Cadastre (Ground Parcel)</h3>
                <p className="text-slate-600">
                  DGPS vertices, revenue sheet coordinates, and survey numbers delineate the 2D
                  footprint on earth.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Demo ULPIN Generation</h3>
                <p className="text-slate-600">
                  A deterministic identifier binds state, district, tehsil, and coordinate hash into
                  a 14-character alphanumeric key.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">3D Building Volumetric Extrusion</h3>
                <p className="text-slate-600">
                  Building footprints are extruded vertically based on sanctioned municipal plans
                  and total height.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                4
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Vertical Floor Stratification</h3>
                <p className="text-slate-600">
                  Each physical floor receives a discrete horizontal strata slab, usage
                  classification, and height clearance.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                5
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Property Unit Sub-Deeds</h3>
                <p className="text-slate-600">
                  Individual units (shops, offices, apartments, penthouses) are registered with tax
                  assessment IDs, carpet area, and demo owner records.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex gap-4 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                6
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">3D Exploded GIS Intelligence</h3>
                <p className="text-slate-600">
                  Planners and citizens inspect vertical air rights through interactive 3D exploded
                  views and digital QR cards.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold font-display">Experience the Live Prototype</h3>
            <p className="text-xs text-slate-400 mt-1">
              Explore 50+ pre-mapped parcels and multi-story structures across BhuSetu Smart District.
            </p>
          </div>
          <button
            onClick={() => setActiveView('map')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
          >
            <Compass className="w-4 h-4" />
            <span>Launch 3D GIS Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
