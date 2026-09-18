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
  Clock
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
              Multi-Agency Emergency Notification & Early Warning Dispatch
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
              DISASTER BROADCAST LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official CAP (Common Alerting Protocol) compliant emergency transmissions across Northeast India
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
            <span>Broadcast New Alert</span>
          </button>
        </div>
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
              {lvl}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search alerts by title or region..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-60"
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
                  ? 'border-red-500/50 bg-red-950/10 shadow-lg shadow-red-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-cyan-400">{alt.id}</span>
                  <RiskBadge level={alt.severity} size="sm" />
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
