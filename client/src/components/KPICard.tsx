import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral' | 'warning';
  accentColor?: 'red' | 'orange' | 'amber' | 'blue' | 'emerald' | 'cyan';
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  change,
  changeType = 'neutral',
  accentColor = 'blue',
  onClick
}) => {
  const colorMap = {
    red: {
      border: 'hover:border-red-500/50',
      iconBg: 'bg-red-500/10 text-red-400 border-red-500/30',
      glow: 'from-red-500/10'
    },
    orange: {
      border: 'hover:border-orange-500/50',
      iconBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      glow: 'from-orange-500/10'
    },
    amber: {
      border: 'hover:border-amber-500/50',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      glow: 'from-amber-500/10'
    },
    blue: {
      border: 'hover:border-blue-500/50',
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      glow: 'from-blue-500/10'
    },
    emerald: {
      border: 'hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      glow: 'from-emerald-500/10'
    },
    cyan: {
      border: 'hover:border-cyan-500/50',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      glow: 'from-cyan-500/10'
    },
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-xl p-5 relative overflow-hidden transition-all duration-300 border border-slate-700/60 ${colorMap.border} ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      }`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colorMap.glow} to-transparent pointer-events-none rounded-bl-full`} />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-1">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl border ${colorMap.iconBg} shadow-inner`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || change) && (
        <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
          {subtitle && <span className="text-slate-400 truncate max-w-[180px]">{subtitle}</span>}
          {change && (
            <span
              className={`font-semibold px-2 py-0.5 rounded-full ${
                changeType === 'negative'
                  ? 'bg-red-500/20 text-red-400'
                  : changeType === 'warning'
                  ? 'bg-amber-500/20 text-amber-400'
                  : changeType === 'positive'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-slate-700/50 text-slate-300'
              }`}
            >
              {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
