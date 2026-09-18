import React from 'react';
import {
  Network,
  Cpu,
  Database,
  Radio,
  Map,
  Shield,
  ArrowDown,
  Layers,
  Server,
  CloudRain,
  Activity,
  Users,
  Code2
} from 'lucide-react';

export const SystemArchitecturePage: React.FC = () => {
  const tiers = [
    {
      tier: 'TIER 1: MULTI-MODAL DATA INGESTION',
      title: 'Heterogeneous Telemetry Sources',
      desc: 'Real-time wireless streams from IMD Doppler Radars, GSI Geological maps, IoT borehole piezometers, tiltmeters, satellite multispectral soil moisture (ISRO Bhuvan), and GPS-stamped citizen reports.',
      icon: Radio,
      items: ['IMD Weather APIs (Doppler)', 'Satellite Imagery & NDVI', 'IoT Telemetry Sensors', 'GSI Historical Landslide Inventory', 'Citizen Crowd Hazard Reports'],
      color: 'border-blue-500/30 bg-blue-500/5 text-blue-400'
    },
    {
      tier: 'TIER 2: PIPELINE & NORMALIZATION LAYER',
      title: 'Geospatial Data Processing Engine',
      desc: 'High-throughput stream processing validating sensor telemetry, noise reduction, DEM (Digital Elevation Model) terrain slope calculations, and spatial polygon geo-fencing.',
      icon: Server,
      items: ['Real-Time Stream Processing', 'DEM Slope Vectorization', 'Outlier Filtering & Quality Control', 'Pore Pressure Conversion'],
      color: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400'
    },
    {
      tier: 'TIER 3: AI/ML PREDICTION & RISK SCORING',
      title: 'Physics-Informed Landslide Model',
      desc: 'Ensemble gradient boosted trees coupled with infinite-slope geotechnical limit equilibrium physics equations calculating dynamic Factor of Safety (FoS) and 0-100 composite risk scores.',
      icon: Cpu,
      items: ['Rainfall Intensity (30% Weight)', 'Soil Moisture Saturation (20%)', 'Slope Angle (20%)', 'Historical Frequency (15%)', 'Terrain Friability (10%)', 'Weather Forecast (5%)'],
      color: 'border-purple-500/30 bg-purple-500/5 text-purple-400'
    },
    {
      tier: 'TIER 4: GIS SPATIAL VISUALIZATION',
      title: 'Interactive Command Center GIS Layer',
      desc: 'Full-featured Leaflet.js geospatial canvas rendering animated risk heat zones across all 8 North Eastern states, telemetry sensor pins, blocked road arteries, and relief centers.',
      icon: Map,
      items: ['8 NE States Hazard Polygons', 'Dynamic Heatmap Circles', 'Lifeline Highway Status Overlays', 'Relief Shelter & Hospital Staging'],
      color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
    },
    {
      tier: 'TIER 5: MULTI-CHANNEL EARLY WARNING (EWS)',
      title: 'Autonomous Alert & Siren Dispatcher',
      desc: 'Sub-second CAP (Common Alerting Protocol) compliant notifications triggered when thresholds are breached, broadcasting localized alerts across telecommunication gateways.',
      icon: Shield,
      items: ['Cell Broadcast & SMS Gateway', 'Automated Physical Hazard Sirens', 'WhatsApp Official Bots', 'District DDMO Push Notifications'],
      color: 'border-red-500/30 bg-red-500/5 text-red-400'
    },
    {
      tier: 'TIER 6: DECISION STAKEHOLDERS',
      title: 'Role-Based Action Units',
      desc: 'Actionable intelligence delivered straight to frontline responders: NDRF rescue battalions, SDRF teams, PWD road clearing squads, district collectors, and hill community citizens.',
      icon: Users,
      items: ['NDRF & SDRF Tactical Commands', 'State & District EOCs', 'Border Roads Organisation (BRO)', 'Local Hill Communities & Citizens'],
      color: 'border-amber-500/30 bg-amber-500/5 text-amber-400'
    }
  ];

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
            System Technical Architecture & Data Pipeline
          </h2>
          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            ENTERPRISE BLUEPRINT
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          End-to-end technical specifications for the AI-Based Early Warning and Landslide Risk Monitoring System (MDoNER)
        </p>
      </div>

      {/* Interactive Tier Stack */}
      <div className="space-y-4">
        {tiers.map((tier, idx) => {
          const Icon = tier.icon;
          return (
            <React.Fragment key={idx}>
              <div className={`glass-panel rounded-2xl p-6 border ${tier.color} shadow-xl relative`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase opacity-80">
                        {tier.tier}
                      </span>
                      <h3 className="text-base font-extrabold text-white mt-0.5">{tier.title}</h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed my-3">{tier.desc}</p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {tier.items.map((item, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-200"
                    >
                      • {item}
                    </span>
                  ))}
                </div>
              </div>

              {idx < tiers.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="p-1 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Database Schema & REST API Endpoints Specification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Schema Overview */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">PostgreSQL / Supabase Schema Design</h3>
          </div>
          <p className="text-slate-400 text-[11px]">Normalized relational models with spatial PostGIS indices:</p>
          <div className="space-y-2 font-mono text-[11px] text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div><strong>• Users:</strong> id, name, email, password_hash, role, district, state</div>
            <div><strong>• Locations:</strong> id, name, geom (Point), elevation, slope, risk_level, score</div>
            <div><strong>• Sensors:</strong> id, sensor_type, location_id, status, battery, reading, threshold</div>
            <div><strong>• Incidents:</strong> id, title, geom, severity, issue_type, images[], status, officer</div>
            <div><strong>• Alerts:</strong> id, title, message, severity, target_users, channels[], status</div>
            <div><strong>• Roads:</strong> id, road_name, highway_no, district, status, alternate_route</div>
          </div>
        </div>

        {/* REST API Endpoints Overview */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Production REST API Specification</h3>
          </div>
          <p className="text-slate-400 text-[11px]">Core Express.js endpoints currently operational:</p>
          <div className="space-y-1.5 font-mono text-[11px] text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-48 overflow-y-auto">
            <div className="text-emerald-400">POST /api/auth/login</div>
            <div className="text-cyan-400">GET  /api/locations</div>
            <div className="text-cyan-400">GET  /api/sensors</div>
            <div className="text-amber-400">POST /api/sensors</div>
            <div className="text-emerald-400">POST /api/predictions (AI Scoring Formula)</div>
            <div className="text-cyan-400">GET  /api/incidents</div>
            <div className="text-amber-400">POST /api/incidents</div>
            <div className="text-cyan-400">GET  /api/alerts</div>
            <div className="text-red-400">POST /api/alerts (Broadcast EWS)</div>
            <div className="text-cyan-400">GET  /api/roads</div>
            <div className="text-cyan-400">GET  /api/analytics/summary</div>
          </div>
        </div>
      </div>
    </div>
  );
};
