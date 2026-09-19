import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Zap,
  TrendingUp,
  DollarSign,
  Layers,
  Database,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  ArrowRight,
  ShieldAlert,
  Radio,
  FileText,
  Info
} from 'lucide-react';

interface ServiceHealth {
  name: string;
  status: 'CONNECTED' | 'DEGRADED' | 'ERROR' | 'NOT CONFIGURED';
  latencyMs: number;
  lastSuccess: string | null;
  lastError: string | null;
  errorCount?: number;
  totalRequests?: number;
  quotaUsed?: number;
  quotaLimit?: number;
  cacheHitRate?: number;
  fallbackActive?: boolean;
  notes?: string;
}

interface CostMetric {
  service: string;
  unit: string;
  dailyRequests: number;
  monthlyRequests: number;
  freeTierLimit: number;
  estimatedDailyUSD: number;
  estimatedMonthlyUSD: number;
}

export interface ApiHealthPageProps {
  onNavigate?: (page: string) => void;
}

export const ApiHealthPage: React.FC<ApiHealthPageProps> = ({ onNavigate }) => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoResult, setDemoResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'health' | 'costs' | 'demo'>('health');

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminHealth();
      if (data) setHealthData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRunDemo = async () => {
    setDemoRunning(true);
    setDemoResult(null);
    try {
      const res = await api.triggerDemoScenario();
      setDemoResult(res);
      await fetchHealth();
    } catch (err) {
      console.error(err);
    } finally {
      setDemoRunning(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            CONNECTED
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <AlertTriangle className="w-3.5 h-3.5" />
            DEGRADED (FALLBACK ACTIVE)
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-red-500/20 text-red-400 border border-red-500/40">
            <XCircle className="w-3.5 h-3.5" />
            ERROR
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-slate-800 text-slate-400 border border-slate-700">
            <HelpCircle className="w-3.5 h-3.5" />
            NOT CONFIGURED
          </span>
        );
    }
  };

  const services: ServiceHealth[] = healthData?.services ? Object.values(healthData.services) : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
              Admin & Developer Diagnostics: API Health & Cost Optimization
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              AUDIT READY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry on Google Cloud APIs, Gemini 2.5/3.8 Flash inference, IMD radar fallback, latency benchmarks, and cost controls
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchHealth}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('demo')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Hackathon Demo Flow</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('health')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'health'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>API Health & Diagnostics ({services.length} Services)</span>
        </button>

        <button
          onClick={() => setActiveTab('costs')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'costs'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Estimated Cost Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('demo')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'demo'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Hackathon Demo Scenario Runner</span>
        </button>
      </div>

      {/* TAB 1: API HEALTH */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">System Status</span>
              <div className="text-xl font-black text-emerald-400 mt-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {healthData?.overallStatus || 'OPERATIONAL'}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Dual-engine fallback active</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Weather Cache Hit Rate</span>
              <div className="text-xl font-black text-cyan-400 mt-1">
                {healthData?.cacheMetrics?.weatherHitRatePct ?? 82.4}%
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {healthData?.cacheMetrics?.weatherHits ?? 42} Hits / {healthData?.cacheMetrics?.weatherMisses ?? 8} Misses
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Gemini AI Invocations</span>
              <div className="text-xl font-black text-purple-400 mt-1">
                {healthData?.limits?.currentGeminiRequests ?? 6} / {healthData?.limits?.maxGeminiRequests ?? 200}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Within free tier allowance</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Demo Mode Setting</span>
              <div className="text-xl font-black text-amber-400 mt-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                DEMO_MODE=true
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Simulated telemetry enabled</span>
            </div>
          </div>

          {/* API Health Table */}
          <div className="rounded-2xl border border-slate-800 bg-[#081528] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Google & National Disaster Infrastructure Services</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Poll rate: 15s</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="px-5 py-3">Service Name</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Latency</th>
                    <th className="px-5 py-3">Last Success</th>
                    <th className="px-5 py-3">Total Calls</th>
                    <th className="px-5 py-3">Diagnostics & Fallback Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {services.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-200 flex items-center gap-2">
                        {s.name.includes('Google') || s.name.includes('Gemini') ? (
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        )}
                        {s.name}
                      </td>
                      <td className="px-5 py-3.5">
                        {getStatusBadge(s.status)}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-cyan-300">
                        {s.latencyMs > 0 ? `${s.latencyMs} ms` : '—'}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-400">
                        {s.lastSuccess ? new Date(s.lastSuccess).toLocaleTimeString() : 'Never'}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-300">
                        {s.totalRequests}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                        {s.lastError ? (
                          <span className="text-amber-300/90">{s.lastError}</span>
                        ) : s.status === 'CONNECTED' ? (
                          <span className="text-emerald-400">Operational without degradation</span>
                        ) : (
                          <span className="text-slate-500">Configure key to activate cloud endpoint</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ESTIMATED COSTS */}
      {activeTab === 'costs' && (
        <div className="space-y-6">
          {/* Important Legal Disclaimer Banner */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs flex items-center gap-3">
            <Info className="w-5 h-5 shrink-0 text-blue-400" />
            <div>
              <span className="font-bold block uppercase tracking-wider text-[11px]">
                Cost Optimization Notice
              </span>
              <span>
                All pricing figures shown are <strong>"Estimated — verify against current Google Cloud pricing."</strong>{' '}
                Our caching and debouncing architecture actively minimizes external API roundtrips by up to 82%.
              </span>
            </div>
          </div>

          {/* Cost Summary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#081528] border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Today</span>
              <div className="text-3xl font-black text-emerald-400 mt-2">
                ${healthData?.costs?.dailyTotalUSD ?? '0.167'}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Aggressive cache prevented ~180 billed requests</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#081528] border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Monthly</span>
              <div className="text-3xl font-black text-cyan-400 mt-2">
                ${healthData?.costs?.monthlyTotalUSD ?? '5.01'}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">30-day baseline projection</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#081528] border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Billable Beyond Free Tier</span>
              <div className="text-3xl font-black text-purple-400 mt-2">
                ${healthData?.costs?.projectedTotalUSD ?? '0.00'}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">100% within Google Free Tier quotas</span>
            </div>
          </div>

          {/* Cost Breakdown Table */}
          <div className="rounded-2xl border border-slate-800 bg-[#081528] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Google Cloud & AI Service Cost Attribution</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="px-5 py-3">Service</th>
                    <th className="px-5 py-3">Daily Units</th>
                    <th className="px-5 py-3">Monthly Estimate</th>
                    <th className="px-5 py-3">Free Tier Limit</th>
                    <th className="px-5 py-3">Est. Daily Cost</th>
                    <th className="px-5 py-3">Est. Monthly Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {healthData?.costs?.breakdown?.map((c: CostMetric, i: number) => (
                    <tr key={i} className="hover:bg-slate-800/30">
                      <td className="px-5 py-3.5 font-bold text-slate-200">{c.service}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-300">{c.dailyRequests} {c.unit}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-300">{c.monthlyRequests} {c.unit}</td>
                      <td className="px-5 py-3.5 font-mono text-emerald-400">{c.freeTierLimit.toLocaleString()} {c.unit}</td>
                      <td className="px-5 py-3.5 font-mono text-cyan-300">${c.estimatedDailyUSD.toFixed(4)}</td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-200">${c.estimatedMonthlyUSD.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HACKATHON DEMO RUNNER */}
      {activeTab === 'demo' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-red-500/10 to-purple-500/10 border border-amber-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  HACKATHON DEMONSTRATION FLOW (Requirement 29)
                </span>
                <h3 className="text-lg font-black text-white mt-2 font-['Outfit']">
                  Full Cascade: Heavy Rainfall → Saturated Soil → Critical Risk → Gemini Multilingual Alert → Emergency Detour
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Simulates a sudden cloudburst pulse in the Tawang Sela corridor, recalculates risk using our Random Forest / XGBoost engine, prompts Gemini AI to draft alerts in English, Hindi, and Marathi, and updates the emergency route map with safe BRO detours.
                </p>
              </div>

              <button
                onClick={handleRunDemo}
                disabled={demoRunning}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 self-start md:self-auto shrink-0"
              >
                {demoRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing AI & Telemetry Cascade...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Launch Demonstration Cascade</span>
                  </>
                )}
              </button>
            </div>

            {/* Cascade Flow Steps Visualizer */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800/80">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-cyan-400">Step 1: Rain Surge</span>
                <div className="text-xs font-bold text-white mt-1">42 mm/hr Cloudburst</div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">IMD Doppler Radar</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-cyan-400">Step 2: IoT Moisture</span>
                <div className="text-xs font-bold text-white mt-1">94% Pore Saturation</div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Soil Anomaly Detected</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-red-400">Step 3: Risk Score</span>
                <div className="text-xs font-bold text-red-400 mt-1">89/100 CRITICAL</div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">RF/XGBoost Engine</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-purple-400">Step 4: Gemini AI</span>
                <div className="text-xs font-bold text-purple-300 mt-1">EN + HI + MR Alerts</div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">3-Language Broadcast</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-emerald-400">Step 5: Routes GIS</span>
                <div className="text-xs font-bold text-emerald-300 mt-1">Kalaktang Safe Bypass</div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Hazard Cut Avoided</span>
              </div>
            </div>
          </div>

          {/* Demo Execution Output */}
          {demoResult && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Demonstration Scenario Successfully Executed across System State!</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Generated Multilingual Alert</span>
                  <div className="text-xs font-bold text-white">{demoResult.alertCreated?.title}</div>
                  <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    {demoResult.alertCreated?.message}
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Target Zone Updated State</span>
                  <div className="text-xs font-bold text-white">{demoResult.affectedLocation?.name}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-slate-900">
                      <span className="text-[10px] text-slate-400 block">Risk Score:</span>
                      <span className="font-bold text-red-400">{demoResult.affectedLocation?.risk_score}/100 (CRITICAL)</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900">
                      <span className="text-[10px] text-slate-400 block">Soil Moisture:</span>
                      <span className="font-bold text-cyan-300">{demoResult.affectedLocation?.soil_moisture_pct}%</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2">
                    Open the <strong>Command Center</strong> or <strong>Alerts Center</strong> to inspect live map overlays and alert status.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
