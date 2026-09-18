import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Alert } from '../types';
import {
  Shield,
  Radio,
  Search,
  Globe,
  Bell,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  User as UserIcon,
  LogOut,
  ChevronDown,
  AlertTriangle,
  Layers,
  MapPin
} from 'lucide-react';

interface NavbarProps {
  selectedState: string;
  onSelectState: (state: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  alerts: Alert[];
  onOpenAlerts: () => void;
  onNavigate: (page: string) => void;
  isOnline?: boolean;
  onToggleOnline?: () => void;
  offlineCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedState,
  onSelectState,
  searchQuery,
  onSearchChange,
  alerts,
  onOpenAlerts,
  onNavigate,
  isOnline = true,
  onToggleOnline,
  offlineCount = 0
}) => {
  const { user, logout, switchRole } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const activeAlertsCount = alerts.filter(a => a.status === 'Active').length;

  const states = [
    'All States',
    'Arunachal Pradesh',
    'Assam',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Sikkim',
    'Tripura'
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B192C]/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top Emergency Flash Banner */}
      <div className="bg-gradient-to-r from-red-900/60 via-amber-900/40 to-red-900/60 border-b border-red-500/20 px-4 py-1 text-[11px] flex items-center justify-between text-red-200">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-bold uppercase tracking-wider text-red-400 text-[10px] shrink-0">
            MDoNER Early Warning Bulletin:
          </span>
          <span className="truncate text-slate-200">
            {t('alertBanner')}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 shrink-0 text-[10px] text-slate-400 font-mono">
          <span>NDRF HELPLINE: 1078</span>
          <span>•</span>
          <span>SEOC DISASTER CONTROL: 1070</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
            <Shield className="w-5 h-5 text-cyan-200" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-wider text-white flex items-center gap-1.5 font-['Outfit']">
                <span>NER-WATCH</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 font-black tracking-normal">
                  AI
                </span>
              </h1>
              <span className="hidden xl:inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                GOVT OF INDIA
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Ministry of Development of North Eastern Region (MDoNER)
            </p>
          </div>
        </div>

        {/* Center: State Selector & Search */}
        <div className="hidden lg:flex items-center gap-2 flex-1 max-w-xl mx-4">
          {/* State Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedState}
              onChange={e => onSelectState(e.target.value)}
              className="appearance-none bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 pr-8 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer shadow-sm"
            >
              {states.map(s => (
                <option key={s} value={s} className="bg-slate-900 text-slate-100">
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-sm"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Online/Sync Status Indicator with Click Toggle */}
          <button
            onClick={onToggleOnline}
            title={isOnline ? 'Click to simulate offline mode' : 'Click to reconnect online'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border ${
              isOnline
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-red-400" />}
            <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            {offlineCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[9px]">
                {offlineCount} queued
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-medium text-slate-200 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 z-50">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors ${
                      language === lang.code
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-[10px] opacity-70 font-mono">{lang.nativeLabel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
              }}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-black text-white ring-2 ring-[#0B192C]">
                  {activeAlertsCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-xs text-white">Emergency Alerts ({activeAlertsCount})</span>
                  <button
                    onClick={() => {
                      setIsNotifOpen(false);
                      onOpenAlerts();
                    }}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {alerts.slice(0, 4).map(a => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setIsNotifOpen(false);
                        onOpenAlerts();
                      }}
                      className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-red-400 text-[11px]">{a.severity}</span>
                        <span className="text-[10px] text-slate-400">{a.district}</span>
                      </div>
                      <p className="text-slate-200 text-[11px] line-clamp-2 font-medium">{a.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Selector */}
          <div className="relative">
            <button
              onClick={() => setIsUserOpen(!isUserOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs text-slate-200 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-xs">
                {user ? user.name[0] : 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-bold text-[11px] text-white leading-tight truncate max-w-[120px]">
                  {user ? user.name : 'Guest User'}
                </p>
                <p className="text-[9px] text-cyan-400 leading-tight">
                  {user ? user.role : 'Public View'}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isUserOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 space-y-2">
                <div className="p-2 border-b border-slate-800">
                  <p className="font-bold text-xs text-white">{user?.name || 'Authorized Official'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email || 'officer@nerwatch.gov.in'}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                    {user?.role || 'Officer'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Simulate Role
                  </div>
                  {(['Super Admin', 'District Administration', 'Disaster Management Officer', 'Field Official', 'Citizen'] as const).map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setIsUserOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                        user?.role === r ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      logout();
                      setIsUserOpen(false);
                      onNavigate('landing');
                    }}
                    className="w-full text-left px-2 py-1.5 rounded text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
