import React, { useState } from 'react';
import { LocationData, SensorData, Incident, Road } from '../types';
import { LeafletMap } from '../components/LeafletMap';
import { RiskBadge } from '../components/RiskBadge';
import {
  Filter,
  Search,
  MapPin,
  Compass,
  AlertTriangle,
  Droplets,
  Mountain,
  ChevronRight,
  Shield,
  Layers,
  Radio,
  ExternalLink
} from 'lucide-react';

interface LiveRiskMapPageProps {
  locations: LocationData[];
  sensors: SensorData[];
  incidents: Incident[];
  roads: Road[];
  onOpenExplainability: (loc: LocationData) => void;
  onOpenBroadcast: (loc?: LocationData) => void;
}

export const LiveRiskMapPage: React.FC<LiveRiskMapPageProps> = ({
  locations,
  sensors,
  incidents,
  roads,
  onOpenExplainability,
  onOpenBroadcast
}) => {
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedLoc, setSelectedLoc] = useState<LocationData | null>(null);

  const states = [
    'All States',
    'Arunachal Pradesh',
    'Assam',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Sikkim',
    'Tripura'
  ];

  const filteredLocations = locations.filter(loc => {
    const matchesState = selectedState === 'All States' || loc.state.toLowerCase() === selectedState.toLowerCase();
    const matchesRisk = selectedRisk === 'All' || loc.risk_level === selectedRisk;
    const matchesSearch =
      !search ||
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.district.toLowerCase().includes(search.toLowerCase());
    return matchesState && matchesRisk && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
              Live GIS Landslide Risk & Hazard Map
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              GEOSPATIAL INTELLIGENCE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-layered spatial mapping covering all 8 North Eastern States with interactive hazard polygons
          </p>
        </div>

        {/* Quick Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* State Filter */}
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {states.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Risk Level Filter */}
          <select
            value={selectedRisk}
            onChange={e => setSelectedRisk(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Risk Levels</option>
            <option value="Critical Risk">Critical Risk</option>
            <option value="High Risk">High Risk</option>
            <option value="Moderate Risk">Moderate Risk</option>
            <option value="Low Risk">Low Risk</option>
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search zone or district..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44"
            />
          </div>
        </div>
      </div>

      {/* Main Map + Side Details Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Full Interactive Map */}
        <div className="lg:col-span-8 space-y-3">
          <LeafletMap
            locations={filteredLocations}
            sensors={sensors}
            incidents={incidents}
            roads={roads}
            selectedLocation={selectedLoc}
            onSelectLocation={loc => setSelectedLoc(loc)}
            onOpenExplainability={loc => onOpenExplainability(loc)}
            height="620px"
          />
        </div>

        {/* Right Side Panel: Zone Inspector & Quick List */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Location Card */}
          {selectedLoc ? (
            <div className="glass-panel rounded-2xl p-5 border border-cyan-500/40 space-y-4 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                    SELECTED RISK ZONE
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-0.5">{selectedLoc.name}</h3>
                  <p className="text-xs text-slate-400">{selectedLoc.district}, {selectedLoc.state}</p>
                </div>
                <RiskBadge level={selectedLoc.risk_level} size="sm" />
              </div>

              {/* Quick Telemetry Grid */}
              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400">Risk Score</span>
                  <p className="text-xl font-black text-white">{selectedLoc.risk_score} / 100</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">24h Rainfall</span>
                  <p className="text-xl font-black text-cyan-300">{selectedLoc.rainfall_24h} mm</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Soil Moisture</span>
                  <p className="text-lg font-bold text-amber-400">{selectedLoc.soil_moisture_pct}%</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Slope Angle</span>
                  <p className="text-lg font-bold text-slate-200">{selectedLoc.slope_angle}°</p>
                </div>
              </div>

              {/* Recommended Action Summary */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase">Action Protocol</span>
                <p className="text-slate-300 leading-snug line-clamp-3">
                  {selectedLoc.recommended_action || 'Inspect slope drainage and monitor telemetry.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onOpenExplainability(selectedLoc)}
                  className="flex-1 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Why This Area Is at Risk</span>
                </button>
                <button
                  onClick={() => onOpenBroadcast(selectedLoc)}
                  className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-colors flex items-center gap-1"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Alert</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 text-center space-y-2">
              <Compass className="w-8 h-8 text-cyan-400 mx-auto opacity-60" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Inspect Location</h4>
              <p className="text-xs text-slate-400">
                Click any risk zone marker or polygon on the GIS map to view its live telemetry, geotechnical inputs, and AI explanation.
              </p>
            </div>
          )}

          {/* List of Monitored Hotspots */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Vulnerable Hotspots ({filteredLocations.length})
              </h4>
              <span className="text-[10px] text-slate-400">Ranked by Risk</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredLocations.map(loc => (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLoc(loc)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    selectedLoc?.id === loc.id
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-200'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs text-white truncate">{loc.name}</p>
                    <p className="text-[10px] text-slate-400">{loc.district}, {loc.state}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-extrabold text-xs text-white font-mono">{loc.risk_score}</span>
                    <RiskBadge level={loc.risk_level} size="sm" showPulse={false} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
