import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { LocationData, SensorData, Incident, Road } from '../types';
import {
  Layers,
  Maximize2,
  Minimize2,
  Radio,
  MapPin,
  AlertTriangle,
  Eye,
  Sliders,
  Home,
  Building,
  History,
  Users
} from 'lucide-react';

interface LeafletMapProps {
  locations: LocationData[];
  sensors?: SensorData[];
  incidents?: Incident[];
  roads?: Road[];
  selectedLocation?: LocationData | null;
  onSelectLocation?: (loc: LocationData) => void;
  onOpenExplainability?: (loc: LocationData) => void;
  onOpenBroadcast?: (loc: LocationData) => void;
  height?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  locations,
  sensors = [],
  incidents = [],
  roads = [],
  selectedLocation,
  onSelectLocation,
  onOpenExplainability,
  onOpenBroadcast,
  height = '600px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // 9 Toggleable GIS Layer Groups
  const layerGroupsRef = useRef<{
    heatLayer: L.LayerGroup;
    locationsLayer: L.LayerGroup;
    rainfallLayer: L.LayerGroup;
    sensorsLayer: L.LayerGroup;
    roadsLayer: L.LayerGroup;
    villagesLayer: L.LayerGroup;
    infrastructureLayer: L.LayerGroup;
    historyLayer: L.LayerGroup;
    citizenLayer: L.LayerGroup;
    sheltersLayer: L.LayerGroup;
  } | null>(null);

  const [mapTile, setMapTile] = useState<'dark' | 'satellite' | 'topo'>('dark');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 9 Layer Toggles (All 9 layers from Phase 3)
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showRainfall, setShowRainfall] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showVillages, setShowVillages] = useState(true);
  const [showInfrastructure, setShowInfrastructure] = useState(true);
  const [showHistory, setShowHistory] = useState(true);
  const [showCitizenReports, setShowCitizenReports] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered on North East India (approx 26.2 N, 92.9 E)
    const map = L.map(mapContainerRef.current, {
      center: [26.2, 92.9],
      zoom: 7,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initialize the 9 layers
    const heatLayer = L.layerGroup().addTo(map);
    const locationsLayer = L.layerGroup().addTo(map);
    const rainfallLayer = L.layerGroup().addTo(map);
    const sensorsLayer = L.layerGroup().addTo(map);
    const roadsLayer = L.layerGroup().addTo(map);
    const villagesLayer = L.layerGroup().addTo(map);
    const infrastructureLayer = L.layerGroup().addTo(map);
    const historyLayer = L.layerGroup().addTo(map);
    const citizenLayer = L.layerGroup().addTo(map);
    const sheltersLayer = L.layerGroup().addTo(map);

    layerGroupsRef.current = {
      heatLayer,
      locationsLayer,
      rainfallLayer,
      sensorsLayer,
      roadsLayer,
      villagesLayer,
      infrastructureLayer,
      historyLayer,
      citizenLayer,
      sheltersLayer
    };

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((l: any) => {
      if (l instanceof L.TileLayer) {
        map.removeLayer(l);
      }
    });

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    if (mapTile === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (mapTile === 'topo') {
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    }

    L.tileLayer(tileUrl, {
      maxZoom: 18,
      subdomains: 'abcd'
    }).addTo(map);
  }, [mapTile]);

  // Render Features & Markers across the 9 Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layers = layerGroupsRef.current;
    if (!map || !layers) return;

    // Clear previous
    layers.heatLayer.clearLayers();
    layers.locationsLayer.clearLayers();
    layers.rainfallLayer.clearLayers();
    layers.sensorsLayer.clearLayers();
    layers.roadsLayer.clearLayers();
    layers.villagesLayer.clearLayers();
    layers.infrastructureLayer.clearLayers();
    layers.historyLayer.clearLayers();
    layers.citizenLayer.clearLayers();
    layers.sheltersLayer.clearLayers();

    // 1. Landslide Risk Heatmap & Main Location Markers
    locations.forEach(loc => {
      const isCritical = loc.risk_score >= 76;
      const isHigh = loc.risk_score >= 51 && loc.risk_score < 76;
      const isMod = loc.risk_score >= 26 && loc.risk_score < 51;

      const fillColor = isCritical
        ? '#ef4444'
        : isHigh
        ? '#f97316'
        : isMod
        ? '#f59e0b'
        : '#10b981';

      if (showHeatmap) {
        const circleRadius = isCritical ? 24000 : isHigh ? 18000 : 12000;
        const circle = L.circle([loc.latitude, loc.longitude], {
          radius: circleRadius,
          color: fillColor,
          fillColor,
          fillOpacity: isCritical ? 0.28 : 0.18,
          weight: 1.5,
          dashArray: isCritical ? '4, 4' : undefined
        });
        circle.addTo(layers.heatLayer);
      }

      // 2. Rainfall Intensity Isohyet circle
      if (showRainfall) {
        const rainRadius = Math.max(10000, loc.rainfall_24h * 150);
        const rainCircle = L.circle([loc.latitude, loc.longitude], {
          radius: rainRadius,
          color: '#06b6d4',
          fillColor: '#06b6d4',
          fillOpacity: 0.12,
          weight: 1,
          dashArray: '3, 6'
        });
        rainCircle.addTo(layers.rainfallLayer);
      }

      // Rich Location Marker
      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${isCritical ? '<div class="absolute w-8 h-8 rounded-full bg-red-500/50 animate-ping"></div>' : ''}
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-white/90 font-black text-[10px]" style="background-color: ${fillColor}">
            ${loc.risk_score}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-location-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([loc.latitude, loc.longitude], { icon: customIcon });

      const popupHtml = `
        <div class="p-3.5 text-xs text-slate-100 font-sans max-w-[280px]">
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="font-bold text-sm text-white">${loc.name}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold" style="background:${fillColor}33; color:${fillColor}; border:1px solid ${fillColor}66;">
              ${loc.risk_level}
            </span>
          </div>
          <p class="text-[11px] text-slate-400 mb-2">${loc.district}, ${loc.state}</p>

          <div class="grid grid-cols-2 gap-2 py-2 border-t border-b border-slate-700/60 my-2 font-mono">
            <div>
              <span class="text-slate-400 block text-[9px] font-sans">Rainfall</span>
              <strong class="text-cyan-300 font-bold">${loc.rainfall_24h} mm</strong>
            </div>
            <div>
              <span class="text-slate-400 block text-[9px] font-sans">Soil Moisture</span>
              <strong class="text-amber-300 font-bold">${loc.soil_moisture_pct}%</strong>
            </div>
            <div>
              <span class="text-slate-400 block text-[9px] font-sans">Slope Angle</span>
              <strong class="text-slate-200 font-bold">${loc.slope_angle}°</strong>
            </div>
            <div>
              <span class="text-slate-400 block text-[9px] font-sans">AI Prediction</span>
              <strong class="text-red-400 font-bold">${Math.min(99, Math.round(loc.risk_score * 0.95 + 4))}%</strong>
            </div>
          </div>

          <div class="flex items-center justify-between text-[10px] text-slate-400 mb-3">
            <span>Last Updated: <strong class="text-slate-200">${loc.last_updated}</strong></span>
            <span class="text-emerald-400 font-semibold">Live Feed</span>
          </div>

          <p class="text-[11px] text-slate-300 mb-3 line-clamp-2">
            <strong>Action:</strong> ${loc.recommended_action || 'Continuous telemetry monitoring.'}
          </p>

          <div class="grid grid-cols-2 gap-1.5">
            <button id="btn-explain-${loc.id}" class="py-1.5 px-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] transition-colors shadow flex items-center justify-center gap-1">
              <span>Why at Risk (XAI)</span>
            </button>
            <button id="btn-broadcast-${loc.id}" class="py-1.5 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] transition-colors shadow flex items-center justify-center gap-1">
              <span>Broadcast Alert</span>
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btnExplain = document.getElementById(`btn-explain-${loc.id}`);
        if (btnExplain && onOpenExplainability) {
          btnExplain.onclick = () => onOpenExplainability(loc);
        }
        const btnBroadcast = document.getElementById(`btn-broadcast-${loc.id}`);
        if (btnBroadcast && onOpenBroadcast) {
          btnBroadcast.onclick = () => onOpenBroadcast(loc);
        }
      });

      marker.on('click', () => {
        if (onSelectLocation) onSelectLocation(loc);
      });

      marker.addTo(layers.locationsLayer);
    });

    // 3. IoT Soil Moisture Sensors Layer
    if (showSensors) {
      sensors.forEach(s => {
        const isOnline = s.status === 'Online';
        const sensorHtml = `
          <div class="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-[9px] text-cyan-300 shadow">
            <span class="w-2 h-2 rounded-full ${isOnline ? 'bg-cyan-400' : 'bg-red-400'}"></span>
          </div>
        `;
        const icon = L.divIcon({
          html: sensorHtml,
          className: 'sensor-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        const m = L.marker([s.latitude, s.longitude], { icon });
        m.bindPopup(`
          <div class="p-3 text-xs text-slate-100 font-sans">
            <div class="font-bold text-cyan-400">${s.id} (IoT Sensor)</div>
            <div class="text-[11px] text-slate-300">${s.sensor_type}</div>
            <div class="text-[10px] text-slate-400">${s.location_name}</div>
            <div class="mt-2 text-white font-semibold">Reading: ${s.current_reading} ${s.unit}</div>
            <div class="text-[10px] text-slate-400">Battery: ${s.battery_level}% | Status: ${s.status}</div>
          </div>
        `);
        m.addTo(layers.sensorsLayer);
      });
    }

    // 4. Vulnerable Roads Layer
    if (showRoads) {
      const roadCoordinates: Record<string, [number, number][]> = {
        'rd-1': [[27.0, 92.5], [27.3, 92.2], [27.58, 91.86]], // NH-13 Sela Tawang
        'rd-2': [[26.8, 88.4], [27.1, 88.5], [27.33, 88.60]], // NH-10 Gangtok
        'rd-3': [[25.57, 91.88], [25.40, 91.70], [25.29, 91.58]], // SH-5 Shillong Sohra
        'rd-4': [[25.5, 93.1], [25.2, 93.0], [25.0, 92.8]], // NH-27 Dima Hasao
      };

      roads.forEach(r => {
        const coords = roadCoordinates[r.id];
        if (coords) {
          const color = r.status === 'Blocked' || r.status === 'Critical' ? '#ef4444' : '#f59e0b';
          const line = L.polyline(coords, {
            color,
            weight: 4,
            opacity: 0.85,
            dashArray: r.status === 'Blocked' ? '6, 6' : undefined
          });
          line.bindPopup(`
            <div class="p-2 text-xs text-slate-100 font-sans">
              <strong class="text-white">${r.road_name} (${r.highway_no})</strong>
              <div class="text-[11px] text-red-400 font-bold mt-1">Status: ${r.status}</div>
              <div class="text-[10px] text-slate-300 mt-1">${r.blockage_cause || 'Clearance ongoing'}</div>
              <div class="text-[10px] text-slate-400 mt-1">Est. Clearance: ${r.estimated_clearance_time || 'N/A'}</div>
            </div>
          `);
          line.addTo(layers.roadsLayer);
        }
      });
    }

    // 5. Villages & Habitations Layer
    if (showVillages) {
      const villages = [
        { name: 'Khandro Village', lat: 27.60, lng: 91.90, pop: 1200 },
        { name: 'Nongriat Living Root Hamlet', lat: 25.25, lng: 91.67, pop: 640 },
        { name: 'Dikchu Basti', lat: 27.42, lng: 88.55, pop: 1800 },
        { name: 'Mahur Hill Village', lat: 25.17, lng: 93.12, pop: 2200 }
      ];
      villages.forEach(v => {
        const vHtml = `
          <div class="w-4 h-4 rounded-full bg-indigo-600 border border-indigo-300 flex items-center justify-center text-[8px] text-white font-bold shadow" title="${v.name}">
            V
          </div>
        `;
        const icon = L.divIcon({ html: vHtml, className: 'village-marker', iconSize: [16, 16], iconAnchor: [8, 8] });
        const m = L.marker([v.lat, v.lng], { icon });
        m.bindPopup(`
          <div class="p-2 text-xs text-slate-100 font-sans">
            <strong class="text-indigo-400">${v.name} (Habitation)</strong>
            <p class="text-[10px] text-slate-300 mt-1">Population: ${v.pop} residents</p>
            <p class="text-[10px] text-amber-300">Evacuation Distance: 2.4 km</p>
          </div>
        `);
        m.addTo(layers.villagesLayer);
      });
    }

    // 6. Infrastructure Layer (Bridges, Dams, Power, Tunnels)
    if (showInfrastructure) {
      const infra = [
        { name: 'Sela Tunnel South Portal', lat: 27.50, lng: 92.10, type: 'Strategic Tunnel' },
        { name: 'Teesta Stage-V Dam Barrage', lat: 27.18, lng: 88.51, type: 'Hydro Dam' },
        { name: 'Umiam Power Substation', lat: 25.65, lng: 91.90, type: 'Substation' }
      ];
      infra.forEach(inf => {
        const infHtml = `
          <div class="w-5 h-5 rounded bg-blue-700 border border-white flex items-center justify-center text-[9px] text-white font-bold shadow" title="${inf.name}">
            ⚙
          </div>
        `;
        const icon = L.divIcon({ html: infHtml, className: 'infra-marker', iconSize: [20, 20], iconAnchor: [10, 10] });
        const m = L.marker([inf.lat, inf.lng], { icon });
        m.bindPopup(`
          <div class="p-2 text-xs text-slate-100 font-sans">
            <strong class="text-blue-300">${inf.name}</strong>
            <p class="text-[10px] text-slate-300 mt-1">Classification: ${inf.type}</p>
            <p class="text-[10px] text-emerald-400">Critical Infrastructure Asset</p>
          </div>
        `);
        m.addTo(layers.infrastructureLayer);
      });
    }

    // 7. Historical Incidents Layer
    if (showHistory) {
      const pastSlides = [
        { name: '2020 Sela Debris Flow', lat: 27.52, lng: 92.05, year: '2020', impact: 'Road cut off for 6 days' },
        { name: '2022 Haflong Railway Subsidence', lat: 25.18, lng: 93.01, year: '2022', impact: 'Lumding line breached' },
        { name: '2023 Chungthang Glacial Outburst', lat: 27.60, lng: 88.65, year: '2023', impact: 'Flash flood & scarp failure' }
      ];
      pastSlides.forEach(p => {
        const histHtml = `
          <div class="w-4 h-4 rounded-full bg-slate-700 border border-amber-400 flex items-center justify-center text-[8px] text-amber-300 font-bold shadow" title="${p.name}">
            H
          </div>
        `;
        const icon = L.divIcon({ html: histHtml, className: 'hist-marker', iconSize: [16, 16], iconAnchor: [8, 8] });
        const m = L.marker([p.lat, p.lng], { icon });
        m.bindPopup(`
          <div class="p-2 text-xs text-slate-100 font-sans">
            <strong class="text-amber-400">${p.name}</strong>
            <p class="text-[10px] text-slate-300 mt-1">Year: ${p.year}</p>
            <p class="text-[10px] text-slate-400">${p.impact}</p>
          </div>
        `);
        m.addTo(layers.historyLayer);
      });
    }

    // 8. Citizen & Field Reports Layer
    if (showCitizenReports) {
      incidents.forEach(inc => {
        const isVerified = inc.status === 'Verified' || inc.status === 'Response Initiated';
        const incHtml = `
          <div class="relative w-6 h-6 flex items-center justify-center">
            <span class="absolute w-6 h-6 rounded-full bg-red-600/60 animate-ping"></span>
            <div class="w-5 h-5 rounded-md ${isVerified ? 'bg-red-600' : 'bg-amber-600'} text-white flex items-center justify-center shadow font-bold text-[10px] border border-white">
              !
            </div>
          </div>
        `;
        const icon = L.divIcon({
          html: incHtml,
          className: 'incident-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        const m = L.marker([inc.latitude, inc.longitude], { icon });
        m.bindPopup(`
          <div class="p-3 text-xs text-slate-100 font-sans max-w-[240px]">
            <div class="flex items-center justify-between">
              <span class="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">${inc.severity} Severity</span>
              <span class="text-[9px] text-slate-400 font-mono">${inc.id}</span>
            </div>
            <h4 class="font-bold text-white text-xs mt-1.5">${inc.title}</h4>
            <p class="text-[11px] text-slate-300 mt-1">${inc.location}</p>
            <p class="text-[10px] text-amber-300 mt-1 font-semibold">Reported By: ${inc.reported_by} (${inc.reporter_role})</p>
            <p class="text-[10px] text-slate-400 mt-1">Status: <strong class="text-cyan-300">${inc.status}</strong></p>
          </div>
        `);
        m.addTo(layers.citizenLayer);
      });
    }

    // 9. Emergency Shelters Layer
    if (showShelters) {
      const shelters = [
        { name: 'Tawang General Hospital & Relief Shelter', lat: 27.59, lng: 91.87, type: 'Hospital / Shelter' },
        { name: 'Sohra Community Hall Evacuation Hub', lat: 25.30, lng: 91.59, type: 'Disaster Shelter' },
        { name: 'STNM Multispecialty Hospital Gangtok', lat: 27.34, lng: 88.61, type: 'Medical Center' },
        { name: 'Haflong District Relief Camp', lat: 25.18, lng: 93.02, type: 'Relief Shelter' }
      ];

      shelters.forEach(sh => {
        const shelterHtml = `
          <div class="w-5 h-5 rounded bg-emerald-600 border border-white text-white flex items-center justify-center text-[10px] font-bold shadow" title="${sh.name}">
            +
          </div>
        `;
        const icon = L.divIcon({
          html: shelterHtml,
          className: 'shelter-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        const m = L.marker([sh.lat, sh.lng], { icon });
        m.bindPopup(`
          <div class="p-2 text-xs text-slate-100 font-sans">
            <strong class="text-emerald-400 font-bold">${sh.name}</strong>
            <div class="text-[10px] text-slate-300">${sh.type}</div>
            <div class="text-[10px] text-slate-400 mt-1">Capacity: 450 beds | NDRF / SDRF Linked</div>
          </div>
        `);
        m.addTo(layers.sheltersLayer);
      });
    }
  }, [
    locations,
    sensors,
    incidents,
    roads,
    showHeatmap,
    showRainfall,
    showSensors,
    showRoads,
    showVillages,
    showInfrastructure,
    showHistory,
    showCitizenReports,
    showShelters,
    onOpenExplainability,
    onOpenBroadcast,
    onSelectLocation
  ]);

  // Pan to selected location
  useEffect(() => {
    if (selectedLocation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedLocation.latitude, selectedLocation.longitude],
        9,
        { duration: 1.5 }
      );
    }
  }, [selectedLocation]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : ''
      }`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Left Status Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs text-slate-200 shadow-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="font-bold text-white tracking-wide">NER LIVE GIS COMMAND</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700 font-mono">
            9 LAYERS ACTIVE
          </span>
        </div>
      </div>

      {/* Top Right Controls & 9-Layer Dropdown */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 pointer-events-auto">
        {/* Base Tile Toggle */}
        <div className="flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-1 shadow-lg text-xs">
          <button
            onClick={() => setMapTile('dark')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              mapTile === 'dark' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Dark GIS
          </button>
          <button
            onClick={() => setMapTile('satellite')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              mapTile === 'satellite' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapTile('topo')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              mapTile === 'topo' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Topographic
          </button>
        </div>

        {/* 9 GIS Layers Filter Menu */}
        <div className="relative">
          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-white shadow-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Layers (9)</span>
          </button>

          {isLayerMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-3 z-30 space-y-2 text-xs max-h-96 overflow-y-auto">
              <div className="font-bold text-white border-b border-slate-800 pb-1.5 flex items-center justify-between">
                <span>9 GIS Overlay Layers</span>
                <span className="text-[10px] text-cyan-400 font-mono">Toggleable</span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showHeatmap}
                  onChange={e => setShowHeatmap(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-800"
                />
                <span>1. Landslide Risk Heatmap</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showRainfall}
                  onChange={e => setShowRainfall(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-800"
                />
                <span>2. Rainfall Intensity Isohyets</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showSensors}
                  onChange={e => setShowSensors(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-800"
                />
                <span>3. Soil Moisture Sensors</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showRoads}
                  onChange={e => setShowRoads(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-800"
                />
                <span>4. Vulnerable Roads (NH/SH)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showVillages}
                  onChange={e => setShowVillages(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-800"
                />
                <span>5. Villages & Habitations</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showInfrastructure}
                  onChange={e => setShowInfrastructure(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-800"
                />
                <span>6. Infrastructure & Bridges</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showHistory}
                  onChange={e => setShowHistory(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-800"
                />
                <span>7. Historical Incidents</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showCitizenReports}
                  onChange={e => setShowCitizenReports(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-800"
                />
                <span>8. Citizen & Field Reports</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showShelters}
                  onChange={e => setShowShelters(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-800"
                />
                <span>9. Emergency Shelters</span>
              </label>
            </div>
          )}
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-white shadow-lg transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Left Legend */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-xl text-xs space-y-1.5 hidden sm:block">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Risk Classifications</div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-slate-200">Critical Risk (76–100)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          <span className="text-slate-200">High Risk (51–75)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span className="text-slate-200">Moderate Risk (26–50)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-slate-200">Low Risk (0–25)</span>
        </div>
      </div>
    </div>
  );
};
