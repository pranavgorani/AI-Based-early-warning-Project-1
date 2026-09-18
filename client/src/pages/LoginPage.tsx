import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  Shield,
  Lock,
  Mail,
  UserCheck,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  KeyRound
} from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onBackToHome }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@nerwatch.gov.in');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState<UserRole>('Super Admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: 'Super Admin' as UserRole,
      email: 'admin@nerwatch.gov.in',
      pass: 'admin123',
      label: 'Super Admin (MDoNER HQ)',
      desc: 'Complete administrative, threshold, and sensor management'
    },
    {
      role: 'District Administration' as UserRole,
      email: 'officer@nerwatch.gov.in',
      pass: 'officer123',
      label: 'District Officer (DDMO)',
      desc: 'Regional control room, alert broadcast, evacuation order'
    },
    {
      role: 'Field Official' as UserRole,
      email: 'field@nerwatch.gov.in',
      pass: 'field123',
      label: 'Field Inspector (GSI / PWD)',
      desc: 'Submit detailed geological logs, road statuses, ground checks'
    },
    {
      role: 'Citizen' as UserRole,
      email: 'citizen@nerwatch.gov.in',
      pass: 'citizen123',
      label: 'Local Citizen / Volunteer',
      desc: 'Report land cracks, view public hazards, receive safety SMS'
    },
  ];

  const handleSelectDemo = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setRole(acc.role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password, role);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071324] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-slate-100">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back button */}
      <button
        onClick={onBackToHome}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Portal Home</span>
      </button>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800 text-white shadow-xl shadow-cyan-500/25 border border-cyan-400/40 mx-auto">
            <Shield className="w-8 h-8 text-cyan-200" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white font-['Outfit']">
            NER Disaster Intelligence
          </h2>
          <p className="text-xs text-slate-400">
            Ministry of Development of North Eastern Region (MDoNER)
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-700/80 shadow-2xl bg-slate-900/90 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="name@nerwatch.gov.in"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Operational Role
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                >
                  <option value="Super Admin">Super Admin (HQ MDoNER)</option>
                  <option value="District Administration">District Administration (DDMO)</option>
                  <option value="Disaster Management Officer">Disaster Management Officer</option>
                  <option value="Field Official">Field Official (GSI / BRO / Police)</option>
                  <option value="Citizen">Citizen / Community Volunteer</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Command Center'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 mb-2.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Smart India Hackathon 1-Click Demo Profiles</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {demoAccounts.map(acc => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectDemo(acc)}
                  className={`w-full text-left p-2 rounded-xl border transition-all text-xs flex items-center justify-between ${
                    email === acc.email
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 shadow-sm'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <span className="font-bold block text-[11px] text-white">{acc.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{acc.email} ({acc.pass})</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    Use
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
