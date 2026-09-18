import React, { useState, useEffect } from 'react';
import {
  CloudRain,
  Activity,
  Layers,
  Mountain,
  History,
  Users,
  Database,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Eye,
  ArrowRight,
  TrendingUp,
  Cpu,
  Compass,
  Zap,
  Globe,
  Satellite,
  ShieldCheck,
  Thermometer,
  Wind,
  Gauge
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface IoTSensorNode {
  id: string;
  location: string;
  district: string;
  state: string;
  moisture: number; // %
  rainfall: number; // mm/hr
  groundMovement: number; // mm/day
  tiltAngle: number; // degrees
  battery: number; // %
  status: 'Online' | 'Warning' | 'Offline';
  trend: 'rising' | 'steady' | 'falling';
}

export const DataIntegrationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'imd' | 'iot' | 'satellite' | 'dem' | 'history' | 'crowdsource'>('all');
  const [apiSimulated, setApiSimulated] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<'normal' | 'fast' | 'paused'>('normal');

  // Interactive Satellite slider state
  const [satelliteYear, setSatelliteYear] = useState<'2023' | '2026'>('2026');
  const [changeDetectionActive, setChangeDetectionActive] = useState<boolean>(true);
  const [satelliteViewMode, setSatelliteViewMode] = useState<'optical' | 'insar' | 'ndvi'>('insar');

  // Real-time IoT Sensors data with live dynamic simulation
  const [sensorsList, setSensorsList] = useState<IoTSensorNode[]>([
    { id: 'SM-001', location: 'Cherrapunji Escarpment', district: 'East Khasi Hills', state: 'Meghalaya', moisture: 87, rainfall: 42, groundMovement: 8.4, tiltAngle: 4.2, battery: 94, status: 'Online', trend: 'rising' },
    { id: 'SM-002', location: 'Tawang Sela Ridge', district: 'Tawang', state: 'Arunachal Pradesh', moisture: 72, rainfall: 28, groundMovement: 4.1, tiltAngle: 2.8, battery: 88, status: 'Online', trend: 'steady' },
    { id: 'SM-003', location: 'Aizawl Laipuitlang Slope', district: 'Aizawl', state: 'Mizoram', moisture: 91, rainfall: 49, groundMovement: 14.8, tiltAngle: 7.9, battery: 62, status: 'Warning', trend: 'rising' },
    { id: 'SM-004', location: 'Gangtok 9th Mile Hill Cut', district: 'Gangtok', state: 'Sikkim', moisture: 79, rainfall: 33, groundMovement: 6.2, tiltAngle: 3.5, battery: 91, status: 'Online', trend: 'rising' },
    { id: 'SM-005', location: 'Kohima Heritage Ridge', district: 'Kohima', state: 'Nagaland', moisture: 64, rainfall: 18, groundMovement: 2.2, tiltAngle: 1.4, battery: 82, status: 'Online', trend: 'steady' },
    { id: 'SM-006', location: 'Dima Hasao Rail Corridor', district: 'Dima Hasao', state: 'Assam', moisture: 89, rainfall: 52, groundMovement: 12.1, tiltAngle: 6.3, battery: 74, status: 'Warning', trend: 'rising' },
    { id: 'SM-007', location: 'Senapati Hill Highway', district: 'Senapati', state: 'Manipur', moisture: 58, rainfall: 14, groundMovement: 1.8, tiltAngle: 1.1, battery: 89, status: 'Online', trend: 'steady' },
    { id: 'SM-008', location: 'Jampui Hills Pass', district: 'North Tripura', state: 'Tripura', moisture: 46, rainfall: 8, groundMovement: 0.9, tiltAngle: 0.7, battery: 96, status: 'Online', trend: 'steady' }
  ]);

  // Periodic sensor telemetry pulse simulation
  useEffect(() => {
    if (simSpeed === 'paused') return;
    const intervalTime = simSpeed === 'fast' ? 2000 : 4000;

    const interval = setInterval(() => {
      setSensorsList(prev =>
        prev.map(s => {
          if (s.status === 'Offline') return s;
          const deltaM = (Math.random() - 0.45) * 1.5;
          const deltaR = (Math.random() - 0.48) * 2;
          const deltaG = (Math.random() - 0.45) * 0.3;
          const newM = Math.min(99, Math.max(20, Math.round(s.moisture + deltaM)));
          const newR = Math.min(120, Math.max(0, Math.round(s.rainfall + deltaR)));
          const newG = Number(Math.max(0, s.groundMovement + deltaG).toFixed(1));
          const newStatus = newM > 88 || newG > 10 ? 'Warning' : 'Online';
          return {
            ...s,
            moisture: newM,
            rainfall: newR,
            groundMovement: newG,
            status: newStatus,
            trend: deltaM > 0 ? 'rising' : 'falling'
          };
        })
      );
    }, intervalTime);

    return () => clearInterval(interval);
  }, [simSpeed]);

  // Hourly rainfall forecast data (72 Hours)
  const imdForecastData = [
    { hour: '0h (Now)', rainfall: 34, forecast: 34, warning: 'Orange' },
    { hour: '+6h', rainfall: 42, forecast: 45, warning: 'Red' },
    { hour: '+12h', rainfall: 58, forecast: 62, warning: 'Red' },
    { hour: '+18h', rainfall: 48, forecast: 50, warning: 'Orange' },
    { hour: '+24h', rainfall: 38, forecast: 40, warning: 'Orange' },
    { hour: '+36h', rainfall: 24, forecast: 25, warning: 'Yellow' },
    { hour: '+48h', rainfall: 18, forecast: 16, warning: 'Yellow' },
    { hour: '+60h', rainfall: 12, forecast: 10, warning: 'Green' },
    { hour: '+72h', rainfall: 8, forecast: 6, warning: 'Green' }
  ];

  // Historical landslides dataset
  const historicalTrends = [
    { year: '2018', incidents: 142, monsoonRain: 2450 },
    { year: '2019', incidents: 188, monsoonRain: 2890 },
    { year: '2020', incidents: 210, monsoonRain: 3120 },
    { year: '2021', incidents: 175, monsoonRain: 2680 },
    { year: '2022', incidents: 248, monsoonRain: 3450 },
    { year: '2023', incidents: 295, monsoonRain: 3820 },
    { year: '2024', incidents: 260, monsoonRain: 3390 },
    { year: '2025', incidents: 310, monsoonRain: 4050 },
    { year: '2026 (YTD)', incidents: 186, monsoonRain: 2780 }
  ];

  const affectedDistricts = [
    { district: 'East Khasi Hills (ML)', incidents: 312, severity: 'Extreme' },
    { district: 'Tawang (AR)', incidents: 284, severity: 'Critical' },
    { district: 'Gangtok & Mangan (SK)', incidents: 258, severity: 'Critical' },
    { district: 'Dima Hasao (AS)', incidents: 214, severity: 'High' },
    { district: 'Aizawl (MZ)', incidents: 182, severity: 'High' },
    { district: 'Kohima (NL)', incidents: 138, severity: 'Moderate' },
    { district: 'Senapati (MN)', incidents: 92, severity: 'Moderate' }
  ];

  const severityPie = [
    { name: 'Catastrophic / Debris Avalanche', value: 24, color: '#ef4444' },
    { name: 'Major Road Blockage Slide', value: 46, color: '#f97316' },
    { name: 'Rotational Slump', value: 20, color: '#f59e0b' },
    { name: 'Shallow Soil Slip', value: 10, color: '#10b981' }
  ];

  const onlineSensors = sensorsList.filter(s => s.status === 'Online').length;
  const warningSensors = sensorsList.filter(s => s.status === 'Warning').length;
  const offlineSensors = sensorsList.filter(s => s.status === 'Offline').length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400">
              <Database className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
              Data Integration Center
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              PHASE 1 ARCHITECTURE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Centralized multi-source sensory and telemetry ingestion pipeline across 8 North Eastern States
          </p>
        </div>

        {/* Live Simulation Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs">
            <span className="text-slate-400 font-medium">IMD API Status:</span>
            <button
              onClick={() => setApiSimulated(!apiSimulated)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                apiSimulated
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {apiSimulated ? 'Simulated Pipeline' : 'Connected (IMD live)'}
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
            <span className="text-[11px] text-slate-400 px-2">Telemetry:</span>
            <button
              onClick={() => setSimSpeed('normal')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                simSpeed === 'normal' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              1x Live
            </button>
            <button
              onClick={() => setSimSpeed('fast')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                simSpeed === 'fast' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              2x Fast
            </button>
            <button
              onClick={() => setSimSpeed('paused')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                simSpeed === 'paused' ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hold
            </button>
          </div>
        </div>
      </div>

      {/* Six Source Tab Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { id: 'all', label: 'All Ingestion Streams (6 Sources)', icon: Layers },
          { id: 'imd', label: '1. IMD Weather', icon: CloudRain },
          { id: 'iot', label: '2. IoT Soil Moisture', icon: Activity },
          { id: 'satellite', label: '3. Satellite & InSAR', icon: Satellite },
          { id: 'dem', label: '4. Terrain & DEM', icon: Mountain },
          { id: 'history', label: '5. Historical Database', icon: History },
          { id: 'crowdsource', label: '6. Crowdsourced Pipeline', icon: Users }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. IMD WEATHER INTEGRATION MODULE */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'imd') && (
        <section className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <CloudRain className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Source 1: India Meteorological Department (IMD) Ingestion</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    API Status: {apiSimulated ? 'Simulated Pipeline' : 'Connected'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">High-resolution Doppler radar, GPM satellite precipitation & synoptic AWS weather stations</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Next IMD Sync: <strong className="text-cyan-400 font-mono">03m:18s</strong></span>
            </div>
          </div>

          {/* Current IMD Weather Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Current Rainfall</span>
              <p className="text-xl font-black text-cyan-300 font-mono">42.5 <span className="text-xs font-normal text-slate-400">mm</span></p>
              <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> Torrential monsoon
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Hourly Intensity</span>
              <p className="text-xl font-black text-white font-mono">18.2 <span className="text-xs font-normal text-slate-400">mm/hr</span></p>
              <span className="text-[10px] text-amber-400 font-semibold mt-1 block">Exceeds threshold (+4.2)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">24h Cumulative</span>
              <p className="text-xl font-black text-orange-400 font-mono">148.6 <span className="text-xs font-normal text-slate-400">mm</span></p>
              <span className="text-[10px] text-orange-400 font-semibold mt-1 block">Critical infiltration level</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">72h Forecast Sum</span>
              <p className="text-xl font-black text-red-400 font-mono">274.0 <span className="text-xs font-normal text-slate-400">mm</span></p>
              <span className="text-[10px] text-red-400 font-semibold mt-1 block">Extreme event advisory</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Mean Temp / RH</span>
              <p className="text-xl font-black text-emerald-300 font-mono">19.4°C <span className="text-xs font-normal text-slate-400">| 96%</span></p>
              <span className="text-[10px] text-slate-400 mt-1 block">Saturated air mass</span>
            </div>

            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40">
              <span className="text-[10px] font-bold uppercase text-red-400 block mb-1">IMD Bulletin</span>
              <p className="text-base font-black text-white">RED ALERT</p>
              <span className="text-[10px] text-red-300 font-semibold mt-1 block">Meghalaya & Arunachal</span>
            </div>
          </div>

          {/* 72h Forecast Chart */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                72-Hour Precipitation Forecast & Hydrological Flux (IMD Numerical Weather Prediction)
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                RESOLUTION: 3-KM WRF MODEL
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={imdForecastData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="imdRain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} domain={[0, 80]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="forecast" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#imdRain)" name="Projected Rain (mm/hr)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. IOT SOIL MOISTURE & GEOTECHNICAL SENSORS MODULE */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'iot') && (
        <section className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Activity className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Source 2: IoT Geotechnical & Soil Moisture Sensor Telemetry</span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Live dynamic simulation updating every few seconds with real-time subsurface displacement & saturation</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-lg">
                {onlineSensors} Online
              </span>
              <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-lg">
                {warningSensors} Warning Alerts
              </span>
              <span className="text-[11px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-1 rounded-lg">
                {offlineSensors} Offline
              </span>
            </div>
          </div>

          {/* Sensor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {sensorsList.map(sensor => {
              const isWarning = sensor.status === 'Warning';
              return (
                <div
                  key={sensor.id}
                  className={`p-3.5 rounded-xl border transition-all relative overflow-hidden ${
                    isWarning
                      ? 'bg-amber-950/20 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isWarning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
                      {sensor.id}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        isWarning ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {sensor.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white truncate">{sensor.location}</h4>
                  <p className="text-[10px] text-slate-400 mb-3">{sensor.district}, {sensor.state}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-b border-slate-800/80 mb-2 font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">Soil Moisture</span>
                      <strong className={`text-sm ${sensor.moisture > 85 ? 'text-red-400' : 'text-cyan-300'}`}>
                        {sensor.moisture}%
                      </strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">Rainfall</span>
                      <strong className="text-sm text-blue-300">{sensor.rainfall} mm/h</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">Movement</span>
                      <strong className={`text-xs ${sensor.groundMovement > 8 ? 'text-amber-300' : 'text-slate-300'}`}>
                        {sensor.groundMovement} mm/d
                      </strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-sans">Tilt Angle</span>
                      <strong className="text-xs text-orange-300">{sensor.tiltAngle}° tilt</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-slate-500" /> Battery: {sensor.battery}%
                    </span>
                    <span className="text-cyan-400 font-mono text-[9px] animate-pulse">● Live 4s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. SATELLITE IMAGERY & INSAR INTEGRATION MODULE */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'satellite') && (
        <section className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Satellite className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Source 3: Remote Sensing, Satellite Imagery & InSAR Deformation</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    ISRO Bhuvan & Sentinel-1/2 Ready
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Differential SAR Interferometry (D-InSAR), Normalized Difference Vegetation Index (NDVI) & Slope deformation</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSatelliteViewMode('insar')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  satelliteViewMode === 'insar' ? 'bg-purple-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                InSAR Deformation
              </button>
              <button
                onClick={() => setSatelliteViewMode('optical')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  satelliteViewMode === 'optical' ? 'bg-purple-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Optical TrueColor
              </button>
              <button
                onClick={() => setSatelliteViewMode('ndvi')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  satelliteViewMode === 'ndvi' ? 'bg-purple-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Vegetation Loss (NDVI)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Visualizer Panel */}
            <div className="lg:col-span-8 space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-purple-500/30 bg-slate-950 aspect-[16/9] flex items-center justify-center group shadow-xl">
                {/* Simulated High-Res Satellite View Image Background */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')`,
                    filter: satelliteViewMode === 'insar' ? 'hue-rotate(240deg) contrast(1.3)' : satelliteViewMode === 'ndvi' ? 'hue-rotate(90deg) saturate(2)' : 'none'
                  }}
                />

                {/* Satellite HUD Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/30 p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-cyan-300 font-mono text-[11px] border border-cyan-500/30 backdrop-blur-md">
                      PASS: Sentinel-1A Orbit 148 | Sector: Tawang-Sela Locus
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 text-[10px] font-mono border border-purple-400/40 backdrop-blur-md">
                      RESOLUTION: 10m Ground Sample Distance
                    </span>
                  </div>

                  {/* Surface Deformation Fringe Box */}
                  <div className="self-center p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-red-500/60 max-w-sm text-center space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-400 block">
                      ⚠ Active Terrain Deformation Detected
                    </span>
                    <p className="text-xs text-white font-bold">
                      Displacement Rate: <span className="text-red-400 font-mono">-14.2 mm/month</span> (Subsurface Slip)
                    </p>
                    <p className="text-[10px] text-slate-300">
                      Coherence loss identified on western slope flank adjacent to NH-13 corridor.
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Acquisition Date: <strong>18 Sept 2026, 06:42 UTC</strong></span>
                    <span>Algorithm: Multi-Temporal PS-InSAR</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => alert('Opening full-scale high-resolution Sentinel-1 satellite layer')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Satellite Layer</span>
                </button>
                <button
                  onClick={() => setSatelliteYear(satelliteYear === '2026' ? '2023' : '2026')}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Compare Historical Imagery ({satelliteYear === '2026' ? 'Viewing 2026 vs 2023' : 'Viewing Baseline 2023'})</span>
                </button>
                <button
                  onClick={() => setChangeDetectionActive(!changeDetectionActive)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border ${
                    changeDetectionActive
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Detect Terrain Change ({changeDetectionActive ? 'Active' : 'Off'})</span>
                </button>
              </div>
            </div>

            {/* Satellite Analysis Insights Card */}
            <div className="lg:col-span-4 space-y-3">
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/40 space-y-2.5">
                <div className="flex items-center gap-1.5 text-purple-300 text-xs font-bold">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span>Satellite AI Synthetic Insight</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-900/60 p-3 rounded-lg border border-purple-500/20">
                  "Surface deformation detected in a vulnerable slope zone. Continuous geotechnical monitoring and automated threshold alerting recommended."
                </p>
                <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vegetation Loss Index (NDVI):</span>
                    <strong className="text-red-400">-38.4% (Severe Scarring)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Surface Creep Velocity:</span>
                    <strong className="text-amber-300">1.8 mm / day</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Scarp Regolith Stability:</span>
                    <strong className="text-orange-400">Critical Unloading</strong>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Space Agency Interoperability</span>
                <p className="text-[11px] text-slate-300 leading-normal">
                  Architecture conforms to OGC WMS/WFS standards, directly ready to ingest ISRO Bhuvan, Cartosat-3 DEM, and ESA Copernicus Sentinel data feeds via open API endpoints.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. TERRAIN & DEM ANALYSIS MODULE */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'dem') && (
        <section className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Mountain className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Source 4: Digital Elevation Model (DEM) & Geomorphological Analysis</span>
                </h3>
                <p className="text-xs text-slate-400">Cartosat 5-meter DEM topographical derivatives: slope angle, aspect curvature, and roughness</p>
              </div>
            </div>

            <span className="text-xs font-mono text-cyan-300">Target Benchmark: Tawang Sector 42°</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Elevation</span>
              <p className="text-xl font-black text-white font-mono">3,048 <span className="text-xs font-normal text-slate-400">m</span></p>
              <span className="text-[10px] text-cyan-400 font-semibold mt-1 block">High Alpine Ridge</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-orange-500/40">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Slope Angle</span>
              <p className="text-xl font-black text-orange-400 font-mono">42°</p>
              <span className="text-[10px] text-orange-400 font-semibold mt-1 block">Critical slope failure threshold</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Slope Aspect</span>
              <p className="text-xl font-black text-white font-mono">South-West</p>
              <span className="text-[10px] text-slate-400 mt-1 block">214° Windward facing</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Profile Curvature</span>
              <p className="text-xl font-black text-amber-400 font-mono">-0.48 <span className="text-xs font-normal text-slate-400">c/m</span></p>
              <span className="text-[10px] text-amber-400 font-semibold mt-1 block">Convex accelerating flow</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Terrain Roughness</span>
              <p className="text-xl font-black text-white font-mono">0.86 <span className="text-xs font-normal text-slate-400">TRI</span></p>
              <span className="text-[10px] text-slate-400 mt-1 block">Highly dissected gully</span>
            </div>

            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40">
              <span className="text-[10px] font-bold uppercase text-red-400 block mb-1">Soil Bedrock Type</span>
              <p className="text-sm font-black text-white truncate">Fragile Moraine / Gneiss</p>
              <span className="text-[10px] text-red-300 font-semibold mt-1 block">High Friability Risk</span>
            </div>
          </div>

          {/* Terrain Cross-Section Visualization Panel */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-orange-400" />
              Topographical Elevation Profile & Shear Rupture Plane (Cross Section)
            </h4>
            <p className="text-xs text-slate-400">
              Visualizing the hydraulic gradient and failure plane through the weathered gneiss regolith
            </p>

            <div className="h-40 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { dist: '0m (Valley Floor)', elevation: 2200, bedrock: 2180, risk: 'Low' },
                    { dist: '200m', elevation: 2360, bedrock: 2330, risk: 'Low' },
                    { dist: '400m', elevation: 2580, bedrock: 2540, risk: 'Moderate' },
                    { dist: '600m (Highway Level)', elevation: 2840, bedrock: 2790, risk: 'High' },
                    { dist: '800m (Active Scarp)', elevation: 3048, bedrock: 2980, risk: 'Critical' },
                    { dist: '1000m (Ridge Crest)', elevation: 3180, bedrock: 3120, risk: 'Moderate' }
                  ]}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="dist" stroke="#64748b" fontSize={10} />
                  <YAxis domain={[2000, 3400]} stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="elevation" stroke="#f97316" strokeWidth={3} fill="#f97316" fillOpacity={0.2} name="Surface Elevation (m)" />
                  <Area type="monotone" dataKey="bedrock" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" fill="#334155" fillOpacity={0.3} name="Bedrock Shear Plane (m)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. HISTORICAL LANDSLIDE DATABASE & ANALYTICS */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'history') && (
        <section className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <History className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Source 5: Historical Landslide Database (1,480+ Ground Records)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    GSI & MDoNER Archive
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Geospatial incident inventory tracking seasonal frequencies, return periods, and high-impact hotspots</p>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Total Recorded Incidents: <strong className="text-white font-mono">1,482 events</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Year-wise Trend Chart */}
            <div className="lg:col-span-7 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                Year-Wise Landslide Incidents vs. Monsoon Precipitation (2018–2026)
              </h4>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historicalTrends} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="year" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                    <Bar dataKey="incidents" fill="#ef4444" radius={[4, 4, 0, 0]} name="Total Landslide Events" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Severity Distribution Pie */}
            <div className="lg:col-span-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Landslide Failure Mechanics Classification
              </h4>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityPie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                      innerRadius={35}
                      paddingAngle={4}
                    >
                      {severityPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '10px' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Most Affected Districts Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">High-Risk NER District</th>
                  <th className="py-2.5 px-3">Recorded Landslides</th>
                  <th className="py-2.5 px-3">Historical Severity</th>
                  <th className="py-2.5 px-3">Primary Trigger Factors</th>
                  <th className="py-2.5 px-3">Mitigation Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {affectedDistricts.map(item => (
                  <tr key={item.district} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white">{item.district}</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-300 font-bold">{item.incidents}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        item.severity === 'Extreme' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        item.severity === 'Critical' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">Monsoon cloudbursts & steep toe slope cuts</td>
                    <td className="py-2.5 px-3 text-cyan-400 font-bold">Tier-1 Automated EWS</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. CROWDSOURCED & FIELD OFFICER DATA INTEGRATION */}
      {/* ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'crowdsource') && (
        <section className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Users className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Source 6: Crowdsourced Citizen & Field Officer Verification Stream</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Data Pipeline Sync
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Directly synchronized into Incident Management, GIS Map, Risk Analytics, and Emergency Dispatch</p>
              </div>
            </div>

            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Pipeline Active (2-way sync)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">1. Incident Management</span>
              <p className="text-xs text-slate-300 leading-normal">
                Citizen submissions automatically generate unique Incident IDs and enter the verification queue for District Officers.
              </p>
              <span className="text-[10px] text-slate-500 font-mono block">Status: Synced (Instant)</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">2. GIS Real-Time Map</span>
              <p className="text-xs text-slate-300 leading-normal">
                GPS coordinates plot pulsating warning markers on the Leaflet GIS command map with photos and hazard tags.
              </p>
              <span className="text-[10px] text-slate-500 font-mono block">Status: Live Overlay Active</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">3. Risk Scoring Analytics</span>
              <p className="text-xs text-slate-300 leading-normal">
                Clusters of ground crack / slope movement reports dynamically elevate the sector's AI composite risk score.
              </p>
              <span className="text-[10px] text-slate-500 font-mono block">Status: Weight Recalculated</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">4. Emergency Response</span>
              <p className="text-xs text-slate-300 leading-normal">
                Critical reports trigger automated routing alerts to nearest NDRF battalions, SDRF units, and BRO clearance teams.
              </p>
              <span className="text-[10px] text-slate-500 font-mono block">Status: Dispatch SLA: &lt; 2h</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
