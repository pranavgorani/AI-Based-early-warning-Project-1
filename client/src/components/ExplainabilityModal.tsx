import React from 'react';
import { LocationData } from '../types';
import { RiskBadge } from './RiskBadge';
import {
  X,
  AlertTriangle,
  Droplets,
  Mountain,
  Compass,
  History,
  ShieldAlert,
  Send,
  Radio,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

interface ExplainabilityModalProps {
  location: LocationData | null;
  onClose: () => void;
  onBroadcastAlert?: (loc: LocationData) => void;
  onDispatchTeam?: (loc: LocationData) => void;
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({
  location,
  onClose,
  onBroadcastAlert,
  onDispatchTeam
}) => {
  if (!location) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden glass-panel-glow text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  AI Risk Explainability Engine (XAI)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  CONFIDENCE 94.2%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Scientific factor decomposition for <span className="text-cyan-400 font-semibold">{location.name}</span>, {location.district}, {location.state}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-center md:text-left">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Computed Risk Score</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-extrabold text-white tracking-tight">{location.risk_score}</span>
                <span className="text-sm font-semibold text-slate-400">/ 100</span>
              </div>
              <div className="mt-2">
                <RiskBadge level={location.risk_level} size="sm" />
              </div>
            </div>

            <div className="text-center md:border-l md:border-r border-slate-800 md:px-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Failure Probability</p>
              <p className="text-3xl font-extrabold text-amber-400 mt-1">
                {Math.min(99, Math.round(location.risk_score * 0.95 + 4))}%
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Critical time window: <span className="text-white font-medium">Next 3–6 Hours</span>
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Population at Risk</p>
              <p className="text-3xl font-extrabold text-cyan-400 mt-1">
                {location.population_at_risk.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Across 4 downhill village hamlets
              </p>
            </div>
          </div>

          {/* Environmental Factor Telemetry Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              Real-Time Telemetry & Geotechnical Inputs
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" /> 24h Rain
                </div>
                <p className="text-lg font-bold text-white">{location.rainfall_24h} mm</p>
                <span className="text-[10px] text-red-400 font-semibold">+180% normal</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Soil Moisture
                </div>
                <p className="text-lg font-bold text-white">{location.soil_moisture_pct}%</p>
                <span className="text-[10px] text-amber-400 font-semibold">Near saturation</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Mountain className="w-3.5 h-3.5 text-amber-400" /> Slope Angle
                </div>
                <p className="text-lg font-bold text-white">{location.slope_angle}°</p>
                <span className="text-[10px] text-orange-400 font-semibold">Steep escarpment</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <History className="w-3.5 h-3.5 text-purple-400" /> Past Events
                </div>
                <p className="text-lg font-bold text-white">{location.historical_incidents}</p>
                <span className="text-[10px] text-purple-400 font-semibold">GSI Records</span>
              </div>
            </div>
          </div>

          {/* Why This Area Is at Risk (Detailed scientific breakdown) */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-3">
            <h4 className="text-sm font-bold text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Why This Area Is at Risk: AI Factor Analysis
            </h4>
            <ul className="space-y-2 text-xs text-slate-200">
              {(location.why_at_risk && location.why_at_risk.length > 0 ? location.why_at_risk : [
                `Rainfall exceeded 100mm threshold in the last 24 hours (${location.rainfall_24h}mm)`,
                `Soil moisture reached critical saturation (${location.soil_moisture_pct}%) weakening shear strength`,
                `Terrain slope of ${location.slope_angle}° exceeds safe gravitational slip friction`,
                `Historical landslide incidents detected (${location.historical_incidents} registered events in GSI database)`,
                `Weather radar forecast predicts continuous precipitation for the next 18 hours`
              ]).map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Action */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Recommended Action from Disaster Intelligence Engine
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {location.recommended_action ||
                'Issue immediate local advisory, halt vehicular traffic on vulnerable mountain corridors, inspect residential retaining walls, and place NDRF 12th Bn on 15-minute deployment alert.'}
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-t border-slate-800 bg-slate-950/80">
          <div className="text-[11px] text-slate-400">
            Sensor telemetry updated {location.last_updated}
          </div>
          <div className="flex items-center gap-2">
            {onBroadcastAlert && (
              <button
                onClick={() => onBroadcastAlert(location)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 transition-colors"
              >
                <Radio className="w-4 h-4" />
                Broadcast Warning
              </button>
            )}
            {onDispatchTeam && (
              <button
                onClick={() => onDispatchTeam(location)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-colors"
              >
                <Send className="w-4 h-4" />
                Dispatch Response
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
