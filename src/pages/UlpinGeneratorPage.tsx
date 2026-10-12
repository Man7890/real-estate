/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePropertyStore } from '../store';
import { generateDemoULPIN, generateBuildingHierarchy, createDefaultEvents } from '../utils/ulpinGenerator';
import { Parcel, LandUseType } from '../types';
import {
  Sparkles,
  Copy,
  Check,
  Compass,
  Building2,
  Info,
  Layers,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

export const UlpinGeneratorPage: React.FC = () => {
  const { addParcel, setActiveView } = usePropertyStore();

  const [state, setState] = useState('Chhattisgarh');
  const [district, setDistrict] = useState('Raipur');
  const [tehsil, setTehsil] = useState('Arang');
  const [village, setVillage] = useState('BhuSetu Smart District');
  const [ward, setWard] = useState('Sector 26 - Knowledge Boulevard');
  const [surveyNumber, setSurveyNumber] = useState('105/2');
  const [latitude, setLatitude] = useState(21.1685);
  const [longitude, setLongitude] = useState(81.7915);
  const [areaSqM, setAreaSqM] = useState(1450);
  const [landUse, setLandUse] = useState<LandUseType>('Commercial');
  const [floorsCount, setFloorsCount] = useState(5);

  const [generatedResult, setGeneratedResult] = useState<{
    ulpin: string;
    hashPart: string;
    formula: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = generateDemoULPIN({
      state,
      district,
      tehsil,
      village,
      ward,
      surveyNumber,
      latitude,
      longitude,
      areaSqM,
    });
    setGeneratedResult(result);
    setIsCreated(false);
  };

  const handleCopy = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult.ulpin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreate3DProperty = () => {
    if (!generatedResult) return;

    const parcelId = `parcel-gen-${Date.now()}`;
    const dLat = (32 / 111000) / 2;
    const dLng = (28 / 103000) / 2;
    const poly: [number, number][] = [
      [latitude - dLat, longitude - dLng],
      [latitude + dLat, longitude - dLng],
      [latitude + dLat, longitude + dLng],
      [latitude - dLat, longitude + dLng],
    ];

    const bldg = generateBuildingHierarchy(
      parcelId,
      `BhuSetu Tower ${surveyNumber.replace('/', '-')}`,
      floorsCount,
      landUse,
      Math.round(areaSqM * 0.45)
    );

    const newParcel: Parcel = {
      id: parcelId,
      ulpin: generatedResult.ulpin,
      surveyNumber,
      state,
      district,
      tehsil,
      village,
      ward,
      latitude,
      longitude,
      areaSqM,
      landUse,
      parcelStatus: 'Clear Title',
      boundaryCoordinates: poly,
      fsiAllowed: landUse === 'Commercial' ? 3.5 : 2.5,
      fsiConsumed: Number((((bldg.builtUpAreaSqM || areaSqM) / areaSqM)).toFixed(2)),
      buildings: [bldg],
      events: createDefaultEvents(parcelId, generatedResult.ulpin),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addParcel(newParcel);
    setIsCreated(true);
  };

  const handleLoadSample = (sampleNum: number) => {
    if (sampleNum === 1) {
      setSurveyNumber('108/3');
      setLatitude(21.1692);
      setLongitude(81.7930);
      setAreaSqM(1600);
      setLandUse('Commercial');
      setFloorsCount(6);
    } else if (sampleNum === 2) {
      setSurveyNumber('112/1');
      setLatitude(21.1625);
      setLongitude(81.7845);
      setAreaSqM(980);
      setLandUse('Residential');
      setFloorsCount(3);
    } else {
      setSurveyNumber('115/4');
      setLatitude(21.1710);
      setLongitude(81.7880);
      setAreaSqM(2400);
      setLandUse('Mixed Use');
      setFloorsCount(7);
    }
    setGeneratedResult(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <span>Deterministic Cadastral Hash Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-950 tracking-tight">
            Demo ULPIN &amp; 3D Strata Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Input cadastral land coordinates and survey parameters to generate a reproducible demo
            ULPIN and spawn its 3D vertical property structure.
          </p>
        </div>

        {/* Preset Coordinate Quick Selectors */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 shadow-sm text-xs">
          <span className="font-semibold text-slate-700">Quick Test Presets:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleLoadSample(1)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              Preset A: Commercial Hub (6 Flrs)
            </button>
            <button
              onClick={() => handleLoadSample(2)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              Preset B: Residential Villa (3 Flrs)
            </button>
            <button
              onClick={() => handleLoadSample(3)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              Preset C: Mixed Promenade (7 Flrs)
            </button>
          </div>
        </div>

        {/* Input Form & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form (7 cols) */}
          <form
            onSubmit={handleGenerate}
            className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4"
          >
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Cadastral Jurisdiction &amp; Boundary Details
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Tehsil / Taluk</label>
                <input
                  type="text"
                  value={tehsil}
                  onChange={(e) => setTehsil(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Survey / Khasra No.</label>
                <input
                  type="text"
                  value={surveyNumber}
                  onChange={(e) => setSurveyNumber(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  placeholder="e.g. 105/2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Latitude (°N)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Longitude (°E)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Area (m²)</label>
                <input
                  type="number"
                  value={areaSqM}
                  onChange={(e) => setAreaSqM(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Land Use</label>
                <select
                  value={landUse}
                  onChange={(e) => setLandUse(e.target.value as LandUseType)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Mixed Use">Mixed Use</option>
                  <option value="Institutional">Institutional</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Floors Strata</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={floorsCount}
                  onChange={(e) => setFloorsCount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4" />
              <span>GENERATE DEMO ULPIN</span>
            </button>
          </form>

          {/* Result Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {generatedResult ? (
              <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-xl space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400">
                    GENERATED DEMO IDENTIFIER
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Copy ULPIN"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-2xl font-mono font-bold tracking-tight text-white border-b border-slate-800 pb-3">
                  {generatedResult.ulpin}
                </div>

                {/* Algorithm derivation explanation */}
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="text-[11px] font-semibold text-slate-300">
                    Deterministic Strata Derivation:
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded font-mono text-[11px] text-blue-300 leading-relaxed">
                    {generatedResult.formula}
                  </div>
                </div>

                {/* Vertical Strata Summary */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-800/80 p-2 rounded">
                    <span className="text-slate-400 block text-[10px]">Vertical Extrusion</span>
                    <span className="font-bold text-white font-mono">{floorsCount} Floors</span>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded">
                    <span className="text-slate-400 block text-[10px]">Deedable Units</span>
                    <span className="font-bold text-blue-400 font-mono">
                      ~{floorsCount * 2} Units
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleCreate3DProperty}
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Create &amp; Add 3D Property to Map</span>
                  </button>

                  <button
                    onClick={() => setActiveView('map')}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <span>View GIS 3D Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[10px] text-amber-300/80 bg-amber-950/40 border border-amber-900/60 rounded p-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>Prototype identifier only — not an official government ULPIN.</span>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-3 py-12 text-slate-500 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  Ready to Generate Demo ULPIN
                </h3>
                <p className="text-xs max-w-xs mx-auto">
                  Configure coordinates and parameters on the left, then click Generate to create a
                  reproducible demo property identifier.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
