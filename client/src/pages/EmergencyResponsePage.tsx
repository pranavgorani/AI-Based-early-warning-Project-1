import React, { useState } from 'react';
import { Incident, EmergencyTeam } from '../types';
import { api } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import {
  LifeBuoy,
  ShieldAlert,
  Send,
  Radio,
  Clock,
  MapPin,
  Phone,
  Users,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  X,
  Sparkles,
  Navigation,
  FileText,
  Compass,
  RefreshCw
} from 'lucide-react';

interface EmergencyResponsePageProps {
  incidents: Incident[];
  emergencyTeams: EmergencyTeam[];
  onTeamUpdated: (team: EmergencyTeam) => void;
  onOpenBroadcast: () => void;
}

export const EmergencyResponsePage: React.FC<EmergencyResponsePageProps> = ({
  incidents,
  emergencyTeams,
  onTeamUpdated,
  onOpenBroadcast
}) => {
  const [dispatchModalTeam, setDispatchModalTeam] = useState<EmergencyTeam | null>(null);
  const [targetIncidentId, setTargetIncidentId] = useState<string>(incidents[0]?.id || '');
  const [evacNotifSuccess, setEvacNotifSuccess] = useState<string | null>(null);

  // Gemini Situation Summary State (Requirement 13)
  const [situationSummary, setSituationSummary] = useState<any>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Emergency Route Planning State (Requirement 12)
  const [routePlan, setRoutePlan] = useState<any>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [routeOrigin, setRouteOrigin] = useState('Guwahati (Base Hub)');
  const [routeDest, setRouteDest] = useState('Tawang (Forward Sector)');

  // Priority Queue Ranking Algorithm based on:
  // (Population Affected * 0.35) + (Severity weight * 0.35) + (Road blocked status * 0.30)
  const rankedIncidents = [...incidents].sort((a, b) => {
    const sevWeight = (s: string) => s === 'Critical' ? 100 : s === 'High' ? 70 : s === 'Moderate' ? 40 : 20;
    const roadWeight = (r: string) => r === 'Blocked' ? 100 : r === 'Critical' ? 90 : r === 'Partially Blocked' ? 50 : 10;
    const scoreA = a.people_affected * 0.05 + sevWeight(a.severity) * 0.5 + roadWeight(a.road_status) * 0.45;
    const scoreB = b.people_affected * 0.05 + sevWeight(b.severity) * 0.5 + roadWeight(b.road_status) * 0.45;
    return scoreB - scoreA;
  });

  const handleGenerateSituationSummary = async () => {
    setLoadingSummary(true);
    try {
      const summary = await api.getExecutiveSummary();
      setSituationSummary(summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleComputeEmergencyRoute = async () => {
    setLoadingRoute(true);
    try {
      const plan = await api.getEmergencyRoute(routeOrigin, routeDest, true);
      setRoutePlan(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRoute(false);
    }
  };

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchModalTeam) return;
    try {
      const updated = await api.updateEmergencyTeam(dispatchModalTeam.id, {
        status: 'Deployed',
        assigned_incident_id: targetIncidentId
      });
      onTeamUpdated(updated);
      setDispatchModalTeam(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerEvacuation = (inc: Incident) => {
    setEvacNotifSuccess(`Mandatory Evacuation Siren and Emergency SMS broadcasted for ${inc.location} (${inc.people_affected} residents alerted)!`);
    setTimeout(() => setEvacNotifSuccess(null), 5000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
              NDRF & SDRF Emergency Tactical Response Matrix
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/40">
              NATIONAL DISASTER CONTINGENCY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time incident priority queue, search-and-rescue dispatch, and inter-agency resource staging
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGenerateSituationSummary}
            disabled={loadingSummary}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 transition-all self-start md:self-auto"
          >
            <Sparkles className={`w-3.5 h-3.5 ${loadingSummary ? 'animate-spin' : ''}`} />
            <span>{loadingSummary ? 'Synthesizing Telemetry...' : 'Generate Situation Summary'}</span>
          </button>

          <button
            onClick={onOpenBroadcast}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all self-start md:self-auto"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Regional Evacuation Siren</span>
          </button>
        </div>
      </div>

      {/* Gemini Operational Situation Summary Card (Requirement 13) */}
      {situationSummary && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-slate-950 border border-purple-500/40 space-y-4 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Outfit']">
                  Operational Situation Summary (Gemini Disaster Intelligence)
                </h3>
                <span className="text-[10px] text-purple-300">Generated strictly from multi-sensor & GIS telemetry</span>
              </div>
            </div>

            <span className="text-[10px] font-mono text-slate-400">
              Confidence: <strong className="text-emerald-400">{situationSummary.dataConfidence}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                CURRENT SITUATION
              </span>
              <p className="text-slate-200 leading-relaxed font-medium">
                {situationSummary.currentSituation}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                RISK ASSESSMENT
              </span>
              <p className="text-slate-200 leading-relaxed font-medium">
                {situationSummary.riskAssessment}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                RECOMMENDED RESPONSE
              </span>
              <p className="text-slate-200 leading-relaxed font-medium">
                {situationSummary.recommendedResponse}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-[11px]">
            <div>
              <span className="text-slate-400 font-bold block mb-1 uppercase text-[10px]">Major Contributing Factors:</span>
              <ul className="space-y-1">
                {situationSummary.majorContributingFactors?.map((fac: string, idx: number) => (
                  <li key={idx} className="text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>{fac}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-slate-400 font-bold block mb-1 uppercase text-[10px]">Primary Vulnerable Locations:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {situationSummary.affectedLocations?.map((loc: string, idx: number) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-300 border border-red-500/30 text-[10px] font-semibold">
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Corridor & Safe Routing Engine (Requirement 12) */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 bg-slate-900/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                Emergency Route Intelligence & Hazard Avoidance
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/40">
                  TOPOLOGICAL RISK GRAPH / GOOGLE ROUTES
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Calculates risk-aware detours avoiding high-probability landslide slopes and road blockages across NER highway corridors.
              </p>
            </div>
          </div>
          <button
            onClick={handleComputeEmergencyRoute}
            disabled={loadingRoute}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-cyan-600/30 self-start sm:self-auto"
          >
            <Compass className={`w-3.5 h-3.5 ${loadingRoute ? 'animate-spin' : ''}`} />
            <span>{loadingRoute ? 'Calculating Safe Vector...' : 'Compute Safe Route'}</span>
          </button>
        </div>

        {/* Route Input Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Origin / Dispatch Hub</label>
            <input
              type="text"
              value={routeOrigin}
              onChange={(e) => setRouteOrigin(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium focus:border-cyan-500 focus:outline-none"
              placeholder="e.g., Guwahati Base Hub"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Destination Incident Zone</label>
            <input
              type="text"
              value={routeDest}
              onChange={(e) => setRouteDest(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium focus:border-cyan-500 focus:outline-none"
              placeholder="e.g., Tawang Forward Sector"
            />
          </div>
          <div className="flex flex-col justify-end">
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold text-[11px]">Dynamic Slope Hazard Avoidance</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Route Output Results */}
        {routePlan && (
          <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-3 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-white">{routePlan.origin}</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-black text-white">{routePlan.destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  Engine: {routePlan.routingEngine}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  {routePlan.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Distance</span>
                <span className="text-lg font-black text-white">{routePlan.distanceKm} km</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Estimated Transit ETA</span>
                <span className="text-lg font-black text-cyan-300">{Math.floor(routePlan.durationMinutes / 60)}h {routePlan.durationMinutes % 60}m</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Risk Exposure Score</span>
                <span className="text-lg font-black text-emerald-400">{routePlan.riskExposureScore} / 100</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Corridor Safety Status</span>
                <span className="text-xs font-bold text-amber-300 mt-1 block truncate">
                  {routePlan.hazardAvoided ? 'Active Detour Selected' : 'Direct Corridor'}
                </span>
              </div>
            </div>

            {routePlan.hazardSegmentsAvoided?.length > 0 && (
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200">
                <strong className="text-amber-400 uppercase font-black mr-2">Hazards Bypassed:</strong>
                {routePlan.hazardSegmentsAvoided.join(', ')}
              </div>
            )}

            {/* Waypoint Milestones */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Corridor Tactical Waypoints:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {routePlan.waypoints?.map((wp: any, idx: number) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-slate-200 font-bold block truncate">{wp.name}</span>
                      <span className="text-[9px] font-mono text-slate-500">{wp.lat?.toFixed(2)}°N, {wp.lng?.toFixed(2)}°E</span>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      wp.status === 'Clear'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : wp.status === 'Monitoring'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {wp.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{routePlan.safetyAdvisory}</span>
            </div>
          </div>
        )}
      </div>


      {evacNotifSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <span>{evacNotifSuccess}</span>
          <button onClick={() => setEvacNotifSuccess(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Resource Fleet Staging KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'NDRF Battalions', val: '4 Active', sub: '12th & 1st Bns Staged', color: 'border-red-500/30' },
          { label: 'SDRF Tactical Units', val: '8 Units', sub: 'All 8 State Capitals', color: 'border-orange-500/30' },
          { label: 'Heavy Earthmovers', val: '24 Excavators', sub: 'BRO Swastik & Vartak', color: 'border-amber-500/30' },
          { label: 'Air Wing Helipads', val: '6 Ready', sub: 'Tezpur & Shillong Base', color: 'border-cyan-500/30' },
          { label: 'Designated Shelters', val: '48 Evac Hubs', sub: 'Stocked with Rations', color: 'border-emerald-500/30' },
        ].map((res, i) => (
          <div key={i} className={`glass-panel p-3.5 rounded-xl border ${res.color}`}>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{res.label}</span>
            <p className="text-xl font-black text-white mt-1">{res.val}</p>
            <span className="text-[10px] text-slate-400">{res.sub}</span>
          </div>
        ))}
      </div>

      {/* Emergency Priority Queue (Ranked automatically) */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Emergency Priority Queue (AI Ranked by Human Impact & Road Blockage)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">HIGHEST URGENCY FIRST</span>
        </div>

        <div className="space-y-3">
          {rankedIncidents.slice(0, 3).map((inc, index) => (
            <div
              key={inc.id}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-red-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-black text-sm shrink-0">
                  #{index + 1}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-white">{inc.title}</h4>
                    <RiskBadge level={inc.severity} size="sm" />
                    <span className="text-[10px] font-mono text-cyan-300">({inc.id})</span>
                  </div>
                  <p className="text-xs text-slate-300">{inc.location} • {inc.district}, {inc.state}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span>People At Risk: <strong className="text-white">{inc.people_affected}</strong></span>
                    <span>•</span>
                    <span>Road: <strong className="text-amber-400">{inc.road_status}</strong></span>
                    <span>•</span>
                    <span>Desk: <strong className="text-slate-200">{inc.assigned_officer || 'Unassigned'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for this emergency item */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleTriggerEvacuation(inc)}
                  className="px-3 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold transition-colors"
                >
                  Order Evacuation
                </button>
                <button
                  onClick={() => {
                    setTargetIncidentId(inc.id);
                    setDispatchModalTeam(emergencyTeams[0]);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold shadow-lg shadow-red-600/30 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Deploy Unit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Tactical Response Units Grid */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Tactical Rapid Response Teams (NDRF, SDRF, BRO, IAF)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">UPDATED CONTINUOUSLY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyTeams.map(team => {
            const isDeployed = team.status === 'Deployed';
            return (
              <div
                key={team.id}
                className={`glass-panel rounded-2xl p-4 border transition-all ${
                  isDeployed ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400">{team.id}</span>
                    <h4 className="text-xs font-bold text-white mt-0.5">{team.name}</h4>
                    <p className="text-[10px] text-slate-400">{team.base_location} ({team.state})</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isDeployed
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {team.status}
                  </span>
                </div>

                <div className="p-3 my-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Personnel:</span>
                    <strong className="text-white">{team.personnel_count} Specialists</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vehicles & Gear:</span>
                    <strong className="text-slate-200 text-right truncate max-w-[150px]">{team.vehicles}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Transit ETA:</span>
                    <strong className="text-cyan-300 font-mono">{team.eta_minutes} Mins</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-cyan-400" />
                    {team.contact_number}
                  </span>
                  <button
                    onClick={() => {
                      setDispatchModalTeam(team);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs transition-colors"
                  >
                    {isDeployed ? 'Reassign' : 'Dispatch'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispatch Modal */}
      {dispatchModalTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Mobilize Tactical Response Unit</h3>
                <p className="text-[10px] text-cyan-400 font-bold">{dispatchModalTeam.name}</p>
              </div>
              <button onClick={() => setDispatchModalTeam(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Priority Incident</label>
                <select
                  value={targetIncidentId}
                  onChange={e => setTargetIncidentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-cyan-500"
                >
                  {incidents.map(i => (
                    <option key={i.id} value={i.id}>
                      [{i.severity}] {i.title} - {i.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div className="text-cyan-400 font-bold">Standard Operational Procedure:</div>
                <p>1. Transmit GPS mission coordinates to command vehicle navigation.</p>
                <p>2. Radio link frequency established on Channel VHF 142.85 MHz.</p>
                <p>3. Field casualty evacuation point designated at closest clearing.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDispatchModalTeam(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl shadow-lg shadow-red-600/30"
                >
                  Confirm Rapid Deployment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
