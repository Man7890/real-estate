/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Parcel, LandUseType } from '../../types';
import { Layers, MapPin, ZoomIn, ZoomOut, Compass } from 'lucide-react';

interface CadastralMapProps {
  parcels: Parcel[];
  selectedParcelId: string | null;
  onSelectParcel: (id: string) => void;
  mapLayer: 'streets' | 'satellite';
  onToggleLayer: (layer: 'streets' | 'satellite') => void;
  className?: string;
}

const LAND_USE_COLORS: Record<LandUseType, { fill: string; stroke: string }> = {
  Residential: { fill: '#3B82F6', stroke: '#1D4ED8' },
  Commercial: { fill: '#F59E0B', stroke: '#D97706' },
  'Mixed Use': { fill: '#8B5CF6', stroke: '#6D28D9' },
  Institutional: { fill: '#10B981', stroke: '#047857' },
  Industrial: { fill: '#EF4444', stroke: '#B91C1C' },
  Agricultural: { fill: '#84CC16', stroke: '#4D7C0F' },
};

export const CadastralMap: React.FC<CadastralMapProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
  mapLayer,
  onToggleLayer,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const polygonLayersRef = useRef<Map<string, L.Polygon>>(new Map());
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered on BhuSetu Smart District (Naya Raipur / Atal Nagar cadastral area)
    const map = L.map(mapContainerRef.current, {
      center: [21.1655, 81.7870],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });

    // Custom OSM Tile Layer
    const tileUrl =
      mapLayer === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tile = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    tileLayerRef.current = tile;
    mapInstanceRef.current = map;
    markersLayerGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when layer switch changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      mapLayer === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tile = L.tileLayer(tileUrl, {
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tile;
  }, [mapLayer]);

  // Render / Update Cadastral Polygons
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing polygons
    polygonLayersRef.current.forEach((poly) => map.removeLayer(poly));
    polygonLayersRef.current.clear();

    if (markersLayerGroupRef.current) {
      markersLayerGroupRef.current.clearLayers();
    }

    parcels.forEach((parcel) => {
      const isSelected = parcel.id === selectedParcelId;
      const colorScheme = LAND_USE_COLORS[parcel.landUse] || LAND_USE_COLORS.Residential;

      const poly = L.polygon(parcel.boundaryCoordinates, {
        color: isSelected ? '#2563EB' : colorScheme.stroke,
        weight: isSelected ? 3.5 : 1.5,
        fillColor: isSelected ? '#3B82F6' : colorScheme.fill,
        fillOpacity: isSelected ? 0.65 : 0.45,
        dashArray: isSelected ? undefined : '2, 3',
      }).addTo(map);

      // Tooltip
      poly.bindTooltip(
        `<div class="p-1 text-xs">
          <div class="font-bold text-slate-900">${parcel.ulpin}</div>
          <div class="text-slate-600">Survey #${parcel.surveyNumber} · ${parcel.landUse}</div>
          <div class="text-slate-500">${parcel.buildings[0]?.buildingName || 'Parcel'} (${parcel.buildings[0]?.totalFloors || 1} Floors)</div>
        </div>`,
        { direction: 'top', className: 'custom-parcel-tooltip', sticky: true }
      );

      poly.on('click', () => {
        onSelectParcel(parcel.id);
      });

      polygonLayersRef.current.set(parcel.id, poly);

      // Add center badge marker for key parcels
      if (isSelected || parcel.id === 'parcel-001' || parcel.id === 'parcel-002' || parcel.id === 'parcel-003') {
        const markerHtml = `
          <div class="cursor-pointer group flex flex-col items-center">
            <div class="px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow-md border ${
              isSelected
                ? 'bg-blue-600 text-white border-blue-400 scale-110 ring-2 ring-blue-300'
                : 'bg-white/95 text-slate-800 border-slate-300'
            } transition-transform">
              ${parcel.surveyNumber}
            </div>
            <div class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-slate-700'} mt-0.5"></div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'bg-transparent border-0',
          iconSize: [50, 26],
          iconAnchor: [25, 26],
        });

        const marker = L.marker([parcel.latitude, parcel.longitude], { icon: customIcon });
        marker.on('click', () => onSelectParcel(parcel.id));
        markersLayerGroupRef.current?.addLayer(marker);
      }
    });

    // Fly to selected parcel if changed
    if (selectedParcelId) {
      const sel = parcels.find((p) => p.id === selectedParcelId);
      if (sel) {
        map.panTo([sel.latitude, sel.longitude], { animate: true, duration: 0.8 });
      }
    }
  }, [parcels, selectedParcelId]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    mapInstanceRef.current?.flyTo([21.1655, 81.7870], 16, { duration: 1 });
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Control Cluster (Top Right) */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 p-1 flex flex-col gap-1">
          <button
            onClick={() => onToggleLayer(mapLayer === 'streets' ? 'satellite' : 'streets')}
            className="p-2 rounded text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            title={`Switch to ${mapLayer === 'streets' ? 'Satellite' : 'Street'} view`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <div className="h-px bg-slate-200 mx-1" />
          <button
            onClick={handleZoomIn}
            className="p-2 rounded text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-px bg-slate-200 mx-1" />
          <button
            onClick={handleResetView}
            className="p-2 rounded text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            title="Reset District View"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cadastral Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 px-3 py-2 text-xs">
        <div className="font-semibold text-slate-800 text-[11px] mb-1.5 uppercase tracking-wider">
          Cadastral Land Use
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-600 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 border border-blue-700" />
            <span>Residential</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 border border-amber-700" />
            <span>Commercial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 border border-purple-700" />
            <span>Mixed Use</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 border border-emerald-700" />
            <span>Institutional</span>
          </div>
        </div>
      </div>
    </div>
  );
};
