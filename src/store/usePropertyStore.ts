/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { Parcel, Building, Floor, PropertyUnit, CadastralStats } from '../types';
import { createInitialDemoCity } from '../data/mockData';

export type AppView = 'landing' | 'dashboard' | 'map' | 'ulpin' | 'properties' | 'analytics' | 'about' | 'propertyDetail';

interface PropertyState {
  parcels: Parcel[];
  selectedParcelId: string | null;
  selectedBuildingId: string | null;
  selectedFloorId: string | null;
  selectedUnitId: string | null;
  
  // Viewport & Mode controls
  activeView: AppView;
  mapMode: '3d' | '2d';
  mapLayer: 'streets' | 'satellite';
  explodedView: boolean;
  
  // Search & Filter state
  searchQuery: string;
  landUseFilter: string;
  minFloorsFilter: number;
  
  // Comparison & Export modals
  comparisonParcelIds: [string | null, string | null];
  isComparisonOpen: boolean;
  isCertificateModalOpen: boolean;

  // Actions
  setActiveView: (view: AppView) => void;
  selectParcel: (parcelId: string | null) => void;
  selectBuilding: (buildingId: string | null) => void;
  selectFloor: (floorId: string | null) => void;
  selectUnit: (unitId: string | null) => void;
  setExplodedView: (exploded: boolean) => void;
  toggleExplodedView: () => void;
  setMapMode: (mode: '3d' | '2d') => void;
  setMapLayer: (layer: 'streets' | 'satellite') => void;
  setSearchQuery: (query: string) => void;
  setLandUseFilter: (filter: string) => void;
  setMinFloorsFilter: (min: number) => void;
  
  addParcel: (parcel: Parcel) => void;
  resetDemoCity: () => void;
  
  openComparison: (id1?: string, id2?: string) => void;
  closeComparison: () => void;
  setComparisonSlot: (slot: 0 | 1, id: string | null) => void;
  
  openCertificateModal: () => void;
  closeCertificateModal: () => void;

  // Selectors / Helpers
  getSelectedParcel: () => Parcel | undefined;
  getSelectedBuilding: () => Building | undefined;
  getSelectedFloor: () => Floor | undefined;
  getSelectedUnit: () => PropertyUnit | undefined;
  getStats: () => CadastralStats;
}

const initialCity = createInitialDemoCity();

export const usePropertyStore = create<PropertyState>((set, get) => ({
  parcels: initialCity,
  selectedParcelId: 'parcel-001',
  selectedBuildingId: initialCity[0]?.buildings[0]?.id || null,
  selectedFloorId: initialCity[0]?.buildings[0]?.floors[0]?.id || null,
  selectedUnitId: null,

  activeView: 'landing',
  mapMode: '3d',
  mapLayer: 'streets',
  explodedView: false,

  searchQuery: '',
  landUseFilter: 'All',
  minFloorsFilter: 0,

  comparisonParcelIds: ['parcel-001', 'parcel-002'],
  isComparisonOpen: false,
  isCertificateModalOpen: false,

  setActiveView: (view) => set({ activeView: view }),

  selectParcel: (parcelId) => {
    if (!parcelId) {
      set({
        selectedParcelId: null,
        selectedBuildingId: null,
        selectedFloorId: null,
        selectedUnitId: null,
      });
      return;
    }

    const parcel = get().parcels.find((p) => p.id === parcelId || p.ulpin === parcelId);
    if (!parcel) return;

    const firstBldg = parcel.buildings[0];
    const firstFlr = firstBldg?.floors[0];

    set({
      selectedParcelId: parcel.id,
      selectedBuildingId: firstBldg ? firstBldg.id : null,
      selectedFloorId: firstFlr ? firstFlr.id : null,
      selectedUnitId: null,
    });
  },

  selectBuilding: (buildingId) => {
    const parcel = get().getSelectedParcel();
    if (!parcel) return;
    const bldg = parcel.buildings.find((b) => b.id === buildingId);
    set({
      selectedBuildingId: buildingId,
      selectedFloorId: bldg?.floors[0]?.id || null,
      selectedUnitId: null,
    });
  },

  selectFloor: (floorId) => {
    set({
      selectedFloorId: floorId,
      selectedUnitId: null,
    });
  },

  selectUnit: (unitId) => set({ selectedUnitId: unitId }),

  setExplodedView: (exploded) => set({ explodedView: exploded }),
  toggleExplodedView: () => set((state) => ({ explodedView: !state.explodedView })),

  setMapMode: (mode) => set({ mapMode: mode }),
  setMapLayer: (layer) => set({ mapLayer: layer }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setLandUseFilter: (filter) => set({ landUseFilter: filter }),
  setMinFloorsFilter: (min) => set({ minFloorsFilter: min }),

  addParcel: (parcel) =>
    set((state) => ({
      parcels: [parcel, ...state.parcels],
      selectedParcelId: parcel.id,
      selectedBuildingId: parcel.buildings[0]?.id || null,
      selectedFloorId: parcel.buildings[0]?.floors[0]?.id || null,
      selectedUnitId: null,
      activeView: 'map',
    })),

  resetDemoCity: () => {
    const freshCity = createInitialDemoCity();
    set({
      parcels: freshCity,
      selectedParcelId: 'parcel-001',
      selectedBuildingId: freshCity[0]?.buildings[0]?.id || null,
      selectedFloorId: freshCity[0]?.buildings[0]?.floors[0]?.id || null,
      selectedUnitId: null,
    });
  },

  openComparison: (id1, id2) =>
    set((state) => ({
      isComparisonOpen: true,
      comparisonParcelIds: [
        id1 || state.selectedParcelId || state.parcels[0]?.id || null,
        id2 || (state.parcels[1]?.id ?? state.parcels[0]?.id ?? null),
      ],
    })),

  closeComparison: () => set({ isComparisonOpen: false }),

  setComparisonSlot: (slot, id) =>
    set((state) => {
      const next: [string | null, string | null] = [...state.comparisonParcelIds];
      next[slot] = id;
      return { comparisonParcelIds: next };
    }),

  openCertificateModal: () => set({ isCertificateModalOpen: true }),
  closeCertificateModal: () => set({ isCertificateModalOpen: false }),

  getSelectedParcel: () => {
    const { parcels, selectedParcelId } = get();
    return parcels.find((p) => p.id === selectedParcelId);
  },

  getSelectedBuilding: () => {
    const parcel = get().getSelectedParcel();
    if (!parcel) return undefined;
    const { selectedBuildingId } = get();
    return parcel.buildings.find((b) => b.id === selectedBuildingId) || parcel.buildings[0];
  },

  getSelectedFloor: () => {
    const bldg = get().getSelectedBuilding();
    if (!bldg) return undefined;
    const { selectedFloorId } = get();
    return bldg.floors.find((f) => f.id === selectedFloorId) || bldg.floors[0];
  },

  getSelectedUnit: () => {
    const floor = get().getSelectedFloor();
    if (!floor) return undefined;
    const { selectedUnitId } = get();
    return floor.units.find((u) => u.id === selectedUnitId);
  },

  getStats: () => {
    const { parcels } = get();
    let totalBuildings = 0;
    let totalFloors = 0;
    let totalUnits = 0;
    let totalAreaM2 = 0;
    let commCount = 0;
    let resCount = 0;

    for (const p of parcels) {
      totalAreaM2 += p.areaSqM;
      if (p.landUse === 'Commercial') commCount++;
      if (p.landUse === 'Residential') resCount++;

      for (const b of p.buildings) {
        totalBuildings++;
        totalFloors += b.floors.length;
        for (const f of b.floors) {
          totalUnits += f.units.length;
        }
      }
    }

    const mappedAreaSqKm = Number((totalAreaM2 / 1_000_000 + 4.82).toFixed(2));
    const averageFloors = totalBuildings > 0 ? Number((totalFloors / totalBuildings).toFixed(1)) : 0;

    return {
      totalParcels: parcels.length,
      totalBuildings,
      totalFloors,
      totalUnits,
      mappedAreaSqKm,
      averageFloors,
      commercialRatio: Math.round((commCount / Math.max(parcels.length, 1)) * 100),
      residentialRatio: Math.round((resCount / Math.max(parcels.length, 1)) * 100),
    };
  },
}));
