import React, { useState } from 'react';
import {
  CloudRain,
  Droplets,
  Wind,
  Thermometer,
  CloudLightning,
  AlertTriangle,
  Compass,
  Radio,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const RainfallWeatherPage: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState('Cherrapunji (Sohra)');

  const stations = [
    { name: 'Cherrapunji (Sohra)', state: 'Meghalaya', currentRain: '38.2 mm/hr', total24h: '195.0 mm', temp: '19°C', humidity: '98%', risk: 'Critical' },
    { name: 'Tawang Pass', state: 'Arunachal Pradesh', currentRain: '34.5 mm/hr', total24h: '142.5 mm', temp: '11°C', humidity: '94%', risk: 'Critical' },
    { name: 'Gangtok 9th Mile', state: 'Sikkim', currentRain: '18.2 mm/hr', total24h: '98.4 mm', temp: '17°C', humidity: '89%', risk: 'High' },
    { name: 'Haflong Hills', state: 'Assam', currentRain: '24.0 mm/hr', total24h: '112.0 mm', temp: '24°C', humidity: '91%', risk: 'High' },
    { name: 'Aizawl Ridge', state: 'Mizoram', currentRain: '14.5 mm/hr', total24h: '84.2 mm', temp: '22°C', humidity: '86%', risk: 'High' },
    { name: 'Kohima Bypass', state: 'Nagaland', currentRain: '10.0 mm/hr', total24h: '52.0 mm', temp: '20°C', humidity: '80%', risk: 'Moderate' },
  ];

  const currentStationData = stations.find(s => s.name === selectedStation) || stations[0];

  const hourlyPrecipitation = [
    { time: '00:00', rain: 12, cumulative: 12 },
    { time: '03:00', rain: 18, cumulative: 30 },
    { time: '06:00', rain: 26, cumulative: 56 },
    { time: '09:00', rain: 35, cumulative: 91 },
    { time: '12:00', rain: 42, cumulative: 133 },
    { time: '15:00', rain: 38, cumulative: 171 },
    { time: '18:00 (Live)', rain: 24, cumulative: 195 },
    { time: '21:00 (Pred)', rain: 28, cumulative: 223 },
    { time: '24:00 (Pred)', rain: 19, cumulative: 242 },
  ];

  const weeklyPrecipitation = [
    { day: 'Mon', actual: 48, normal: 22 },
    { day: 'Tue', actual: 65, normal: 25 },
    { day: 'Wed', actual: 110, normal: 28 },
    { day: 'Thu', actual: 145, normal: 30 },
    { day: 'Fri', actual: 195, normal: 32 },
    { day: 'Sat (Forecast)', actual: 160, normal: 28 },
    { day: 'Sun (Forecast)', actual: 95, normal: 25 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
              Rainfall & Weather Intelligence Dashboard
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              IMD DOPPLER INTEGRATED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time radar telemetry from Indian Meteorological Department (IMD) Mohanbari, Agartala, and Guwahati Radar Stations
          </p>
        </div>

        {/* Station Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Weather Station:</span>
          <select
            value={selectedStation}
            onChange={e => setSelectedStation(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-cyan-300 focus:outline-none focus:border-cyan-500"
          >
            {stations.map(s => (
              <option key={s.name} value={s.name}>{s.name} ({s.state})</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Weather Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Current Rainfall Rate</span>
            <CloudRain className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{currentStationData.currentRain}</p>
          <span className="text-[10px] text-red-400 font-semibold">Cloudburst Threshold: 30mm/hr</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">24-Hr Cumulative Rain</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-cyan-300 mt-2">{currentStationData.total24h}</p>
          <span className="text-[10px] text-orange-400 font-semibold">+220% Normal Average</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Atmospheric Saturation</span>
            <Thermometer className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{currentStationData.humidity}</p>
          <span className="text-[10px] text-slate-400 font-semibold">Temp: {currentStationData.temp} | Dew Point 18°C</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-red-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-red-400 uppercase">Weather Risk Level</span>
            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <p className="text-2xl font-black text-red-400 mt-2">{currentStationData.risk.toUpperCase()}</p>
          <span className="text-[10px] text-red-300 font-semibold">Flash Flood & Debris Slide Warning</span>
        </div>
      </div>

      {/* Hourly Rainfall Chart & Weekly Precipitation Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Precipitation Line Chart */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                24-Hour Hyetograph (Hourly Precipitation & Cumulative mm)
              </h3>
              <p className="text-xs text-slate-400">Recorded by telemetry rain gauge RG-2015</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              IMD LIVE FEED
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyPrecipitation} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="hourlyRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="cumulative" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#hourlyRain)" name="Cumulative Rainfall (mm)" />
                <Area type="monotone" dataKey="rain" stroke="#f43f5e" strokeWidth={2} fillOpacity={0.3} fill="#f43f5e" name="Hourly Intensity (mm/hr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7-Day Precipitation vs Normal Monsoon Baseline */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CloudLightning className="w-4 h-4 text-amber-400" />
                7-Day Rainfall vs Climate Normal
              </h3>
              <p className="text-xs text-slate-400">Actual daily volume compared with 30-year IMD average</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyPrecipitation} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="actual" fill="#06b6d4" name="Recorded Precipitation (mm)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="normal" fill="#475569" name="Normal Monsoon Average (mm)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* IMD Integration Architecture & Live Radar Cards */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              IMD Doppler Radar Stations Across North East India
            </h3>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">ALL 4 RADARS OPERATIONAL</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { name: 'Mohanbari DWR (Dibrugarh)', freq: 'S-Band 2.8 GHz', range: '250 km Radius', status: 'Online', coverage: 'Upper Assam & Arunachal' },
            { name: 'Guwahati DWR (Borjhar)', freq: 'C-Band 5.6 GHz', range: '200 km Radius', status: 'Online', coverage: 'Lower Assam & Meghalaya' },
            { name: 'Agartala DWR (Tripura)', freq: 'S-Band 2.9 GHz', range: '250 km Radius', status: 'Online', coverage: 'Tripura & Southern Mizoram' },
            { name: 'Cherrapunji DWR (Sohra)', freq: 'X-Band 9.3 GHz', range: '120 km High-Res', status: 'Online', coverage: 'Garo & Khasi Hills' },
          ].map((radar, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{radar.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-[11px] text-cyan-300 font-mono">{radar.freq} | {radar.range}</p>
              <p className="text-[10px] text-slate-400">Coverage: {radar.coverage}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
