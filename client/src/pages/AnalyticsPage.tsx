import React, { useState } from 'react';
import { AnalyticsSummary } from '../types';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  Filter,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  ArrowDownToLine
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

interface AnalyticsPageProps {
  analytics: AnalyticsSummary | null;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ analytics }) => {
  const [dateRange, setDateRange] = useState('Past Monsoon Season (2026)');
  const [selectedState, setSelectedState] = useState('All States');
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        'State,LowRisk,ModerateRisk,HighRisk,CriticalRisk\n' +
        (analytics?.stateRiskDistribution || [])
          .map(r => `${r.state},${r.low},${r.moderate},${r.high},${r.critical}`)
          .join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'NER_WATCH_Landslide_Analytics_Report_2026.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setExportMessage('CSV dataset exported successfully!');
      setTimeout(() => setExportMessage(null), 3000);
    }, 600);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const responseTimeData = [
    { district: 'Tawang', ndrf: 25, roadClearance: 180, verification: 8 },
    { district: 'Sohra', ndrf: 15, roadClearance: 120, verification: 5 },
    { district: 'Gangtok', ndrf: 20, roadClearance: 150, verification: 7 },
    { district: 'Haflong', ndrf: 40, roadClearance: 320, verification: 12 },
    { district: 'Aizawl', ndrf: 30, roadClearance: 210, verification: 9 },
    { district: 'Kohima', ndrf: 22, roadClearance: 160, verification: 6 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
              Regional Geotechnical Analytics & Decision Reports
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              BIG DATA AI SYNTHESIS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Longitudinal trend modeling, rainfall-pore pressure correlation, and emergency operational performance benchmarks
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Generate Executive PDF</span>
          </button>
        </div>
      </div>

      {exportMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-fadeIn">
          {exportMessage}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-300">Observation Window:</span>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-white font-medium focus:outline-none"
          >
            <option>Past Monsoon Season (2026)</option>
            <option>Last 30 Days (Active Rain)</option>
            <option>Year-to-Date 2026</option>
            <option>5-Year Climate Baseline (2021-2026)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">State Filter:</span>
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-white font-medium focus:outline-none"
          >
            <option>All States</option>
            <option>Arunachal Pradesh</option>
            <option>Assam</option>
            <option>Meghalaya</option>
            <option>Sikkim</option>
            <option>Mizoram</option>
            <option>Nagaland</option>
            <option>Manipur</option>
            <option>Tripura</option>
          </select>
        </div>
      </div>

      {/* Row 1: Monthly Incidents Trend & State-Wise Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Incidents vs Rainfall Average */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Monthly Registered Landslide Events vs Mean Precipitation
            </h3>
            <span className="text-[10px] font-mono text-cyan-300">2026 MONSOON CYCLE</span>
          </div>
          <p className="text-xs text-slate-400">
            Peak landslide frequency correlates directly with cumulative precipitation over 450mm
          </p>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.monthlyIncidents || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="incidents" fill="#ef4444" name="Landslide Incidents Count" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rainfall_avg" fill="#06b6d4" name="Mean Rainfall (mm)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State-Wise Risk Distribution */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              State-Level Risk Stratification
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Arunachal, Sikkim, and Meghalaya exhibit highest proportion of Critical/High zones
          </p>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics?.stateRiskDistribution || []}
                layout="vertical"
                margin={{ top: 5, right: 15, left: 35, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={10} />
                <YAxis type="category" dataKey="state" stroke="#cbd5e1" fontSize={10} width={90} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="critical" fill="#ef4444" name="Critical" stackId="a" />
                <Bar dataKey="high" fill="#f97316" name="High" stackId="a" />
                <Bar dataKey="moderate" fill="#f59e0b" name="Moderate" stackId="a" />
                <Bar dataKey="low" fill="#10b981" name="Low" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Rainfall vs Landslide Scatter Correlation & Emergency Response Times */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rainfall Intensity vs Incident Correlation Scatter */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              Pore-Water Saturation vs Incident Trigger Scatter
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">R² = 0.912</span>
          </div>
          <p className="text-xs text-slate-400">
            Regression line reveals slope structural failure probability accelerates exponentially once soil moisture exceeds 75%
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.rainfallVsLandslideCorrelation || []} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="rainfall" name="Rainfall (mm)" stroke="#64748b" fontSize={11} label={{ value: 'Rainfall (mm)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={3} name="Triggered Incidents" />
                <Line type="monotone" dataKey="soil_moisture" stroke="#38bdf8" strokeWidth={2} name="Soil Moisture %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Emergency Response Times */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              District Operational Response Times (Minutes)
            </h3>
            <span className="text-[10px] font-mono text-cyan-300">NDRF / BRO LOGS</span>
          </div>
          <p className="text-xs text-slate-400">
            Mean verification time: 8 mins | NDRF Staging ETA: 24 mins | Heavy clearance: 190 mins
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="district" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="verification" fill="#38bdf8" name="AI Verification (Mins)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="ndrf" fill="#f59e0b" name="NDRF Team ETA (Mins)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="roadClearance" fill="#ef4444" name="Road Clearance (Mins)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
