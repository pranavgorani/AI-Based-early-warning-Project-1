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
  Sliders
} from 'lucide-react';

interface LeafletMapProps {
  locations: LocationData[];
  sensors?: SensorData[];
  incidents?: Incident[];
  roads?: Road[];
  selectedLocation?: LocationData | null;
  onSelectLocation?: (loc: LocationData) => void;
  onOpenExplainability?: (loc: LocationData) => void;
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
  height = '600px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{
    heatLayer: L.LayerGroup;
    locationsLayer: L.LayerGroup;
    sensorsLayer: L.LayerGroup;
    incidentsLayer: L.LayerGroup;
    roadsLayer: L.LayerGroup;
    sheltersLayer: L.LayerGroup;
  } | null>(null);

  const [mapTile, setMapTile] = useState<'dark' | 'satellite' | 'topo'>('dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // Initialize Map
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

    // Layer groups for toggling
    const heatLayer = L.layerGroup().addTo(map);
    const locationsLayer = L.layerGroup().addTo(map);
    const sensorsLayer = L.layerGroup().addTo(map);
    const incidentsLayer = L.layerGroup().addTo(map);
    const roadsLayer = L.layerGroup().addTo(map);
    const sheltersLayer = L.layerGroup().addTo(map);

    layerGroupsRef.current = {
      heatLayer,
      locationsLayer,
      sensorsLayer,
      incidentsLayer,
      roadsLayer,
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

    // Remove existing tile layer
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

  // Render Markers and Features
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layers = layerGroupsRef.current;
    if (!map || !layers) return;

    // Clear previous items
    layers.heatLayer.clearLayers();
    layers.locationsLayer.clearLayers();
    layers.sensorsLayer.clearLayers();
    layers.incidentsLayer.clearLayers();
    layers.roadsLayer.clearLayers();
    layers.sheltersLayer.clearLayers();

    // 1. Locations & Risk Heat Zones
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

      // Heat Circle / Risk Area Polygon
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

      // Location Marker Icon
      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${isCritical ? '<div class="absolute w-8 h-8 rounded-full bg-red-500/40 animate-ping"></div>' : ''}
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-white/80" style="background-color: ${fillColor}">
            <span class="text-[10px] font-black">${loc.risk_score}</span>
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

      // Rich Popup
      const popupHtml = `
        <div class="p-3.5 text-xs text-slate-100 font-sans max-w-[280px]">
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="font-bold text-sm text-white">${loc.name}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold" style="background:${fillColor}33; color:${fillColor}; border:1px solid ${fillColor}66;">
              ${loc.risk_level}
            </span>
          </div>
          <p class="text-[11px] text-slate-400 mb-2">${loc.district}, ${loc.state}</p>
          
          <div class="grid grid-cols-2 gap-2 py-2 border-t border-b border-slate-700/60 my-2">
            <div>
              <span class="text-slate-400 block text-[10px]">24h Rainfall</span>
              <strong class="text-cyan-300 font-bold">${loc.rainfall_24h} mm</strong>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Soil Moisture</span>
              <strong class="text-amber-300 font-bold">${loc.soil_moisture_pct}%</strong>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Slope Angle</span>
              <strong class="text-slate-200 font-bold">${loc.slope_angle}°</strong>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">AI Failure Prob.</span>
              <strong class="text-red-400 font-bold">${Math.min(99, Math.round(loc.risk_score * 0.95 + 4))}%</strong>
            </div>
          </div>

          <p class="text-[11px] text-slate-300 mb-3 line-clamp-2">
            <strong>Action:</strong> ${loc.recommended_action || 'Inspect slope drainage and monitor telemetry.'}
          </p>

          <button id="btn-explain-${loc.id}" class="w-full py-1.5 px-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow">
            <span>Why This Area Is at Risk (XAI)</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-explain-${loc.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onOpenExplainability) onOpenExplainability(loc);
          };
        }
      });

      marker.on('click', () => {
        if (onSelectLocation) onSelectLocation(loc);
      });

      marker.addTo(layers.locationsLayer);
    });

    // 2. Active Sensors Markers
    if (showSensors) {
      sensors.forEach(s => {
        const isOnline = s.status === 'Online';
        const sensorHtml = `
          <div class="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-[9px] text-cyan-300 shadow" title="${s.sensor_type} (${s.id})">
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
            <div class="font-bold text-cyan-400">${s.id}</div>
            <div class="text-[11px] text-slate-300">${s.sensor_type}</div>
            <div class="text-[10px] text-slate-400">${s.location_name}</div>
            <div class="mt-2 text-white font-semibold">Reading: ${s.current_reading} ${s.unit}</div>
            <div class="text-[10px] text-slate-400">Battery: ${s.battery_level}% | Status: ${s.status}</div>
          </div>
        `);
        m.addTo(layers.sensorsLayer);
      });
    }

    // 3. Active Incidents Markers
    if (showIncidents) {
      incidents.forEach(inc => {
        const incHtml = `
          <div class="relative w-6 h-6 flex items-center justify-center">
            <span class="absolute w-6 h-6 rounded-full bg-red-600/60 animate-ping"></span>
            <div class="w-5 h-5 rounded-md bg-red-600 text-white flex items-center justify-center shadow font-bold text-[10px] border border-white">
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
            <span class="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">${inc.severity} Severity</span>
            <h4 class="font-bold text-white text-xs mt-1">${inc.title}</h4>
            <p class="text-[11px] text-slate-300 mt-1">${inc.location}</p>
            <p class="text-[10px] text-amber-300 mt-1 font-semibold">Road: ${inc.road_status} | People: ${inc.people_affected}</p>
            <p class="text-[10px] text-slate-400 mt-1">Status: ${inc.status}</p>
          </div>
        `);
        m.addTo(layers.incidentsLayer);
      });
    }

    // 4. Blocked / Vulnerable Roads
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

    // 5. Emergency Shelters & Hospitals
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
            <div class="text-[10px] text-slate-400 mt-1">Capacity: 450 beds | NDRF linked</div>
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
    showSensors,
    showIncidents,
    showRoads,
    showShelters,
    onOpenExplainability,
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
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Left Status & Title Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs text-slate-200 shadow-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="font-bold text-white tracking-wide">NER LIVE GIS COMMAND</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700 font-mono">
            8 STATES
          </span>
        </div>
      </div>

      {/* Top Right Map Controls */}
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

        {/* Layer Filters Menu */}
        <div className="relative">
          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-white shadow-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Layers</span>
          </button>

          {isLayerMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-3 z-30 space-y-2 text-xs">
              <div className="font-bold text-white border-b border-slate-800 pb-1.5">GIS Overlay Layers</div>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showHeatmap}
                  onChange={e => setShowHeatmap(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-800"
                />
                <span>Risk Heatmap Zones</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showSensors}
                  onChange={e => setShowSensors(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-800"
                />
                <span>IoT Sensors</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showIncidents}
                  onChange={e => setShowIncidents(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-800"
                />
                <span>Active Incidents</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showRoads}
                  onChange={e => setShowRoads(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-800"
                />
                <span>Road Arteries (NH/SH)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showShelters}
                  onChange={e => setShowShelters(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-800"
                />
                <span>Hospitals & Shelters</span>
              </label>
            </div>
          )}
        </div>

        {/* Fullscreen Toggle */}
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
