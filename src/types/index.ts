/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LandUseType = 'Residential' | 'Commercial' | 'Mixed Use' | 'Institutional' | 'Industrial' | 'Agricultural';

export type PropertyStatus = 'Active' | 'Disputed' | 'Vacant' | 'Leased' | 'Registered';

export type UnitType = 'Apartment' | 'Shop' | 'Office' | 'Penthouse' | 'Studio' | 'Warehouse' | 'Clinic' | 'Utility';

export interface PropertyUnit {
  id: string;
  floorId: string;
  unitNumber: string;
  unitType: UnitType;
  usage: string;
  areaSqM: number;
  status: PropertyStatus;
  ownerName: string; // Clearly fictional demo owner
  taxAssessmentNo: string;
  sharePercentage?: number;
}

export interface Floor {
  id: string;
  buildingId: string;
  floorNumber: number; // 0 = Ground, 1 = 1st, etc.
  floorName: string;
  heightMeters: number;
  areaSqM: number;
  usage: string;
  units: PropertyUnit[];
}

export interface Building {
  id: string;
  parcelId: string;
  buildingName: string;
  buildingType: string;
  constructionYear: number;
  totalFloors: number;
  builtUpAreaSqM: number;
  heightMeters: number;
  color?: string;
  floors: Floor[];
}

export interface PropertyEvent {
  id: string;
  parcelId: string;
  eventType: 'CADASTRE_REGISTERED' | 'ULPIN_ASSIGNED' | 'BUILDING_EXTRUDED' | 'VERTICAL_SUBDIVISION' | 'TAX_ASSESSED' | 'MUTATION_RECORD';
  description: string;
  eventDate: string;
  authority: string;
}

export interface Parcel {
  id: string;
  ulpin: string; // e.g. CG-RPR-ARN-7F29A102
  surveyNumber: string; // e.g. 102/1
  state: string; // e.g. Chhattisgarh
  district: string; // e.g. Raipur
  tehsil: string; // e.g. Arang / Naya Raipur
  village: string; // e.g. BhuSetu Smart Sector
  ward: string; // e.g. Ward 14 - IT & Knowledge Hub
  latitude: number;
  longitude: number;
  areaSqM: number;
  landUse: LandUseType;
  parcelStatus: 'Clear Title' | 'Under Verification' | 'Disputed' | 'Government Reserve';
  boundaryCoordinates: [number, number][]; // [lat, lng] polygon vertices
  fsiAllowed: number;
  fsiConsumed: number;
  buildings: Building[];
  events: PropertyEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CadastralStats {
  totalParcels: number;
  totalBuildings: number;
  totalFloors: number;
  totalUnits: number;
  mappedAreaSqKm: number;
  averageFloors: number;
  commercialRatio: number;
  residentialRatio: number;
}
