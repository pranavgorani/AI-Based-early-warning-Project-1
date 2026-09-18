import React, { useState } from 'react';
import { LocationData, SensorData, Incident, Alert, Road, AnalyticsSummary } from '../types';
import { KPICard } from '../components/KPICard';
import { LeafletMap } from '../components/LeafletMap';
import { RiskBadge } from '../components/RiskBadge';
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
  ExternalLink
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
  Legend
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

  // Hourly simulated risk curve
  const hourlyRiskTrend = [
    { time: '00:00', risk: 42, rainfall: 8.2 },
    { time: '03:00', risk: 48, rainfall: 14.5 },
    { time: '06:00', risk: 62, rainfall: 22.0 },
    { time: '09:00', risk: 74, rainfall: 28.5 },
    { time: '12:00', risk: 85, rainfall: 34.0 },
    { time: '15:00', risk: 89, rainfall: 38.2 },
    { time: '18:00 (Now)', risk: 89, rainfall: 35.0 },
    { time: '21:00 (Pred)', risk: 91, rainfall: 39.0 },
    { time: '24:00 (Pred)', risk: 86, rainfall: 28.0 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Emergency Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
              NER Disaster Intelligence Command Center
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
              CODE RED ACTIVE
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

      {/* KPI Cards Row (Animated values from prompt) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          title="Active High-Risk Zones"
          value={analytics?.kpis.activeHighRiskZones || 24}
          subtitle="Tawang & Sohra Critical"
          icon={AlertTriangle}
          accentColor="red"
          change="+4 today"
          changeType="negative"
          onClick={() => onNavigate('live-map')}
        />
        <KPICard
          title="Critical Alerts"
          value={analytics?.kpis.criticalAlerts || 7}
          subtitle="4 Evacuation Advisories"
          icon={ShieldAlert}
          accentColor="orange"
          change="3 Pending"
          changeType="warning"
          onClick={() => onNavigate('alerts')}
        />
        <KPICard
          title="Monitored Sensors"
          value={analytics?.kpis.monitoredSensors || '1,248'}
          subtitle="98.4% Telemetry Uptime"
          icon={Activity}
          accentColor="cyan"
          change="Online"
          changeType="positive"
          onClick={() => onNavigate('sensors')}
        />
        <KPICard
          title="Affected Roads"
          value={analytics?.kpis.affectedRoads || 18}
          subtitle="NH-13 & SH-5 Blocked"
          icon={Truck}
          accentColor="amber"
          change="BRO Deployed"
          changeType="neutral"
          onClick={() => onNavigate('road-connectivity')}
        />
        <KPICard
          title="Rainfall Risk Index"
          value={`${analytics?.kpis.rainfallRiskIndex || 78}%`}
          subtitle="High Monsoon Flux"
          icon={Droplets}
          accentColor="blue"
          change="Torrential"
          changeType="negative"
          onClick={() => onNavigate('weather')}
        />
        <KPICard
          title="AI Confidence"
          value={`${analytics?.kpis.predictionConfidence || 94.2}%`}
          subtitle="Gradient Boost + Physics"
          icon={Cpu}
          accentColor="emerald"
          change="Calibrated"
          changeType="positive"
          onClick={() => onNavigate('ai-predictions')}
        />
      </div>

      {/* Main Center: Large GIS Map + Active Alerts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: GIS Map Panel */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Live GIS Landslide Vulnerability Map
              </h3>
            </div>
            <button
              onClick={() => onNavigate('live-map')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 hover:underline"
            >
              <span>Expand Map & Layers</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <LeafletMap
            locations={locations}
            sensors={sensors}
            incidents={incidents}
            roads={roads}
            selectedLocation={selectedLoc}
            onSelectLocation={loc => setSelectedLoc(loc)}
            onOpenExplainability={loc => onOpenExplainability(loc)}
            height="500px"
          />
        </div>

        {/* Right: Real-Time Alerts & Urgent Incident Feed */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Emergency Priority Feed
              </h3>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs text-slate-400 hover:text-white font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {alerts.slice(0, 4).map(alt => (
              <div
                key={alt.id}
                className="glass-panel p-3.5 rounded-xl border border-slate-700/70 hover:border-red-500/50 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-400">{alt.id}</span>
                  <RiskBadge level={alt.severity} size="sm" />
                </div>

                <h4 className="text-xs font-bold text-white leading-snug">{alt.title}</h4>
                <p className="text-[11px] text-slate-300 line-clamp-2">{alt.message}</p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                  <span>{alt.location}</span>
                  <button
                    onClick={() => {
                      const loc = locations.find(l => l.district === alt.district) || locations[0];
                      onOpenExplainability(loc);
                    }}
                    className="text-cyan-400 hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <span>Analyze</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row: AI Risk Trend Chart & Sensor Health Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AI Predictive Risk Forecast Chart */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                24-Hour AI Predictive Risk Trend & Precipitation Curve
              </h3>
              <p className="text-xs text-slate-400">
                Composite risk score (0–100) mapped against hourly rainfall intensity
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              NEXT 24 HOURS
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyRiskTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#riskGrad)" name="Risk Score (0-100)" />
                <Area type="monotone" dataKey="rainfall" stroke="#06b6d4" strokeWidth={2} fillOpacity={0.5} fill="url(#rainGrad)" name="Rainfall mm/hr" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State-Wise Risk Distribution & Infrastructure Health */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              State-Wise Vulnerability Distribution
            </h3>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              Full Analytics
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics?.stateRiskDistribution || []}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="state" stroke="#64748b" fontSize={9} interval={0} angle={-20} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="critical" fill="#ef4444" name="Critical" stackId="a" />
                <Bar dataKey="high" fill="#f97316" name="High" stackId="a" />
                <Bar dataKey="moderate" fill="#f59e0b" name="Moderate" stackId="a" />
                <Bar dataKey="low" fill="#10b981" name="Low" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Road & Critical Infrastructure Status Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Critical Lifeline Arteries & Highway Vulnerability
            </h3>
          </div>
          <button
            onClick={() => onNavigate('road-connectivity')}
            className="text-xs text-cyan-400 hover:underline font-semibold"
          >
            View All Road Infrastructure
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Highway / Road Name</th>
                <th className="py-3 px-4">District / State</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Cause / Condition</th>
                <th className="py-3 px-4">Est. Restoration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {roads.slice(0, 4).map(r => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    {r.road_name} <span className="text-cyan-400 font-mono">({r.highway_no})</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{r.district}, {r.state}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
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
                  <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{r.blockage_cause || 'Clear'}</td>
                  <td className="py-3 px-4 font-mono text-cyan-300">{r.estimated_clearance_time || 'Normal'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
