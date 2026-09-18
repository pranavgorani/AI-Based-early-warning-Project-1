import React, { useState } from 'react';
import { Alert, LocationData } from '../types';
import { api } from '../services/api';
import { geminiService } from '../services/geminiService';
import {
  X,
  Radio,
  Send,
  MessageSquare,
  Smartphone,
  Mail,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Globe
} from 'lucide-react';

interface BroadcastAlertModalProps {
  location?: LocationData | null;
  onClose: () => void;
  onAlertBroadcasted: (alert: Alert) => void;
}

export const BroadcastAlertModal: React.FC<BroadcastAlertModalProps> = ({
  location,
  onClose,
  onAlertBroadcasted
}) => {
  const [title, setTitle] = useState(
    location
      ? `EMERGENCY ALERT: Landslide Threat at ${location.name}`
      : 'EMERGENCY ALERT: Severe Landslide Vulnerability Detected'
  );
  const [severity, setSeverity] = useState<'Information' | 'Advisory' | 'Warning' | 'Emergency'>('Emergency');
  const [message, setMessage] = useState(
    location
      ? `Heavy continuous rainfall and critical soil moisture saturation have triggered acute landslide probability at ${location.name}, ${location.district} (${location.state}). High risk of debris flow.`
      : 'Continuous heavy rainfall has saturated mountain slopes. All residents in vulnerable hill sectors must stay vigilant and prepare for temporary relocation.'
  );
  const [recommendedAction, setRecommendedAction] = useState(
    location?.recommended_action || 'Evacuate vulnerable dwellings immediately to designated community shelters. Halt travel on arterial hill roads.'
  );
  const [regionalTranslation, setRegionalTranslation] = useState<string>(
    'चेतावनी: पहाड़ी ढलानों पर भारी भूस्खलन का खतरा। सुरक्षित आश्रयों में जाएं।'
  );
  const [channels, setChannels] = useState<string[]>(['SMS', 'Mobile Push', 'WhatsApp', 'Local Siren']);
  const [targetGroup, setTargetGroup] = useState('All Residents, District Officials & Transport Operators');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleChannel = (ch: string) => {
    setChannels(prev =>
      prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]
    );
  };

  const handleGenerateWithAI = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await geminiService.generateAdvisoryBulletin({
        location: location ? location.name : 'Northeast Hill Artery',
        district: location ? location.district : 'Monitored District',
        state: location ? location.state : 'NER',
        severity,
        risk_score: location ? location.risk_score : 85,
        target_audience: targetGroup
      });

      if (res.english) setMessage(res.english);
      if (res.regional) setRegionalTranslation(res.regional);
    } catch {
      // Handled in service fallback
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await api.broadcastAlert({
        title,
        message: `${message} [Hindi/Regional: ${regionalTranslation}]`,
        severity,
        alert_type: 'Landslide Risk Alert',
        location: location ? location.name : 'NER Hill Sector',
        district: location ? location.district : 'Multiple Districts',
        state: location ? location.state : 'North East Region',
        target_users: targetGroup,
        channels: channels as any,
        recommended_action: recommendedAction
      });
      setSuccess(true);
      setTimeout(() => {
        onAlertBroadcasted(created);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-red-500/40 rounded-2xl shadow-2xl overflow-hidden glass-panel-glow text-slate-100">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Multi-Channel Early Warning Dispatcher
              </h3>
              <p className="text-xs text-slate-400">
                Official Common Alerting Protocol (CAP) Multi-Lingual Broadcast
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-white">Emergency Warning Broadcasted</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Alert successfully pushed across SMS Gateways, WhatsApp Broadcasts, Mobile Cell Broadcast, and Local Disaster Sirens.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBroadcast} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            {/* Severity Level */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Alert Severity Level
                </label>
                <button
                  type="button"
                  onClick={handleGenerateWithAI}
                  disabled={isGeneratingAI}
                  className="text-cyan-400 hover:text-cyan-300 font-bold text-[11px] flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingAI ? 'Generating AI Bulletin...' : 'Auto-Draft with Gemini AI'}</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {(['Information', 'Advisory', 'Warning', 'Emergency'] as const).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeverity(lvl)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      severity === lvl
                        ? lvl === 'Emergency'
                          ? 'bg-red-500/20 text-red-300 border-red-500 shadow-sm'
                          : lvl === 'Warning'
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500'
                          : lvl === 'Advisory'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl === 'Emergency' ? 'Red Alert' : lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Alert Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Detailed Warning Message (English)
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Regional / Hindi Broadcast Text (Disaster Cell)
              </label>
              <textarea
                value={regionalTranslation}
                onChange={e => setRegionalTranslation(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Mandatory Protective Action
              </label>
              <input
                type="text"
                value={recommendedAction}
                onChange={e => setRecommendedAction(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Target Channels */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Dissemination Channels
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { name: 'SMS', icon: Smartphone },
                  { name: 'Mobile Push', icon: Send },
                  { name: 'WhatsApp', icon: MessageSquare },
                  { name: 'Local Siren', icon: Volume2 },
                ].map(({ name, icon: Icon }) => {
                  const active = channels.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleChannel(name)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        active
                          ? 'bg-red-500/20 text-red-300 border-red-500 shadow-sm'
                          : 'bg-slate-800/40 text-slate-400 border-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || channels.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-black text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-xl shadow-lg shadow-red-600/30 transition-all"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                {isSubmitting ? 'Broadcasting...' : 'Broadcast Multi-Channel Warning'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
