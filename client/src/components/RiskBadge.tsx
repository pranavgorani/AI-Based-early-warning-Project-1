import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showPulse = true }) => {
  const getStyle = () => {
    switch (level) {
      case 'Critical Risk':
      case 'Critical':
      case 'Emergency':
        return {
          bg: 'bg-red-500/15 text-red-400 border-red-500/40',
          dot: 'bg-red-500',
          pulse: 'animate-ping bg-red-400'
        };
      case 'High Risk':
      case 'High':
      case 'Warning':
        return {
          bg: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
          dot: 'bg-orange-500',
          pulse: 'animate-pulse bg-orange-400'
        };
      case 'Moderate Risk':
      case 'Moderate':
      case 'Advisory':
        return {
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
          dot: 'bg-amber-500',
          pulse: 'bg-amber-400'
        };
      default:
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
          dot: 'bg-emerald-500',
          pulse: 'bg-emerald-400'
        };
    }
  };

  const { bg, dot, pulse } = getStyle();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5 font-semibold'
  }[size];

  return (
    <span className={`inline-flex items-center rounded-full border ${bg} ${sizeClasses} transition-all`}>
      <span className="relative flex h-2 w-2">
        {showPulse && (level.includes('Critical') || level.includes('High') || level === 'Emergency') && (
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${pulse}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dot}`}></span>
      </span>
      <span>{level}</span>
    </span>
  );
};
