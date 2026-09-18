import React, { useState } from 'react';
import { RiskPrediction } from '../types';
import { api } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import {
  Cpu,
  Sparkles,
  Sliders,
  Play,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Droplets,
  Mountain,
  History,
  Info,
  ShieldCheck,
  Zap
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface AIPredictionsPageProps {
  predictions: RiskPrediction[];
  onPredictionAdded: (pred: RiskPrediction) => void;
}

export const AIPredictionsPage: React.FC<AIPredictionsPageProps> = ({
  predictions,
  onPredictionAdded
}) => {
  // Simulator Form State
  const [state, setState] = useState('Arunachal Pradesh');
  const [district, setDistrict] = useState('Tawang');
  const [locationName, setLocationName] = useState('Tawang Sela Corridor Km 14');
  const [rainfallIntensity, setRainfallIntensity] = useState(35);
  const [cumulativeRainfall, setCumulativeRainfall] = useState(140);
  const [soilMoisture, setSoilMoisture] = useState(88);
  const [slopeAngle, setSlopeAngle] = useState(42);
  const [elevation, setElevation] = useState(2850);
  const [historicalIncidents, setHistoricalIncidents] = useState(14);
  const [isCalculating, setIsCalculating] = useState(false);

  // Latest calculated output
  const [activeResult, setActiveResult] = useState<RiskPrediction | null>(
    predictions[0] || null
  );

  const forecastData = [
    { hour: 'Now', score: activeResult?.risk_score || 89 },
    { hour: '+3h', score: Math.min(100, (activeResult?.risk_score || 89) + 3) },
    { hour: '+6h', score: Math.min(100, (activeResult?.risk_score || 89) + 5) },
    { hour: '+9h', score: Math.min(100, (activeResult?.risk_score || 89) + 2) },
    { hour: '+12h', score: Math.max(20, (activeResult?.risk_score || 89) - 4) },
    { hour: '+18h', score: Math.max(20, (activeResult?.risk_score || 89) - 12) },
    { hour: '+24h', score: Math.max(20, (activeResult?.risk_score || 89) - 20) },
  ];

  const factorBarData = [
    { factor: 'Rainfall (30%)', value: Math.min(100, (cumulativeRainfall / 150) * 100), color: '#06b6d4' },
    { factor: 'Soil Saturation (20%)', value: soilMoisture, color: '#3b82f6' },
    { factor: 'Slope Stability (20%)', value: Math.min(100, (slopeAngle / 45) * 100), color: '#f97316' },
    { factor: 'Historical Risk (15%)', value: Math.min(100, (historicalIncidents / 20) * 100), color: '#a855f7' },
    { factor: 'Terrain Friability (10%)', value: 75, color: '#eab308' },
    { factor: 'Weather Forecast (5%)', value: 85, color: '#ef4444' },
  ];

  const handleRunPrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    try {
      const pred = await api.runPrediction({
        state,
        district,
        location_name: locationName,
        rainfall_intensity: rainfallIntensity,
        cumulative_rainfall_24h: cumulativeRainfall,
        soil_moisture: soilMoisture,
        slope_angle: slopeAngle,
        elevation,
        historical_incidents: historicalIncidents
      });
      setActiveResult(pred);
      onPredictionAdded(pred);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
            AI Risk Prediction Engine
          </h2>
          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            MDoNER ALGORITHM v3.4
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Physics-informed multi-variate machine learning model fusing hydrometeorological and geotechnical telemetry
        </p>
      </div>

      {/* Prediction Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Predictions Today</p>
          <p className="text-2xl font-black text-white mt-1">428</p>
          <span className="text-[10px] text-cyan-400 font-medium">Automated sensor scans</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">High-Risk Predictions</p>
          <p className="text-2xl font-black text-orange-400 mt-1">19</p>
          <span className="text-[10px] text-orange-400 font-medium">Slope movement alerts</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Critical Predictions</p>
          <p className="text-2xl font-black text-red-400 mt-1">05</p>
          <span className="text-[10px] text-red-400 font-medium">Red alert advisories</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Accuracy Rate</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">94.2%</p>
          <span className="text-[10px] text-emerald-400 font-medium">Verified against GSI logs</span>
        </div>
      </div>

      {/* Interactive Prediction Simulator + Active Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Run AI Prediction */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-cyan-500/30 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Predict New Location</h3>
              <p className="text-[11px] text-slate-400">Simulate parameters to compute immediate risk score</p>
            </div>
          </div>

          <form onSubmit={handleRunPrediction} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">State</label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option>Arunachal Pradesh</option>
                  <option>Assam</option>
                  <option>Manipur</option>
                  <option>Meghalaya</option>
                  <option>Mizoram</option>
                  <option>Nagaland</option>
                  <option>Sikkim</option>
                  <option>Tripura</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Specific Sector / Landmark</label>
              <input
                type="text"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Slider: 24h Cumulative Rainfall */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300 font-semibold">24h Cumulative Rainfall</span>
                <span className="font-bold text-cyan-400">{cumulativeRainfall} mm</span>
              </div>
              <input
                type="range"
                min={0}
                max={250}
                value={cumulativeRainfall}
                onChange={e => setCumulativeRainfall(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800"
              />
            </div>

            {/* Slider: Rainfall Intensity */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300 font-semibold">Rainfall Intensity</span>
                <span className="font-bold text-cyan-400">{rainfallIntensity} mm/hr</span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                value={rainfallIntensity}
                onChange={e => setRainfallIntensity(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800"
              />
            </div>

            {/* Slider: Soil Moisture Saturation */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300 font-semibold">Soil Moisture Saturation</span>
                <span className="font-bold text-blue-400">{soilMoisture}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={soilMoisture}
                onChange={e => setSoilMoisture(Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800"
              />
            </div>

            {/* Slider: Slope Angle */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300 font-semibold">Terrain Slope Angle</span>
                <span className="font-bold text-orange-400">{slopeAngle}°</span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                value={slopeAngle}
                onChange={e => setSlopeAngle(Number(e.target.value))}
                className="w-full accent-orange-500 bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Elevation (m)</label>
                <input
                  type="number"
                  value={elevation}
                  onChange={e => setElevation(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Historical Incidents</label>
                <input
                  type="number"
                  value={historicalIncidents}
                  onChange={e => setHistoricalIncidents(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCalculating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 mt-3"
            >
              <Zap className="w-4 h-4" />
              <span>{isCalculating ? 'Computing Scientific Weights...' : 'Run AI Prediction Model'}</span>
            </button>
          </form>
        </div>

        {/* Right Panel: Calculated Result & Factor Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          {activeResult && (
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-5">
              {/* Top Result Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    COMPUTED PREDICTION RESULT
                  </span>
                  <h3 className="text-lg font-black text-white">{activeResult.location_name}</h3>
                  <p className="text-xs text-slate-400">{activeResult.district}, {activeResult.state}</p>
                </div>
                <RiskBadge level={activeResult.risk_category} size="lg" />
              </div>

              {/* Score & Prob Gauge */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Composite Risk</span>
                  <p className="text-3xl font-black text-white mt-1">{activeResult.risk_score}/100</p>
                </div>
                <div className="border-l border-r border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Failure Probability</span>
                  <p className="text-3xl font-black text-amber-400 mt-1">{activeResult.probability}%</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Time Window</span>
                  <p className="text-sm font-bold text-red-400 mt-2">{activeResult.time_window}</p>
                </div>
              </div>

              {/* Contributing Factors Bar Chart */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Environmental Factor Weight Decomposition
                </h4>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={factorBarData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={10} />
                      <YAxis type="category" dataKey="factor" stroke="#cbd5e1" fontSize={10} width={130} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {factorBarData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Explainable AI Panel */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI Explanation & Scientific Rationale</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "High landslide probability detected due to continuous rainfall exceeding threshold levels
                  combined with elevated soil moisture saturation ({soilMoisture}%) and steep terrain conditions ({slopeAngle}°).
                  The geotechnical shear resistance along the bedding plane is significantly reduced."
                </p>
              </div>

              {/* Recommended Action */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  PREVENTIVE PROTOCOL
                </span>
                <p className="text-xs text-slate-200 font-medium">
                  {activeResult.recommended_action}
                </p>
              </div>
            </div>
          )}

          {/* 24-Hour Risk Forecast Line Chart */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Projected 24-Hour Slope Stability Curve
            </h4>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="score" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} name="Predicted Risk Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
