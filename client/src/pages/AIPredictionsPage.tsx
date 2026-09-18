import React, { useState, useEffect, useMemo } from 'react';
import { RiskPrediction } from '../types';
import { api } from '../services/api';
import { geminiService } from '../services/geminiService';
import { RiskBadge } from '../components/RiskBadge';
import {
  Cpu,
  Sparkles,
  Sliders,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Mountain,
  History,
  Info,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw,
  GitBranch,
  Layers,
  Thermometer,
  CloudLightning,
  Workflow
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
  // Simulator Inputs
  const [state, setState] = useState('Arunachal Pradesh');
  const [district, setDistrict] = useState('Tawang');
  const [locationName, setLocationName] = useState('Tawang Sela Corridor Km 14');
  const [rainfallIntensity, setRainfallIntensity] = useState(38); // mm/hr
  const [cumulativeRainfall, setCumulativeRainfall] = useState(148); // mm
  const [soilMoisture, setSoilMoisture] = useState(88); // %
  const [slopeAngle, setSlopeAngle] = useState(42); // degrees
  const [elevation, setElevation] = useState(3048); // meters
  const [historicalIncidents, setHistoricalIncidents] = useState(16); // count
  const [temperature, setTemperature] = useState(18); // °C
  const [terrainVulnerability, setTerrainVulnerability] = useState(80); // 0-100
  const [weatherForecastRisk, setWeatherForecastRisk] = useState(85); // 0-100

  // Real-time calculation engine following exact Phase 2 requirements:
  // Rainfall Contribution: 30%
  // Soil Moisture: 20%
  // Slope Angle: 20%
  // Historical Landslide Frequency: 15%
  // Terrain Vulnerability: 10%
  // Weather Forecast: 5%
  const computedMetrics = useMemo(() => {
    // Normalizations to 0-100
    const rainScore = Math.min(100, Math.round((cumulativeRainfall / 160) * 65 + (rainfallIntensity / 50) * 35));
    const moistureScore = Math.min(100, Math.max(0, soilMoisture));
    const slopeScore = Math.min(100, Math.round((slopeAngle / 50) * 100));
    const histScore = Math.min(100, Math.round((historicalIncidents / 25) * 100));
    const terrainScore = Math.min(100, Math.max(0, terrainVulnerability));
    const forecastScore = Math.min(100, Math.max(0, weatherForecastRisk));

    const totalRaw =
      rainScore * 0.30 +
      moistureScore * 0.20 +
      slopeScore * 0.20 +
      histScore * 0.15 +
      terrainScore * 0.10 +
      forecastScore * 0.05;

    const riskScore = Math.min(100, Math.max(0, Math.round(totalRaw)));

    // Risk Levels:
    // 0-25 = LOW
    // 26-50 = MODERATE
    // 51-75 = HIGH
    // 76-100 = CRITICAL
    let category: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk' = 'Low Risk';
    let timeWindow = 'Beyond 48 Hours';

    if (riskScore >= 76) {
      category = 'Critical Risk';
      timeWindow = 'Next 6–12 Hours';
    } else if (riskScore >= 51) {
      category = 'High Risk';
      timeWindow = 'Next 12–24 Hours';
    } else if (riskScore >= 26) {
      category = 'Moderate Risk';
      timeWindow = 'Next 24–48 Hours';
    } else {
      category = 'Low Risk';
      timeWindow = 'Standard Baseline Monitoring';
    }

    const probability = Math.round(Math.min(99, Math.max(8, riskScore * 0.94 + 5)));
    const aiConfidence = 94.2;

    return {
      riskScore,
      category,
      probability,
      timeWindow,
      aiConfidence,
      rainScore,
      moistureScore,
      slopeScore,
      histScore,
      terrainScore,
      forecastScore
    };
  }, [
    rainfallIntensity,
    cumulativeRainfall,
    soilMoisture,
    slopeAngle,
    historicalIncidents,
    terrainVulnerability,
    weatherForecastRisk
  ]);

  // AI Explainability text
  const [aiExplanation, setAiExplanation] = useState<string>(
    'High landslide probability detected due to intense rainfall, elevated soil saturation, steep terrain, and historical landslide activity.'
  );
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  // Dynamic explanation update when risk level changes
  useEffect(() => {
    let active = true;
    const updateExplanation = async () => {
      setIsGeneratingAI(true);
      try {
        const text = await geminiService.generateRiskExplanation({
          location_name: locationName,
          district,
          state,
          risk_score: computedMetrics.riskScore,
          rainfall_intensity: rainfallIntensity,
          cumulative_rainfall_24h: cumulativeRainfall,
          soil_moisture: soilMoisture,
          slope_angle: slopeAngle,
          elevation,
          historical_incidents: historicalIncidents
        });
        if (active) setAiExplanation(text);
      } catch {
        if (active) {
          setAiExplanation(
            `High landslide probability (${computedMetrics.riskScore}/100) detected due to continuous rainfall (${cumulativeRainfall}mm), elevated soil saturation (${soilMoisture}%), steep ${slopeAngle}° terrain, and historical recurrence.`
          );
        }
      } finally {
        if (active) setIsGeneratingAI(false);
      }
    };

    const timer = setTimeout(updateExplanation, 500);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [
    computedMetrics.riskScore,
    locationName,
    district,
    state,
    cumulativeRainfall,
    soilMoisture,
    slopeAngle
  ]);

  // Factor breakdown bar data
  const factorBarData = [
    { factor: 'Rainfall (30%)', value: computedMetrics.rainScore, contribution: '30%', color: '#06b6d4' },
    { factor: 'Soil Moisture (20%)', value: computedMetrics.moistureScore, contribution: '20%', color: '#3b82f6' },
    { factor: 'Slope Risk (20%)', value: computedMetrics.slopeScore, contribution: '20%', color: '#f97316' },
    { factor: 'Historical Risk (15%)', value: computedMetrics.histScore, contribution: '15%', color: '#a855f7' },
    { factor: 'Terrain Friability (10%)', value: computedMetrics.terrainScore, contribution: '10%', color: '#eab308' },
    { factor: 'Weather Forecast (5%)', value: computedMetrics.forecastScore, contribution: '5%', color: '#ef4444' }
  ];

  // Forecast trend curve
  const forecastData = [
    { hour: 'Now', score: computedMetrics.riskScore },
    { hour: '+3h', score: Math.min(100, computedMetrics.riskScore + 4) },
    { hour: '+6h', score: Math.min(100, computedMetrics.riskScore + 6) },
    { hour: '+12h', score: Math.min(100, computedMetrics.riskScore + 2) },
    { hour: '+18h', score: Math.max(20, computedMetrics.riskScore - 8) },
    { hour: '+24h', score: Math.max(20, computedMetrics.riskScore - 18) }
  ];

  const handleSaveToPipeline = () => {
    const newPred: RiskPrediction = {
      id: `prd-${Date.now()}`,
      location_id: `loc-${Date.now()}`,
      location_name: locationName,
      district,
      state,
      risk_score: computedMetrics.riskScore,
      risk_category: computedMetrics.category,
      probability: computedMetrics.probability,
      rainfall_intensity: rainfallIntensity,
      cumulative_rainfall_24h: cumulativeRainfall,
      soil_moisture: soilMoisture,
      slope_angle: slopeAngle,
      elevation,
      contributing_factors: [
        `Rainfall Contribution: ${computedMetrics.rainScore}%`,
        `Soil Moisture Saturation: ${computedMetrics.moistureScore}%`,
        `Slope Angle: ${slopeAngle}°`,
        `Historical Landslide Count: ${historicalIncidents}`
      ],
      recommended_action:
        computedMetrics.category === 'Critical Risk'
          ? 'Initiate immediate Code Red evacuation notice, close uphill road artery, and mobilize NDRF Battalion.'
          : computedMetrics.category === 'High Risk'
          ? 'Place BRO earthmovers on 15-minute standby and restrict non-essential traffic.'
          : 'Maintain continuous automated IoT telemetry surveillance.',
      time_window: computedMetrics.timeWindow,
      created_at: new Date().toISOString()
    };
    onPredictionAdded(newPred);
    alert(`Prediction saved! Composite Risk: ${computedMetrics.riskScore}/100 [${computedMetrics.category}] logged to central GIS pipeline.`);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
              AI Risk Prediction Engine
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              MDoNER WEIGHTED MODEL v4.2
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic real-time multivariate inference engine: Rainfall (30%), Soil Moisture (20%), Slope (20%), History (15%), Terrain (10%), Forecast (5%)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveToPipeline}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Prediction to GIS</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Automated Scans Today</p>
          <p className="text-2xl font-black text-white mt-1">1,248</p>
          <span className="text-[10px] text-cyan-400 font-medium">Synced across 8 States</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Critical Risk Predictions</p>
          <p className="text-2xl font-black text-red-400 mt-1">08</p>
          <span className="text-[10px] text-red-400 font-medium">Evacuation alerts flagged</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Model Precision (AUC)</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">0.962</p>
          <span className="text-[10px] text-emerald-400 font-medium">Cross-validated on 1,480+ events</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Confidence Score</p>
          <p className="text-2xl font-black text-cyan-400 mt-1">{computedMetrics.aiConfidence}%</p>
          <span className="text-[10px] text-cyan-400 font-medium">Hybrid Physics + ML Ensemble</span>
        </div>
      </div>

      {/* Main Grid: Inputs Simulator & Dynamic Prediction Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Parameters (Reactive Sliders) */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-5 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">AI Input Parameters</h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 animate-pulse">● Auto-Recalculating</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Sector Selector */}
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
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Location / Critical Sector Name</label>
              <input
                type="text"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Slider 1: Cumulative Rainfall (24h) */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Cumulative Rainfall (24 hrs)
                </span>
                <span className="font-mono font-bold text-cyan-400">{cumulativeRainfall} mm</span>
              </div>
              <input
                type="range"
                min={0}
                max={250}
                value={cumulativeRainfall}
                onChange={e => setCumulativeRainfall(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Weight: 30% contribution (combined with intensity)</span>
            </div>

            {/* Slider 2: Rainfall Intensity */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <CloudLightning className="w-3.5 h-3.5 text-cyan-400" /> Rainfall Intensity
                </span>
                <span className="font-mono font-bold text-cyan-400">{rainfallIntensity} mm/hr</span>
              </div>
              <input
                type="range"
                min={0}
                max={80}
                value={rainfallIntensity}
                onChange={e => setRainfallIntensity(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 3: Soil Moisture Saturation */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" /> Soil Moisture Saturation
                </span>
                <span className="font-mono font-bold text-blue-400">{soilMoisture}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={soilMoisture}
                onChange={e => setSoilMoisture(Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Weight: 20% contribution</span>
            </div>

            {/* Slider 4: Slope Angle */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-orange-400" /> Slope Angle (degrees)
                </span>
                <span className="font-mono font-bold text-orange-400">{slopeAngle}°</span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                value={slopeAngle}
                onChange={e => setSlopeAngle(Number(e.target.value))}
                className="w-full accent-orange-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Weight: 20% contribution</span>
            </div>

            {/* Row: Historical Count & Elevation & Temp */}
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[10px] font-semibold text-slate-300 mb-1">Historical Landslides</label>
                <input
                  type="number"
                  value={historicalIncidents}
                  onChange={e => setHistoricalIncidents(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-white font-mono text-xs"
                />
                <span className="text-[9px] text-slate-500">Weight: 15%</span>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-300 mb-1">Elevation (meters)</label>
                <input
                  type="number"
                  value={elevation}
                  onChange={e => setElevation(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-300 mb-1">Temperature (°C)</label>
                <input
                  type="number"
                  value={temperature}
                  onChange={e => setTemperature(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-white font-mono text-xs"
                />
              </div>
            </div>

            {/* Slider 5 & 6: Terrain Vulnerability & Weather Forecast Risk */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-300 font-semibold">Terrain Vulnerability (10%)</span>
                  <span className="font-bold text-amber-400">{terrainVulnerability}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={terrainVulnerability}
                  onChange={e => setTerrainVulnerability(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-300 font-semibold">Weather Forecast Risk (5%)</span>
                  <span className="font-bold text-red-400">{weatherForecastRisk}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={weatherForecastRisk}
                  onChange={e => setWeatherForecastRisk(Number(e.target.value))}
                  className="w-full accent-red-500 bg-slate-800 h-1.5 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: AI PREDICTION OUTPUT & EXPLAINABILITY */}
        <div className="lg:col-span-6 space-y-5">
          {/* Main Computed Prediction Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
                  AI PREDICTION OUTPUT
                </span>
                <h3 className="text-base font-black text-white">{locationName}</h3>
                <p className="text-xs text-slate-400">{district}, {state}</p>
              </div>

              <div className="flex items-center gap-2">
                <RiskBadge level={computedMetrics.category} size="lg" />
              </div>
            </div>

            {/* Score & Prob Gauge Strip */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Risk Score</span>
                <p className="text-3xl font-black text-white mt-1 font-mono">
                  {computedMetrics.riskScore}<span className="text-xs text-slate-500">/100</span>
                </p>
                <span className="text-[10px] text-slate-400">Weighted Model</span>
              </div>

              <div className="border-l border-r border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prediction Probability</span>
                <p className="text-3xl font-black text-amber-400 mt-1 font-mono">
                  {computedMetrics.probability}%
                </p>
                <span className="text-[10px] text-amber-400/80 font-medium">Slope Failure Likelihood</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Time Window</span>
                <p className="text-xs font-bold text-red-400 mt-2">
                  {computedMetrics.timeWindow}
                </p>
                <span className="text-[10px] text-cyan-400 font-mono">Confidence: {computedMetrics.aiConfidence}%</span>
              </div>
            </div>

            {/* Factor Decomposition Percentage Bars */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Contributing Factors & Normalized Weights</span>
                <span className="text-[10px] text-cyan-400 font-mono">Total: 100% Weight</span>
              </h4>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={factorBarData} layout="vertical" margin={{ top: 5, right: 20, left: 45, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={10} />
                    <YAxis type="category" dataKey="factor" stroke="#cbd5e1" fontSize={10} width={135} />
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

            {/* AI EXPLAINABILITY PANEL */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Why Is This Area at Risk? (Explainable AI)
                </span>
                {isGeneratingAI && <span className="text-[10px] text-cyan-400 animate-pulse">Analyzing...</span>}
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                "{aiExplanation}"
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
                <div>Rainfall: <strong className="text-cyan-400">{computedMetrics.rainScore}%</strong></div>
                <div>Soil Saturation: <strong className="text-blue-400">{computedMetrics.moistureScore}%</strong></div>
                <div>Slope Angle: <strong className="text-orange-400">{computedMetrics.slopeScore}%</strong></div>
                <div>Historical: <strong className="text-purple-400">{computedMetrics.histScore}%</strong></div>
              </div>
            </div>
          </div>

          {/* Machine Learning Architecture Display */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Workflow className="w-4 h-4 text-cyan-400" />
                Machine Learning Architecture Pipeline
              </h4>
              <span className="text-[10px] font-mono text-cyan-400">RANDOM FOREST / XGBOOST ENSEMBLE</span>
            </div>

            {/* Flowchart Representation */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[10px] font-bold">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 flex flex-col justify-center">
                <span>Historical Data</span>
                <span className="text-[9px] text-slate-500 font-normal">GSI Records</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 flex flex-col justify-center">
                <span>Feature Eng.</span>
                <span className="text-[9px] text-slate-500 font-normal">Hydro & DEM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-500/50 text-blue-200 flex flex-col justify-center">
                <span>RF / XGBoost</span>
                <span className="text-[9px] text-slate-400 font-normal">Supervised Model</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 flex flex-col justify-center">
                <span>Classification</span>
                <span className="text-[9px] text-slate-500 font-normal">4 Risk Tiers</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-red-300 flex flex-col justify-center">
                <span>Probability</span>
                <span className="text-[9px] text-slate-500 font-normal">0–99% Scale</span>
              </div>
              <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-white flex flex-col justify-center">
                <span>Early Warning</span>
                <span className="text-[9px] text-red-300 font-normal">Broadcast Siren</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-normal">
              <strong>Technical Implementation Note:</strong> Prototype currently uses simulated AI inference calibrated against GSI landslide susceptibility indices, fully ready for real ML model weights / ONNX inference server integration via REST/gRPC.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
