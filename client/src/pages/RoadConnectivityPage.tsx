import React, { useState } from 'react';
import { Road } from '../types';
import { api } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import {
  Truck,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Compass,
  Building2,
  Zap,
  Activity,
  Search,
  Filter,
  ArrowRight,
  Clock,
  Shield
} from 'lucide-react';

interface RoadConnectivityPageProps {
  roads: Road[];
  onRoadUpdated: (road: Road) => void;
}

export const RoadConnectivityPage: React.FC<RoadConnectivityPageProps> = ({
  roads,
  onRoadUpdated
}) => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedRoad, setSelectedRoad] = useState<Road | null>(roads[0] || null);

  const filteredRoads = roads.filter(r => {
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
    const matchesSearch =
      !search ||
      r.road_name.toLowerCase().includes(search.toLowerCase()) ||
      r.highway_no.toLowerCase().includes(search.toLowerCase()) ||
      r.district.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const criticalInfrastructure = [
    { name: 'Teesta River Arch Bridge Km 48', type: 'Bridge (Lifeline)', district: 'Gangtok, Sikkim', status: 'Under Stress', sensor: 'Strain Sensor ST-401', health: '82%' },
    { name: 'Jatinga Rail Culvert No. 42', type: 'Railway Aqueduct', district: 'Dima Hasao, Assam', status: 'Scoured / Blocked', sensor: 'Piezometer PZ-88', health: '45%' },
    { name: 'Sela Pass High-Altitude Power Grid Line', type: '33kV Transmission', district: 'Tawang, Arunachal', status: 'Operational', sensor: 'Tower Tilt TL-19', health: '94%' },
    { name: 'Cherrapunji Water Treatment & Pumping Station', type: 'Drinking Water Supply', district: 'East Khasi Hills, Meghalaya', status: 'Operational', sensor: 'Flow Gauge FL-02', health: '96%' },
    { name: 'Kolasib Valley Primary Health Center', type: 'Rural Medical Outpost', district: 'Kolasib, Mizoram', status: 'Isolated (Alternate Route Only)', sensor: 'GPS Beacon HC-07', health: '68%' },
  ];

  const handleToggleRoadStatus = async (road: Road, newStatus: Road['status']) => {
    try {
      const updated = await api.updateRoad(road.id, { status: newStatus });
      onRoadUpdated(updated);
      if (selectedRoad?.id === road.id) {
        setSelectedRoad(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
            Road Arteries & Critical Infrastructure Monitoring
          </h2>
          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
            BORDER ROADS & NHAI FEED
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Surveillance of national highways, state corridors, bridges, and mountain supply lines across the North Eastern Region
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-red-500/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Completely Blocked</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-3xl font-black text-red-400 mt-1">
            {roads.filter(r => r.status === 'Blocked' || r.status === 'Critical').length}
          </p>
          <span className="text-[10px] text-slate-400">NH-13 & NH-27 major slides</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Partially Blocked</span>
            <Truck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400 mt-1">
            {roads.filter(r => r.status === 'Partially Blocked').length}
          </p>
          <span className="text-[10px] text-slate-400">Single-lane convoys operational</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Fully Open</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-1">
            {roads.filter(r => r.status === 'Open').length}
          </p>
          <span className="text-[10px] text-slate-400">Patrolled by PWD & BRO</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Heavy Equipment</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-white mt-1">14 Teams</p>
          <span className="text-[10px] text-cyan-400 font-semibold">Earthmovers deployed</span>
        </div>
      </div>

      {/* Main Grid: Road Table + Emergency Route Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Road Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-medium focus:outline-none"
            >
              <option value="All">All Road Statuses</option>
              <option value="Blocked">Blocked</option>
              <option value="Partially Blocked">Partially Blocked</option>
              <option value="Critical">Critical</option>
              <option value="Open">Open</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search highway or district..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48"
              />
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-3 px-4">Highway & Segment</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Connectivity</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Est. Restoration</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredRoads.map(r => (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedRoad(r)}
                    className={`cursor-pointer transition-colors ${
                      selectedRoad?.id === r.id ? 'bg-cyan-500/10' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-white">
                      <div>{r.road_name}</div>
                      <span className="text-[10px] text-cyan-400 font-mono">{r.highway_no}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{r.district}, {r.state}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'Blocked' || r.status === 'Critical'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : r.status === 'Partially Blocked'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge level={r.risk_level} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-200">
                      {r.estimated_clearance_time || 'Operational'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={r.status}
                        onChange={e => handleToggleRoadStatus(r, e.target.value as any)}
                        onClick={e => e.stopPropagation()}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] font-bold text-slate-200 focus:outline-none"
                      >
                        <option value="Blocked">Blocked</option>
                        <option value="Partially Blocked">Partially Blocked</option>
                        <option value="Critical">Critical</option>
                        <option value="Open">Open</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Emergency Route Visualization & Details Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {selectedRoad ? (
            <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 space-y-4 shadow-xl">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  HIGHWAY CONNECTIVITY REPORT
                </span>
                <h3 className="text-base font-extrabold text-white mt-0.5">{selectedRoad.road_name}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedRoad.highway_no} • {selectedRoad.district}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Status:</span>
                  <strong className="text-red-400">{selectedRoad.status}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Obstruction:</span>
                  <strong className="text-slate-200 text-right">{selectedRoad.blockage_cause || 'Debris cleared'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Re-opening:</span>
                  <strong className="text-cyan-300 font-mono">{selectedRoad.estimated_clearance_time}</strong>
                </div>
              </div>

              {/* Alternate Emergency Route Card */}
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-cyan-300">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  <span>Designated Evacuation & Diversion Route</span>
                </div>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {selectedRoad.alternate_route || 'No alternate route necessary; main highway is functional.'}
                </p>
                <div className="text-[10px] text-slate-400 pt-1">
                  Traffic advisories broadcasted via FASTag toll portals and state transport depots.
                </div>
              </div>

              <div className="text-[10px] text-slate-500">
                Last physical inspection by PWD Patrol: {selectedRoad.last_inspection}
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 text-center text-xs text-slate-400">
              Select a road to view emergency diversion routes
            </div>
          )}
        </div>
      </div>

      {/* Critical Infrastructure Health Matrix */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Vulnerable Mountain Infrastructure (Bridges, Dams, Power Lines, Health Centers)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-300">TELEMETRY SYNCED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criticalInfrastructure.map((infra, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-white text-xs">{infra.name}</h4>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    infra.status.includes('Scoured') || infra.status.includes('Stress')
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {infra.status}
                </span>
              </div>
              <p className="text-[11px] text-cyan-300">{infra.type} • {infra.district}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                <span>{infra.sensor}</span>
                <span className="font-bold text-white">Integrity: {infra.health}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
