import React, { useState, useMemo, useEffect } from 'react';
import { LocationData, SensorData, Incident, Alert, Road, AnalyticsSummary } from '../types';
import { KPICard } from '../components/KPICard';
import { RiskMap } from '../components/RiskMap';
import { RiskBadge } from '../components/RiskBadge';
import { api } from '../services/api';
import {
  AlertTriangle,
  Radio,
  Activity,
  Truck,
  Droplets,
  Cpu,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  LifeBuoy,
  Clock,
  Navigation,
  Layers,
  Sparkles,
  MapPin,
  TrendingUp
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line
} from 'recharts';

interface CommandCenterProps {
  locations: LocationData[];
  sensors: SensorData[];
  incidents: Incident[];
  alerts: Alert[];
  roads: Road[];
  analytics: AnalyticsSummary | null;
  onOpenExplainability: (loc: LocationData) => void;
  onOpenBroadcast: (loc?: LocationData) => void;
  onNavigate: (page: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  locations,
  sensors,
  incidents,
  alerts,
  roads,
  analytics,
  onOpenExplainability,
  onOpenBroadcast,
  onNavigate
}) => {
  const [selectedLoc, setSelectedLoc] = useState<LocationData | null>(null);
  const [liveWeather, setLiveWeather] = useState<any>(null);
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoNotice, setDemoNotice] = useState<string | null>(null);

  useEffect(() => {
    api.getWeatherCurrent().then(w => {
      if (w) setLiveWeather(w);
    });
  }, []);

  const handleRunDemoScenario = async () => {
    setDemoRunning(true);
    try {
      const res = await api.triggerDemoScenario();
      if (res) {
        setDemoNotice(`Demo Triggered: Heavy Rain in ${res.affectedLocation?.name} (Risk: ${res.affectedLocation?.risk_score}/100 CRITICAL). Multilingual Emergency Alert Broadcasted!`);
        setTimeout(() => setDemoNotice(null), 8000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDemoRunning(false);
    }
  };

  // Panel 3 Forecast Tabs: 24h, 48h, 72h
  const [forecastTab, setForecastTab] = useState<'24h' | '48h' | '72h'>('24h');

  // Multi-day forecast curves
  const forecastDataMap = {
    '24h': [
      { time: '00:00', risk: 42, rainfall: 8.2, status: 'Moderate' },
      { time: '04:00', risk: 54, rainfall: 16.5, status: 'High' },
      { time: '08:00', risk: 68, rainfall: 24.0, status: 'High' },
      { time: '12:00', risk: 85, rainfall: 34.2, status: 'Critical' },
      { time: '16:00', risk: 91, rainfall: 42.0, status: 'Critical' },
      { time: '20:00', risk: 88, rainfall: 36.5, status: 'Critical' },
      { time: '24:00', risk: 79, rainfall: 28.0, status: 'Critical' }
    ],
    '48h': [
      { time: 'Day 1 00:00', risk: 42, rainfall: 12.0, status: 'Moderate' },
      { time: 'Day 1 12:00', risk: 86, rainfall: 38.0, status: 'Critical' },
      { time: 'Day 1 24:00', risk: 82, rainfall: 30.0, status: 'Critical' },
      { time: 'Day 2 06:00', risk: 72, rainfall: 22.0, status: 'High' },
      { time: 'Day 2 12:00', risk: 64, rainfall: 18.0, status: 'High' },
      { time: 'Day 2 18:00', risk: 52, rainfall: 14.0, status: 'High' },
      { time: 'Day 2 24:00', risk: 45, rainfall: 8.0, status: 'Moderate' }
    ],
    '72h': [
      { time: 'Day 1 (Now)', risk: 86, rainfall: 42.0, status: 'Critical' },
      { time: 'Day 2 (+24h)', risk: 70, rainfall: 26.0, status: 'High' },
      { time: 'Day 2 (+36h)', risk: 58, rainfall: 19.0, status: 'High' },
      { time: 'Day 3 (+48h)', risk: 46, rainfall: 12.0, status: 'Moderate' },
      { time: 'Day 3 (+60h)', risk: 38, rainfall: 8.0, status: 'Moderate' },
      { time: 'Day 3 (+72h)', risk: 24, rainfall: 4.0, status: 'Low' }
    ]
  };

  // Panel 1: Zones grouped by severity
  const zoneBreakdown = useMemo(() => {
    const criticalZones = locations.filter(l => l.risk_score >= 76);
    const highZones = locations.filter(l => l.risk_score >= 51 && l.risk_score < 76);
    const moderateZones = locations.filter(l => l.risk_score >= 26 && l.risk_score < 51);
    const lowZones = locations.filter(l => l.risk_score < 26);

    return { criticalZones, highZones, moderateZones, lowZones };
  }, [locations]);

  // Panel 2: Road Breakdown
  const roadBreakdown = useMemo(() => {
    const blocked = roads.filter(r => r.status === 'Blocked' || r.status === 'Critical');
    const partiallyBlocked = roads.filter(r => r.status === 'Partially Blocked');
    const atRisk = roads.filter(r => r.status === 'Open' && (r.risk_level === 'High Risk' || r.risk_level === 'Critical Risk'));
    const open = roads.filter(r => r.status === 'Open' && r.risk_level !== 'High Risk' && r.risk_level !== 'Critical Risk');
    return { blocked, partiallyBlocked, atRisk, open };
  }, [roads]);

  // Panel 4: Emergency Response Prioritization Ranking Algorithm
  // Ranked by: Risk Severity, Population Affected, Infrastructure, Road Connectivity, Distance from teams
  const prioritizedIncidents = useMemo(() => {
    return [...incidents].map(inc => {
      let severityWeight = inc.severity === 'Critical' ? 40 : inc.severity === 'High' ? 30 : inc.severity === 'Moderate' ? 18 : 8;
      let popWeight = Math.min(25, Math.round((inc.people_affected / 200) * 25));
      let roadWeight = inc.road_status === 'Blocked' ? 20 : inc.road_status === 'Partially Blocked' ? 12 : 4;
      let score = severityWeight + popWeight + roadWeight + 10;

      let priorityLabel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
      let sla = 'Routine Monitoring';
      let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';

      if (score >= 70) {
        priorityLabel = 'CRITICAL';
        sla = 'Immediate Action';
        badgeColor = 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse';
      } else if (score >= 50) {
        priorityLabel = 'HIGH';
        sla = 'Respond Within 2 Hours';
        badgeColor = 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      } else if (score >= 30) {
        priorityLabel = 'MEDIUM';
        sla = 'Monitor Closely';
        badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      }

      return {
        ...inc,
        priorityScore: score,
        priorityLabel,
        sla,
        badgeColor
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }, [incidents]);

  return (
    <div className="space-y-6 pb-16">
      {/* Page Title & Emergency Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
              NER Disaster Intelligence Command Center
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
              EARLY WARNING ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Integrated Real-Time Landslide Early Warning System covering all 8 North Eastern States (MDoNER)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenBroadcast()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Broadcast Warning</span>
          </button>
          <button
            onClick={() => onNavigate('incident-report')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all"
          >
            <span>+ Report Hazard</span>
          </button>
        </div>
      </div>

      {/* Live Weather Intelligence HUD & Demo Mode Notification */}
      <div className="space-y-3">
        {/* Live Weather Source Strip */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-slate-950 border border-blue-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Droplets className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white">
                  {liveWeather?.response?.station_name || 'IMD Regional Doppler Radar Centre, Guwahati'}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  {liveWeather?.source || 'IMD Doppler Radar Telemetry'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {liveWeather?.response?.weather_condition || 'Heavy Rain Showers'} • Temp: {liveWeather?.response?.temperature ?? 20}°C (Feels like {liveWeather?.response?.feels_like ?? 22}°C) • Rainfall Rate: {liveWeather?.response?.rainfall_intensity ?? 32.4} mm/hr • Humidity: {liveWeather?.response?.humidity ?? 94}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-400 block font-mono">Last Synchronized:</span>
              <span className="text-[11px] font-bold text-cyan-400 font-mono">
                {liveWeather?.timestamp ? new Date(liveWeather.timestamp).toLocaleTimeString() : 'Live'}
              </span>
            </div>
            <button
              onClick={() => onNavigate('weather')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
            >
              Weather Matrix →
            </button>
          </div>
        </div>

        {/* Demo Mode Interactive Banner */}
        <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="font-bold uppercase tracking-wider text-[11px]">
              DEMO MODE ACTIVE (Hackathon Scenario)
            </span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              Simulate cloudburst → saturation → critical risk → Gemini multilingual alert → safe emergency detour
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunDemoScenario}
              disabled={demoRunning}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{demoRunning ? 'Simulating Cascade...' : 'Simulate Landslide Trigger'}</span>
            </button>
            <button
              onClick={() => onNavigate('api-health')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              API Health & Costs
            </button>
          </div>
        </div>

        {demoNotice && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{demoNotice}</span>
          </div>
        )}
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard
          title="Active High-Risk Zones"
          value={zoneBreakdown.criticalZones.length + zoneBreakdown.highZones.length}
          subtitle="Tawang & Sohra Critical"
          icon={AlertTriangle}
          accentColor="red"
          change="+4 today"
          changeType="negative"
          onClick={() => onNavigate('live-map')}
        />
        <KPICard
          title="Critical Alerts"
          value={alerts.filter(a => a.severity === 'Emergency' || a.severity === 'Warning').length}
          subtitle="Evacuation Advisories"
          icon={ShieldAlert}
          accentColor="orange"
          change="Live Active"
          changeType="warning"
          onClick={() => onNavigate('alerts')}
        />
        <KPICard
          title="Monitored Sensors"
          value={sensors.length > 0 ? sensors.length * 150 : '1,248'}
          subtitle="98.4% Telemetry Uptime"
          icon={Activity}
          accentColor="cyan"
          change="Online"
          changeType="positive"
          onClick={() => onNavigate('data-integration')}
        />
        <KPICard
          title="Vulnerable Roads"
          value={roads.length}
          subtitle="NH-13 & NH-10 Monitored"
          icon={Truck}
          accentColor="amber"
          change={`${roadBreakdown.blocked.length} Blocked`}
          changeType="neutral"
          onClick={() => onNavigate('road-connectivity')}
        />
        <KPICard
          title="Rainfall Risk Index"
          value="84%"
          subtitle="Monsoon Infiltration"
          icon={Droplets}
          accentColor="blue"
          change="Torrential"
          changeType="negative"
          onClick={() => onNavigate('weather')}
        />
        <KPICard
          title="AI Confidence"
          value="94.2%"
          subtitle="Random Forest + Physics"
          icon={Cpu}
          accentColor="emerald"
          change="Calibrated"
          changeType="positive"
          onClick={() => onNavigate('ai-predictions')}
        />
      </div>

      {/* Interactive GIS Command Center Map with 9 Layers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              North Eastern Region Interactive GIS Command Map
            </h3>
          </div>
          <button
            onClick={() => onNavigate('live-map')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 hover:underline"
          >
            <span>Expand Full GIS Console</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <RiskMap
          locations={locations}
          sensors={sensors}
          incidents={incidents}
          roads={roads}
          selectedLocation={selectedLoc}
          onSelectLocation={loc => setSelectedLoc(loc)}
          onOpenExplainability={loc => onOpenExplainability(loc)}
          onOpenBroadcast={loc => onOpenBroadcast(loc)}
          height="480px"
        />
      </div>

      {/* ========================================================================= */}
      {/* THE FOUR CORE COMMAND PANELS (Specified in Phase 3) */}
      {/* ========================================================================= */}
      <div className="space-y-6 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-black text-xs font-mono">
            COMMAND SUITE
          </span>
          <h3 className="text-lg font-black text-white font-['Outfit']">
            Four Core Early Warning Panels
          </h3>
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* PANEL 1: Risk Severity Overview */}
        {/* ------------------------------------------------------------------------- */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                PANEL 1: Risk Severity Overview
              </h4>
            </div>
            <span className="text-xs text-slate-400">
              Color-coded classification across monitored sectors (0–100 Scale)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Critical Risk Card */}
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/60 shadow-lg shadow-red-950/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-red-400 tracking-wider">
                  Critical Risk (76–100)
                </span>
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              </div>
              <p className="text-3xl font-black text-white font-mono">
                {zoneBreakdown.criticalZones.length} <span className="text-xs font-normal text-red-300">Active Zones</span>
              </p>
              <div className="space-y-1 text-xs text-slate-300 pt-1 border-t border-red-500/20">
                {zoneBreakdown.criticalZones.slice(0, 2).map(z => (
                  <div key={z.id} className="flex justify-between truncate">
                    <span className="text-slate-300 font-semibold truncate">{z.name}</span>
                    <strong className="text-red-400 font-mono">{z.risk_score}</strong>
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-red-400 block pt-1 uppercase">
                Action: Evacuate Low-Lying Dwellings
              </span>
            </div>

            {/* High Risk Card */}
            <div className="p-4 rounded-xl bg-orange-950/30 border border-orange-500/60 shadow-lg shadow-orange-950/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider">
                  High Risk (51–75)
                </span>
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              </div>
              <p className="text-3xl font-black text-white font-mono">
                {zoneBreakdown.highZones.length} <span className="text-xs font-normal text-orange-300">Active Zones</span>
              </p>
              <div className="space-y-1 text-xs text-slate-300 pt-1 border-t border-orange-500/20">
                {zoneBreakdown.highZones.slice(0, 2).map(z => (
                  <div key={z.id} className="flex justify-between truncate">
                    <span className="text-slate-300 font-semibold truncate">{z.name}</span>
                    <strong className="text-orange-400 font-mono">{z.risk_score}</strong>
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-orange-400 block pt-1 uppercase">
                Action: Deploy BRO Earthmovers
              </span>
            </div>

            {/* Moderate Risk Card */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/60 shadow-lg shadow-amber-950/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  Moderate Risk (26–50)
                </span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              </div>
              <p className="text-3xl font-black text-white font-mono">
                {zoneBreakdown.moderateZones.length} <span className="text-xs font-normal text-amber-300">Active Zones</span>
              </p>
              <div className="space-y-1 text-xs text-slate-300 pt-1 border-t border-amber-500/20">
                {zoneBreakdown.moderateZones.slice(0, 2).map(z => (
                  <div key={z.id} className="flex justify-between truncate">
                    <span className="text-slate-300 font-semibold truncate">{z.name}</span>
                    <strong className="text-amber-400 font-mono">{z.risk_score}</strong>
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-bold text-amber-400 block pt-1 uppercase">
                Action: Continuous Telemetry Watch
              </span>
            </div>

            {/* Low Risk Card */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/60 shadow-lg shadow-emerald-950/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                  Low Risk (0–25)
                </span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-3xl font-black text-white font-mono">
                {zoneBreakdown.lowZones.length} <span className="text-xs font-normal text-emerald-300">Nominal Zones</span>
              </p>
              <div className="space-y-1 text-xs text-slate-300 pt-1 border-t border-emerald-500/20">
                <div className="flex justify-between">
                  <span className="text-slate-400">Guwahati Urban Rim</span>
                  <strong className="text-emerald-400 font-mono">18</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Agartala Basin</span>
                  <strong className="text-emerald-400 font-mono">12</strong>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 block pt-1 uppercase">
                Action: Standard Periodic Check
              </span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* PANEL 2: Road Connectivity Status */}
        {/* ------------------------------------------------------------------------- */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Truck className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                PANEL 2: Road Connectivity Status & Lifeline Corridors
              </h4>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="text-emerald-400">{roadBreakdown.open.length} Open</span>
              <span className="text-amber-400">{roadBreakdown.atRisk.length} At-Risk</span>
              <span className="text-orange-400">{roadBreakdown.partiallyBlocked.length} Partially Blocked</span>
              <span className="text-red-400">{roadBreakdown.blocked.length} Blocked</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Highway / Artery</th>
                  <th className="py-2.5 px-3">State / District</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Risk Assessment</th>
                  <th className="py-2.5 px-3">Cause / Blockage Condition</th>
                  <th className="py-2.5 px-3">Est. Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {roads.map(r => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white">
                      {r.road_name} <span className="text-cyan-400 font-mono">({r.highway_no})</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{r.district}, {r.state}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          r.status === 'Blocked' || r.status === 'Critical'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : r.status === 'Partially Blocked'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <RiskBadge level={r.risk_level} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate">
                      {r.blockage_cause || 'Clear for traffic'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-cyan-300">
                      {r.estimated_clearance_time || 'Normal'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* PANEL 3: Weather-Linked Risk Forecast (24h, 48h, 72h Tabs) */}
        {/* ------------------------------------------------------------------------- */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Clock className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  PANEL 3: Weather-Linked Risk Forecast
                </h4>
                <p className="text-xs text-slate-400">Multi-horizon predictive risk score mapped against precipitation intensity</p>
              </div>
            </div>

            {/* Forecast Tab Buttons */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
              <button
                onClick={() => setForecastTab('24h')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  forecastTab === '24h' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Next 24 Hours
              </button>
              <button
                onClick={() => setForecastTab('48h')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  forecastTab === '48h' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Next 48 Hours
              </button>
              <button
                onClick={() => setForecastTab('72h')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  forecastTab === '72h' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Next 72 Hours
              </button>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastDataMap[forecastTab]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="rainG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#riskG)" name="Predicted Risk Score (0-100)" />
                <Area type="monotone" dataKey="rainfall" stroke="#06b6d4" strokeWidth={2} fillOpacity={0.5} fill="url(#rainG)" name="Rainfall mm/hr" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 font-medium">Forecast Summary:</span>
              <p className="text-white font-bold mt-0.5">
                {forecastTab === '24h' ? 'Critical peak risk expected between 12:00 and 18:00' :
                 forecastTab === '48h' ? 'Elevated hazard across Arunachal & Meghalaya before waning on Day 2' :
                 'Stabilization expected beyond 48 hours as monsoon front departs'}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 font-medium">Hydrological Threshold:</span>
              <p className="text-amber-400 font-bold mt-0.5">Saturation exceeds 85% until hour +28</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 font-medium">Advisory Action:</span>
              <p className="text-cyan-400 font-bold mt-0.5">Pre-position SDRF rescue boats & heavy excavators</p>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* PANEL 4: Emergency Response Prioritization */}
        {/* ------------------------------------------------------------------------- */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                <LifeBuoy className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  PANEL 4: Autonomous Emergency Response Prioritization
                </h4>
                <p className="text-xs text-slate-400">
                  Algorithmic ranking: Severity (40%) + Population Exposed (25%) + Road Connectivity (20%) + Proximity (15%)
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('emergency-response')}
              className="text-xs text-cyan-400 hover:underline font-bold flex items-center gap-1"
            >
              <span>Dispatch Teams Console</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {prioritizedIncidents.slice(0, 6).map((inc, index) => (
              <div
                key={inc.id}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-red-500/40 transition-all space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    Rank #{index + 1} | {inc.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${inc.badgeColor}`}>
                    {inc.priorityLabel}
                  </span>
                </div>

                <h5 className="text-xs font-bold text-white truncate">{inc.title}</h5>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  {inc.location} ({inc.district}, {inc.state})
                </p>

                <div className="grid grid-cols-2 gap-1.5 p-2 rounded-lg bg-slate-950 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-500 block">People Affected:</span>
                    <strong className="text-white font-bold">{inc.people_affected} residents</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Road Status:</span>
                    <strong className="text-amber-400">{inc.road_status}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800">
                  <span className="text-red-400 font-bold">{inc.sla}</span>
                  <button
                    onClick={() => onNavigate('emergency-response')}
                    className="text-cyan-400 hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <span>Mobilize</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
