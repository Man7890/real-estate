/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Parcel, Building, Floor, PropertyUnit, LandUseType, PropertyEvent } from '../types';

/**
 * Deterministic string hash (FNV-1a 32-bit algorithm)
 */
function fnv1a(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

/**
 * State and District short abbreviations
 */
const STATE_CODES: Record<string, string> = {
  'chhattisgarh': 'CG',
  'maharashtra': 'MH',
  'madhya pradesh': 'MP',
  'karnataka': 'KA',
  'telangana': 'TS',
  'gujarat': 'GJ',
  'delhi': 'DL',
  'uttar pradesh': 'UP',
  'rajasthan': 'RJ',
};

const DISTRICT_CODES: Record<string, string> = {
  'raipur': 'RPR',
  'durg': 'DRG',
  'bilaspur': 'BSP',
  'bhopal': 'BPL',
  'indore': 'IND',
  'bengaluru': 'BLR',
  'hyderabad': 'HYD',
  'mumbai': 'MUM',
  'pune': 'PUN',
  'ahmedabad': 'AMD',
};

export interface GenerateULPINInput {
  state: string;
  district: string;
  tehsil: string;
  village?: string;
  ward?: string;
  surveyNumber: string;
  latitude: number;
  longitude: number;
  areaSqM?: number;
}

/**
 * Generates a deterministic DEMO ULPIN.
 * Format: [STATE]-[DIST]-[TEH]-[8-CHAR-HASH]
 * Note: Clearly labelled as a demonstration identifier for research & hackathon prototype.
 */
export function generateDemoULPIN(input: GenerateULPINInput): {
  ulpin: string;
  hashPart: string;
  isDemo: true;
  formula: string;
} {
  const normState = (input.state || 'Chhattisgarh').trim().toLowerCase();
  const normDistrict = (input.district || 'Raipur').trim().toLowerCase();
  const normTehsil = (input.tehsil || 'Arang').trim();
  const normSurvey = (input.surveyNumber || '101/1').trim();
  const latStr = Number(input.latitude || 21.16).toFixed(5);
  const lngStr = Number(input.longitude || 81.78).toFixed(5);

  const stateCode = STATE_CODES[normState] || normState.slice(0, 2).toUpperCase();
  const distCode = DISTRICT_CODES[normDistrict] || normDistrict.slice(0, 3).toUpperCase();
  const tehCode = normTehsil.slice(0, 3).toUpperCase();

  // Combine coordinate, survey number, and cadastral zone into deterministic seed
  const rawSeed = `${normState}|${normDistrict}|${normTehsil}|${normSurvey}|${latStr}|${lngStr}`;
  const hash1 = fnv1a(rawSeed).toString(16).toUpperCase().padStart(8, '0');
  
  const ulpin = `${stateCode}-${distCode}-${tehCode}-${hash1}`;

  return {
    ulpin,
    hashPart: hash1,
    isDemo: true,
    formula: `${stateCode} [State] + ${distCode} [District] + ${tehCode} [Tehsil] + ${hash1} [Cadastral Coord Hash]`,
  };
}

/**
 * Realistic Fictional Indian Names for Demo Property Units
 */
const FICTIONAL_OWNERS = [
  'Aarav Sharma (Demo Record)',
  'Priya Deshmukh (Demo Record)',
  'Vikram Patel (Demo Record)',
  'Ananya Iyer (Demo Record)',
  'Rohit Verma (Demo Record)',
  'Sunita Dewangan (Demo Record)',
  'Rajesh Agrawal (Demo Record)',
  'Meera Kulkarni (Demo Record)',
  'BhuSetu Municipal Trust (Demo)',
  'Raipur Smart Urban Infra Ltd (Demo)',
  'Siddharth Soni (Demo Record)',
  'Kavita Chandrakar (Demo Record)',
];

/**
 * Procedurally generates a building, floors, and property units for a parcel
 */
export function generateBuildingHierarchy(
  parcelId: string,
  buildingName: string,
  floorsCount: number,
  landUse: LandUseType,
  baseAreaSqM: number
): Building {
  const buildingId = `bldg-${parcelId}-${Math.floor(Math.random() * 1000)}`;
  const floorHeight = 3.2; // meters per floor
  const floors: Floor[] = [];

  const buildingType =
    landUse === 'Residential'
      ? 'High-Rise Residential'
      : landUse === 'Commercial'
      ? 'Commercial Corporate Hub'
      : landUse === 'Mixed Use'
      ? 'Mixed Retail & Residential Tower'
      : landUse === 'Institutional'
      ? 'Smart Civic Complex'
      : 'Light Logistics Terminal';

  let unitCounter = 1;

  for (let f = 0; f < floorsCount; f++) {
    const floorId = `flr-${buildingId}-${f}`;
    const floorName = f === 0 ? 'Ground Floor' : `Floor ${f}`;
    const floorUsage =
      f === 0 && (landUse === 'Commercial' || landUse === 'Mixed Use')
        ? 'Retail & Commercial Lobby'
        : f === 0
        ? 'Stilt Parking & Reception'
        : landUse === 'Commercial'
        ? 'Corporate Office Suites'
        : landUse === 'Mixed Use' && f <= 2
        ? 'Commercial Retail & Clinic'
        : 'Residential Living Quarters';

    const unitsCount = landUse === 'Commercial' ? 3 : landUse === 'Mixed Use' ? (f <= 2 ? 3 : 2) : 2;
    const units: PropertyUnit[] = [];
    const unitArea = Math.round((baseAreaSqM * 0.85) / unitsCount);

    for (let u = 0; u < unitsCount; u++) {
      const unitNumStr = f === 0 ? `G0${u + 1}` : `${f}0${u + 1}`;
      const unitType =
        f === 0 && (landUse === 'Commercial' || landUse === 'Mixed Use')
          ? 'Shop'
          : landUse === 'Commercial'
          ? 'Office'
          : f === floorsCount - 1 && floorsCount > 3
          ? 'Penthouse'
          : 'Apartment';

      const statusChoices: PropertyUnit['status'][] = ['Active', 'Active', 'Active', 'Registered', 'Leased'];
      const status = statusChoices[(f + u) % statusChoices.length];

      units.push({
        id: `unit-${floorId}-${u}`,
        floorId,
        unitNumber: unitNumStr,
        unitType,
        usage: `${unitType} Unit - ${floorUsage}`,
        areaSqM: unitArea,
        status,
        ownerName: FICTIONAL_OWNERS[(unitCounter + f * 2 + u) % FICTIONAL_OWNERS.length],
        taxAssessmentNo: `TAX-2026-${parcelId.slice(-4)}-${unitNumStr}`,
        sharePercentage: Number((100 / (floorsCount * unitsCount)).toFixed(2)),
      });
      unitCounter++;
    }

    floors.push({
      id: floorId,
      buildingId,
      floorNumber: f,
      floorName,
      heightMeters: floorHeight,
      areaSqM: Math.round(baseAreaSqM * 0.9),
      usage: floorUsage,
      units,
    });
  }

  return {
    id: buildingId,
    parcelId,
    buildingName,
    buildingType,
    constructionYear: 2021 + (floorsCount % 5),
    totalFloors: floorsCount,
    builtUpAreaSqM: Math.round(baseAreaSqM * 0.9 * floorsCount),
    heightMeters: Number((floorsCount * floorHeight).toFixed(1)),
    floors,
  };
}

/**
 * Creates default timeline events for a parcel
 */
export function createDefaultEvents(parcelId: string, ulpin: string): PropertyEvent[] {
  return [
    {
      id: `evt-1-${parcelId}`,
      parcelId,
      eventType: 'CADASTRE_REGISTERED',
      description: 'Cadastral polygon vertices surveyed via DGPS and mapped to Revenue Sheet.',
      eventDate: '2023-04-12',
      authority: 'Directorate of Land Records, CG',
    },
    {
      id: `evt-2-${parcelId}`,
      parcelId,
      eventType: 'ULPIN_ASSIGNED',
      description: `Prototype 3D ULPIN ${ulpin} generated and bound to 2D land parcel boundary.`,
      eventDate: '2023-05-18',
      authority: 'BhuSetu Cadastral Registry (Prototype)',
    },
    {
      id: `evt-3-${parcelId}`,
      parcelId,
      eventType: 'BUILDING_EXTRUDED',
      description: 'Building sanction plan cross-referenced and 3D volumetric extrusion initialized.',
      eventDate: '2024-01-10',
      authority: 'Smart City Urban Planning Authority',
    },
    {
      id: `evt-4-${parcelId}`,
      parcelId,
      eventType: 'VERTICAL_SUBDIVISION',
      description: 'Floor strata registered and multi-unit digital property deeds assigned.',
      eventDate: '2025-08-22',
      authority: 'Inspector General of Registration & Stamps',
    },
  ];
}
