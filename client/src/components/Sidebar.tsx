import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Map,
  Cpu,
  CloudRain,
  Activity,
  FilePlus2,
  ListTodo,
  Truck,
  Bell,
  LifeBuoy,
  BarChart3,
  Users,
  Network,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertOctagon,
  Server
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeAlertsCount: number;
  pendingIncidentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  activeAlertsCount,
  pendingIncidentsCount
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, badge: null },
    { id: 'live-map', label: t('liveMap'), icon: Map, badge: '9 LYR' },
    { id: 'data-integration', label: 'Data Integration Center', icon: Network, badge: '6 SRC', badgeColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' },
    { id: 'ai-predictions', label: t('aiPredictions'), icon: Cpu, badge: '94%' },
    { id: 'offline-sync', label: 'Offline Sync Queue', icon: AlertOctagon, badge: 'OFFLINE', badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40' },
    { id: 'weather', label: t('rainfallWeather'), icon: CloudRain, badge: null },
    { id: 'sensors', label: t('sensorMonitoring'), icon: Activity, badge: '1.2k' },
    { id: 'incident-report', label: t('landslideReports'), icon: FilePlus2, badge: null },
    { id: 'incident-management', label: t('incidentManagement'), icon: ListTodo, badge: pendingIncidentsCount > 0 ? String(pendingIncidentsCount) : null },
    { id: 'road-connectivity', label: t('roadConnectivity'), icon: Truck, badge: '18 Rd' },
    { id: 'alerts', label: t('alerts'), icon: Bell, badge: activeAlertsCount > 0 ? String(activeAlertsCount) : null, badgeColor: 'bg-red-500' },
    { id: 'emergency-response', label: t('emergencyResponse'), icon: LifeBuoy, badge: 'NDRF' },
    { id: 'analytics', label: t('analytics'), icon: BarChart3, badge: null },
    { id: 'api-health', label: 'API Health & Costs', icon: Server, badge: 'LIVE', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' },
    { id: 'architecture', label: t('architecture'), icon: ShieldCheck, badge: null },
    ...(user?.role === 'Super Admin' || user?.role === 'District Administration'
      ? [{ id: 'user-management', label: t('userManagement'), icon: Users, badge: null }]
      : []),
  ];

  return (
    <aside
      className={`relative z-30 flex flex-col bg-[#081528] border-r border-slate-800 transition-all duration-300 text-slate-300 ${
        collapsed ? 'w-20' : 'w-64'
      } shrink-0 min-h-[calc(100vh-80px)]`}
    >
      {/* Collapse / Expand Toggle */}
      <button
        onClick={onToggleCollapse}
        className="hidden md:flex absolute -right-3 top-5 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white items-center justify-center shadow-lg transition-transform hover:scale-110 z-30"
        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Nav List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className={`px-3 mb-2 text-[10px] font-bold tracking-wider uppercase text-slate-500 ${collapsed ? 'hidden' : 'block'}`}>
          OPERATIONAL MODULES
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-800 text-cyan-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed view */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-[11px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Status Pill */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              EWS Status
            </span>
            <span className="text-emerald-400 font-bold text-[10px] uppercase">Active</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full w-[94%] rounded-full animate-pulse"></div>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            AI Engine sync cycle: 60s. Autonomous risk scoring operational across 8 NE states.
          </p>
        </div>
      )}
    </aside>
  );
};
