/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Parcel, LandUseType } from '../types';
import { generateBuildingHierarchy, createDefaultEvents } from '../utils/ulpinGenerator';

/**
 * Creates realistic rectangular polygon boundary coordinates around a center point
 */
function createParcelPolygon(lat: number, lng: number, widthMeters = 35, heightMeters = 30): [number, number][] {
  // Approximate conversion: 1 deg lat ~ 111,000m, 1 deg lng ~ 103,000m at 21 deg N
  const dLat = (heightMeters / 111000) / 2;
  const dLng = (widthMeters / 103000) / 2;

  return [
    [lat - dLat, lng - dLng],
    [lat + dLat, lng - dLng],
    [lat + dLat, lng + dLng],
    [lat - dLat, lng + dLng],
  ];
}

export function createInitialDemoCity(): Parcel[] {
  const parcels: Parcel[] = [];

  // 1. Specified Primary Anchor Parcels:
  
  // Parcel 001 - Residential
  const p1Polygon = createParcelPolygon(21.1645, 81.7850, 36, 35);
  const p1Building = generateBuildingHierarchy('parcel-001', 'BHUSETU RESIDENCE', 4, 'Residential', 420);
  // Ensure exact units specified in prompt:
  // Ground: G01, G02; F1: 101, 102; F2: 201, 202; F3: 301, 302
  p1Building.floors.forEach((flr, idx) => {
    const prefix = idx === 0 ? 'G' : `${idx}`;
    flr.units = [
      {
        id: `unit-p1-${prefix}01`,
        floorId: flr.id,
        unitNumber: `${prefix}01`,
        unitType: 'Apartment',
        usage: idx === 0 ? 'Ground Garden Residence' : 'Residential 3BHK',
        areaSqM: 180,
        status: 'Active',
        ownerName: 'Aarav Sharma (Demo Record)',
        taxAssessmentNo: `TAX-2026-P001-${prefix}01`,
        sharePercentage: 12.5,
      },
      {
        id: `unit-p1-${prefix}02`,
        floorId: flr.id,
        unitNumber: `${prefix}02`,
        unitType: 'Apartment',
        usage: idx === 0 ? 'Ground Garden Residence' : 'Residential 3BHK',
        areaSqM: 185,
        status: 'Active',
        ownerName: 'Sunita Dewangan (Demo Record)',
        taxAssessmentNo: `TAX-2026-P001-${prefix}02`,
        sharePercentage: 12.5,
      },
    ];
  });

  const parcel1: Parcel = {
    id: 'parcel-001',
    ulpin: 'CG-RPR-ARN-7F29A102',
    surveyNumber: '102/1',
    state: 'Chhattisgarh',
    district: 'Raipur',
    tehsil: 'Arang',
    village: 'BhuSetu Smart District',
    ward: 'Sector 24 - Green Vista',
    latitude: 21.1645,
    longitude: 81.7850,
    areaSqM: 1250,
    landUse: 'Residential',
    parcelStatus: 'Clear Title',
    boundaryCoordinates: p1Polygon,
    fsiAllowed: 2.5,
    fsiConsumed: 1.34,
    buildings: [p1Building],
    events: createDefaultEvents('parcel-001', 'CG-RPR-ARN-7F29A102'),
    createdAt: '2023-04-12T10:00:00Z',
    updatedAt: '2026-01-15T08:30:00Z',
  };
  parcels.push(parcel1);

  // Parcel 002 - Commercial
  const p2Polygon = createParcelPolygon(21.1668, 81.7885, 48, 44);
  const p2Building = generateBuildingHierarchy('parcel-002', 'BHUSETU PLAZA', 5, 'Commercial', 580);
  // Ensure units match prompt: G01, G02, G03, 101, 102, 201, 202, 301, 302, 401, 402
  p2Building.floors.forEach((flr, idx) => {
    if (idx === 0) {
      flr.units = ['G01', 'G02', 'G03'].map((code, uIdx) => ({
        id: `unit-p2-${code}`,
        floorId: flr.id,
        unitNumber: code,
        unitType: 'Shop',
        usage: 'Prime Retail Showroom',
        areaSqM: 150,
        status: 'Active',
        ownerName: `Raipur Retail Hub Ltd (Demo #${uIdx + 1})`,
        taxAssessmentNo: `TAX-2026-P002-${code}`,
        sharePercentage: 9.09,
      }));
    } else {
      flr.units = [`${idx}01`, `${idx}02`].map((code, uIdx) => ({
        id: `unit-p2-${code}`,
        floorId: flr.id,
        unitNumber: code,
        unitType: 'Office',
        usage: 'Corporate IT Suite',
        areaSqM: 220,
        status: 'Active',
        ownerName: `SmartTech Innovate LLP (Demo #${idx}-${uIdx + 1})`,
        taxAssessmentNo: `TAX-2026-P002-${code}`,
        sharePercentage: 9.09,
      }));
    }
  });

  const parcel2: Parcel = {
    id: 'parcel-002',
    ulpin: 'CG-RPR-ARN-9E41C203',
    surveyNumber: '103/2',
    state: 'Chhattisgarh',
    district: 'Raipur',
    tehsil: 'Arang',
    village: 'BhuSetu Smart District',
    ward: 'Sector 24 - Central Commercial Arcade',
    latitude: 21.1668,
    longitude: 81.7885,
    areaSqM: 2100,
    landUse: 'Commercial',
    parcelStatus: 'Clear Title',
    boundaryCoordinates: p2Polygon,
    fsiAllowed: 3.0,
    fsiConsumed: 2.15,
    buildings: [p2Building],
    events: createDefaultEvents('parcel-002', 'CG-RPR-ARN-9E41C203'),
    createdAt: '2023-04-18T11:00:00Z',
    updatedAt: '2026-02-01T14:15:00Z',
  };
  parcels.push(parcel2);

  // Parcel 003 - Mixed Use
  const p3Polygon = createParcelPolygon(21.1632, 81.7895, 42, 40);
  const p3Building = generateBuildingHierarchy('parcel-003', 'SMART MARKET TOWER', 6, 'Mixed Use', 500);
  const parcel3: Parcel = {
    id: 'parcel-003',
    ulpin: 'CG-RPR-ARN-3B85D104',
    surveyNumber: '104/1',
    state: 'Chhattisgarh',
    district: 'Raipur',
    tehsil: 'Arang',
    village: 'BhuSetu Smart District',
    ward: 'Sector 25 - Urban Promenade',
    latitude: 21.1632,
    longitude: 81.7895,
    areaSqM: 1800,
    landUse: 'Mixed Use',
    parcelStatus: 'Clear Title',
    boundaryCoordinates: p3Polygon,
    fsiAllowed: 3.5,
    fsiConsumed: 2.65,
    buildings: [p3Building],
    events: createDefaultEvents('parcel-003', 'CG-RPR-ARN-3B85D104'),
    createdAt: '2023-05-02T09:20:00Z',
    updatedAt: '2026-02-12T16:40:00Z',
  };
  parcels.push(parcel3);

  // Procedural generator to populate 50+ total parcels across a realistic smart district grid
  const baseLat = 21.1610;
  const baseLng = 81.7810;
  const landUseCycle: LandUseType[] = [
    'Residential',
    'Commercial',
    'Mixed Use',
    'Residential',
    'Institutional',
    'Residential',
    'Commercial',
  ];

  const buildingNamesPrefix = [
    'Aura Heights',
    'Apex Horizon',
    'Crystal Pavilion',
    'Ganga Enclave',
    'Mahanadi Tower',
    'Navodaya Chambers',
    'Silicon Nexus',
    'Pinnacle Square',
    'Harmony Residency',
    'Oasis IT Park',
    'Vigyan Bhavan',
    'Samriddhi Complex',
  ];

  let idCounter = 4;
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 8; col++) {
      if (parcels.length >= 52) break;
      
      const lat = baseLat + row * 0.0022 + (col % 2 === 0 ? 0.0003 : -0.0002);
      const lng = baseLng + col * 0.0024 + (row % 2 === 0 ? 0.0002 : -0.0001);

      // Skip coords overlapping parcel 1, 2, 3
      if (Math.abs(lat - 21.1645) < 0.0008 && Math.abs(lng - 81.7850) < 0.0008) continue;
      if (Math.abs(lat - 21.1668) < 0.0008 && Math.abs(lng - 81.7885) < 0.0008) continue;
      if (Math.abs(lat - 21.1632) < 0.0008 && Math.abs(lng - 81.7895) < 0.0008) continue;

      const parcelId = `parcel-${String(idCounter).padStart(3, '0')}`;
      const surveyNum = `${100 + idCounter}/${(idCounter % 4) + 1}`;
      const landUse = landUseCycle[(row * 3 + col) % landUseCycle.length];
      const floorsCount = Math.min(10, Math.max(2, (row + col) % 8 + 2));
      const area = 800 + ((row * 137 + col * 243) % 2200);

      const poly = createParcelPolygon(lat, lng, 32 + (col % 4) * 4, 28 + (row % 4) * 4);
      const bldgName = `${buildingNamesPrefix[(idCounter + row) % buildingNamesPrefix.length]} ${
        col > 4 ? 'Phase II' : 'Block ' + String.fromCharCode(65 + (col % 4))
      }`;

      const bldg = generateBuildingHierarchy(parcelId, bldgName, floorsCount, landUse, Math.round(area * 0.45));
      const hexHash = ((idCounter * 73856093) ^ (row * 19349663) ^ (col * 83492791))
        .toString(16)
        .toUpperCase()
        .slice(0, 8)
        .padStart(8, 'A');

      const ulpin = `CG-RPR-ARN-${hexHash}`;

      parcels.push({
        id: parcelId,
        ulpin,
        surveyNumber: surveyNum,
        state: 'Chhattisgarh',
        district: 'Raipur',
        tehsil: 'Arang',
        village: 'BhuSetu Smart District',
        ward: `Sector ${20 + (row % 6)} - Ward ${(col % 5) + 1}`,
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6)),
        areaSqM: area,
        landUse,
        parcelStatus: idCounter % 15 === 0 ? 'Under Verification' : 'Clear Title',
        boundaryCoordinates: poly,
        fsiAllowed: landUse === 'Commercial' ? 3.5 : 2.5,
        fsiConsumed: Number((((bldg.builtUpAreaSqM || area) / area)).toFixed(2)),
        buildings: [bldg],
        events: createDefaultEvents(parcelId, ulpin),
        createdAt: '2023-06-10T08:00:00Z',
        updatedAt: '2026-03-01T12:00:00Z',
      });

      idCounter++;
    }
  }

  return parcels;
}
