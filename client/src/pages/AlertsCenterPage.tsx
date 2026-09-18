import React, { useState } from 'react';
import { Alert, AlertSeverity } from '../types';
import { api } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import {
  Bell,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Mail,
  MessageSquare,
  Volume2,
  Send,
  Filter,
  CheckCheck,
  Search,
  Clock,
  Zap,
  ShieldAlert,
  Droplets,
  Activity,
  Users,
  Compass
} from 'lucide-react';

interface AlertsCenterPageProps {
  alerts: Alert[];
  onAlertUpdated: (alert: Alert) => void;
  onOpenBroadcast: () => void;
}

export const AlertsCenterPage: React.FC<AlertsCenterPageProps> = ({
  alerts,
  onAlertUpdated,
  onOpenBroadcast
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [search, setSearch] = useState('');
  const [activeTriggerNotice, setActiveTriggerNotice] = useState<string | null>(null);

  const filteredAlerts = alerts.filter(a => {
    const matchesSeverity = selectedSeverity === 'All' || a.severity === selectedSeverity;
    const matchesSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.location.toLowerCase().includes(search.toLowerCase()) ||
      a.message.toLowerCase().includes(search.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleMarkRead = async (alt: Alert) => {
    try {
      const updated = await api.updateAlert(alt.id, { status: 'Acknowledged' });
      onAlertUpdated(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    for (const alt of alerts.filter(a => a.status === 'Active')) {
      try {
        const updated = await api.updateAlert(alt.id, { status: 'Acknowledged' });
        onAlertUpdated(updated);
      } catch (e) {}
    }
  };

  // Automated Threshold Trigger Handler
  const handleSimulateTrigger = async (triggerType: 'risk' | 'rainfall' | 'moisture' | 'movement' | 'crowdsource') => {
    let newAlertData: Partial<Alert> = {};

    if (triggerType === 'risk') {
      newAlertData = {
        title: 'AUTOMATED RED ALERT: Composite Risk Score Exceeded 75/100',
        message: 'AI Multi-variate inference detected composite hazard index at 89/100 for Tawang Sela Ridge. Critical probability of slope failure.',
        severity: 'Emergency',
        alert_type: 'Landslide Risk Alert',
        location: 'Tawang Sela Ridge Km 14',
        district: 'Tawang',
        state: 'Arunachal Pradesh',
        target_users: 'District Administration, BRO Swastik, NDRF 12th Bn & Hill Residents',
        channels: ['SMS', 'Mobile Push', 'WhatsApp', 'Local Siren'],
        recommended_action: 'Mandatory immediate evacuation of scarp-side houses; halt vehicular traffic on NH-13.'
      };
      setActiveTriggerNotice('Threshold Triggered: Composite Risk Score > 75 (Score: 89/100). Red Alert generated.');
    } else if (triggerType === 'rainfall') {
      newAlertData = {
        title: 'AUTOMATED WARNING: Severe Rainfall Threshold Exceeded',
        message: 'IMD AWS Station logged 142.5mm cumulative rain in 24 hours (exceeding 80mm threshold) and 38mm/hr intensity.',
        severity: 'Warning',
        alert_type: 'Heavy Rainfall Warning',
        location: 'Cherrapunji (Sohra) Escarpment',
        district: 'East Khasi Hills',
        state: 'Meghalaya',
        target_users: 'SDRF Meghalaya, Tourist Department & Local Hamlets',
        channels: ['SMS', 'Mobile Push', 'WhatsApp'],
        recommended_action: 'Restrict all valley viewpoints, mobilize SDRF water rescue teams, monitor karst underground sinkholes.'
      };
      setActiveTriggerNotice('Threshold Triggered: Rainfall > 80mm/24h or > 30mm/hr (Measured: 142.5mm). Warning generated.');
    } else if (triggerType === 'moisture') {
      newAlertData = {
        title: 'AUTOMATED ADVISORY: Soil Moisture Surcharge > 85%',
        message: 'IoT Sensor SM-003 at Aizawl Laipuitlang registered 91% soil saturation. Pore-water pressure approaching soil liquefaction threshold.',
        severity: 'Advisory',
        alert_type: 'Sensor Failure',
        location: 'Aizawl Laipuitlang Slope',
        district: 'Aizawl',
        state: 'Mizoram',
        target_users: 'PWD Geotechnical Cell, DDMA Aizawl',
        channels: ['Mobile Push', 'WhatsApp'],
        recommended_action: 'Inspect slope weep-holes, clear storm drains, and advise residents on crack monitoring.'
      };
      setActiveTriggerNotice('Threshold Triggered: Soil Moisture > 85% (Measured: 91%). Advisory generated.');
    } else if (triggerType === 'movement') {
      newAlertData = {
        title: 'AUTOMATED RED ALERT: Accelerated Ground Displacement (>15mm/day)',
        message: 'Borehole extensometer telemetry detected 16.4mm/day creep displacement rate on cut slope above Dima Hasao railway artery.',
        severity: 'Emergency',
        alert_type: 'Landslide Risk Alert',
        location: 'Haflong Hill Cut Km 88',
        district: 'Dima Hasao',
        state: 'Assam',
        target_users: 'Northeast Frontier Railway (NFR) Control, Assam SDMA',
        channels: ['SMS', 'Mobile Push', 'Local Siren'],
        recommended_action: 'Halt all passenger train movement through Lumding-Badarpur hill section with immediate effect.'
      };
      setActiveTriggerNotice('Threshold Triggered: Ground Movement > 15mm/day (Measured: 16.4mm/day). Red Alert generated.');
    } else {
      newAlertData = {
        title: 'AUTOMATED ADVISORY: Multiple Citizen Hazard Reports Received',
        message: '3 crowdsourced citizen reports of fresh ground tensile fractures and rockfall verified within 500m radius of Gangtok 9th Mile.',
        severity: 'Advisory',
        alert_type: 'Road Blockage Alert',
        location: 'Gangtok 9th Mile Hill Cut',
        district: 'Gangtok',
        state: 'Sikkim',
        target_users: 'Sikkim Police Highway Patrol, BRO Project Swastik',
        channels: ['Mobile Push', 'WhatsApp'],
        recommended_action: 'Deploy patrol unit for ground inspection; restrict traffic to single-lane convoy.'
      };
      setActiveTriggerNotice('Threshold Triggered: Multiple Citizen Reports (3 reports clustered). Advisory generated.');
    }

    try {
      const created = await api.broadcastAlert(newAlertData);
      onAlertUpdated(created);
    } catch (err) {
      console.error(err);
    }
  };

  const getChannelIcon = (ch: string) => {
    switch (ch) {
      case 'SMS': return <Smartphone className="w-3 h-3" />;
      case 'Mobile Push': return <Send className="w-3 h-3" />;
      case 'Email': return <Mail className="w-3 h-3" />;
      case 'WhatsApp': return <MessageSquare className="w-3 h-3" />;
      default: return <Volume2 className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
              Automated Early Warning & Alert Center
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
              PHASE 6 AUTOMATION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            CAP (Common Alerting Protocol) compliant multi-channel emergency transmissions across Northeast India
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors border border-slate-700"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Acknowledged</span>
          </button>
          <button
            onClick={onOpenBroadcast}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition-all"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Broadcast Custom Alert</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* THRESHOLD-BASED TRIGGERS ENGINE PANEL (Phase 6 Requirement) */}
      {/* ========================================================================= */}
      <div className="glass-panel rounded-2xl p-5 border border-red-500/30 space-y-4 bg-gradient-to-r from-red-950/20 via-slate-900/60 to-slate-900/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Automated Threshold Triggers Simulation Engine
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            EWS ENGINE: AUTONOMOUS 24/7
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Click any trigger below to test how the system autonomously generates standardized <strong>Information, Advisory, Warning, or Red Alert</strong> notifications when physical thresholds are breached:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <button
            onClick={() => handleSimulateTrigger('risk')}
            className="p-3 rounded-xl bg-red-950/50 border border-red-500/60 hover:bg-red-900/60 text-left transition-all group shadow-md"
          >
            <span className="text-[9px] font-black uppercase tracking-wider text-red-400 block mb-1">
              Trigger 1: AI Risk &gt; 75
            </span>
            <strong className="text-xs text-white block group-hover:text-red-200">
              Composite Risk Red Alert
            </strong>
            <span className="text-[10px] text-slate-400 mt-1 block">Score &ge; 76 threshold</span>
          </button>

          <button
            onClick={() => handleSimulateTrigger('rainfall')}
            className="p-3 rounded-xl bg-orange-950/50 border border-orange-500/60 hover:bg-orange-900/60 text-left transition-all group shadow-md"
          >
            <span className="text-[9px] font-black uppercase tracking-wider text-orange-400 block mb-1">
              Trigger 2: Rainfall &gt; 80mm
            </span>
            <strong className="text-xs text-white block group-hover:text-orange-200">
              Cloudburst Warning
            </strong>
            <span className="text-[10px] text-slate-400 mt-1 block">Exceeds 24h capacity</span>
          </button>

          <button
            onClick={() => handleSimulateTrigger('moisture')}
            className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/60 hover:bg-amber-900/60 text-left transition-all group shadow-md"
          >
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 block mb-1">
              Trigger 3: Moisture &gt; 85%
            </span>
            <strong className="text-xs text-white block group-hover:text-amber-200">
              Liquefaction Advisory
            </strong>
            <span className="text-[10px] text-slate-400 mt-1 block">Saturation surcharge</span>
          </button>

          <button
            onClick={() => handleSimulateTrigger('movement')}
            className="p-3 rounded-xl bg-red-950/50 border border-red-500/60 hover:bg-red-900/60 text-left transition-all group shadow-md"
          >
            <span className="text-[9px] font-black uppercase tracking-wider text-red-400 block mb-1">
              Trigger 4: Creep &gt; 15mm/d
            </span>
            <strong className="text-xs text-white block group-hover:text-red-200">
              Active Shear Red Alert
            </strong>
            <span className="text-[10px] text-slate-400 mt-1 block">Extensometer detected</span>
          </button>

          <button
            onClick={() => handleSimulateTrigger('crowdsource')}
            className="p-3 rounded-xl bg-blue-950/50 border border-blue-500/60 hover:bg-blue-900/60 text-left transition-all group shadow-md"
          >
            <span className="text-[9px] font-black uppercase tracking-wider text-blue-400 block mb-1">
              Trigger 5: Reports Cluster
            </span>
            <strong className="text-xs text-white block group-hover:text-blue-200">
              Citizen Verified Advisory
            </strong>
            <span className="text-[10px] text-slate-400 mt-1 block">&ge;2 spatial reports</span>
          </button>
        </div>

        {activeTriggerNotice && (
          <div className="p-3 rounded-xl bg-slate-950/90 border border-cyan-500/50 text-xs text-cyan-300 flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              {activeTriggerNotice}
            </span>
            <button
              onClick={() => setActiveTriggerNotice(null)}
              className="text-[10px] text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Filter & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          {(['All', 'Emergency', 'Warning', 'Advisory', 'Information'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedSeverity(lvl)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedSeverity === lvl
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {lvl === 'Emergency' ? 'Red Alert' : lvl}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search alerts by title or sector..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64"
          />
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3.5">
        {filteredAlerts.map(alt => {
          const isEmergency = alt.severity === 'Emergency';
          return (
            <div
              key={alt.id}
              className={`glass-panel rounded-2xl p-5 border transition-all ${
                isEmergency
                  ? 'border-red-500/60 bg-red-950/15 shadow-lg shadow-red-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-cyan-400">{alt.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
                      isEmergency ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' :
                      alt.severity === 'Warning' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                      alt.severity === 'Advisory' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                      'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }`}
                  >
                    {isEmergency ? 'RED ALERT (CRITICAL)' : alt.severity}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {alt.alert_type}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(alt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {alt.status === 'Active' ? (
                    <button
                      onClick={() => handleMarkRead(alt)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-cyan-300 transition-colors"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Acknowledged
                    </span>
                  )}
                </div>
              </div>

              <div className="my-3 space-y-2">
                <h3 className="text-sm font-bold text-white leading-snug">{alt.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{alt.message}</p>
              </div>

              {/* Protective Directive */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                  MANDATORY PUBLIC DIRECTIVE
                </span>
                <p className="text-slate-200 font-medium">{alt.recommended_action}</p>
              </div>

              {/* Channels & Target Audience */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-300">Target Users:</span>
                  <span>{alt.target_users}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-300">Dispatched Via:</span>
                  <div className="flex items-center gap-1.5">
                    {alt.channels.map(ch => (
                      <span
                        key={ch}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono text-[10px] border border-slate-700"
                      >
                        {getChannelIcon(ch)}
                        <span>{ch}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
