import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Clock,
  Database,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileText,
  Trash2,
  HardDrive,
  Zap,
  Sliders,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Incident } from '../types';

interface QueuedItem {
  id: string;
  type: 'Incident Report' | 'Sensor Reading' | 'Road Status Update';
  location: string;
  severity: string;
  queued_at: string;
  size: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
}

interface OfflineSyncPageProps {
  isOnline: boolean;
  onToggleOnline: () => void;
  onNavigate: (page: string) => void;
}

export const OfflineSyncPage: React.FC<OfflineSyncPageProps> = ({
  isOnline,
  onToggleOnline,
  onNavigate
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('2 minutes ago');
  const [lowBandwidthMode, setLowBandwidthMode] = useState<boolean>(false);
  const [cachedTilesCount, setCachedTilesCount] = useState<number>(432);

  // Queued offline items list
  const [queueList, setQueueList] = useState<QueuedItem[]>([
    {
      id: 'NER-INC-2026-00452',
      type: 'Incident Report',
      location: 'Sela Pass Km 14, Tawang',
      severity: 'High',
      queued_at: '12 mins ago',
      size: '2.4 MB (Photo & Video)',
      status: 'pending'
    },
    {
      id: 'NER-INC-2026-00453',
      type: 'Incident Report',
      location: 'Cherrapunji Shella Escarpment',
      severity: 'Critical',
      queued_at: '8 mins ago',
      size: '1.8 MB (Ground Crack)',
      status: 'pending'
    },
    {
      id: 'NER-UPD-2026-00109',
      type: 'Road Status Update',
      location: 'NH-10 Gangtok 9th Mile',
      severity: 'Moderate',
      queued_at: '4 mins ago',
      size: '42 KB',
      status: 'pending'
    }
  ]);

  const handleForceSync = () => {
    if (!isOnline) {
      alert('System is currently OFFLINE. Toggle network to Online before synchronizing.');
      return;
    }

    setIsSyncing(true);
    setQueueList(prev => prev.map(item => ({ ...item, status: 'syncing' })));

    setTimeout(() => {
      setQueueList([]);
      setIsSyncing(false);
      setLastSyncTime('Just now');
      alert('All pending reports and telemetry synced successfully with MDoNER central servers!');
    }, 2000);
  };

  const handleClearQueue = () => {
    if (confirm('Clear local offline queue? Unsynced reports will be discarded.')) {
      setQueueList([]);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 text-amber-400">
              <Database className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
              Offline-First Synchronization Center
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              PHASE 5
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Resilient store-and-forward architecture ensuring uninterrupted reporting in remote Himalayan valleys with intermittent 2G/3G connectivity
          </p>
        </div>

        {/* Global Network State Simulator Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleOnline}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 border shadow-lg ${
              isOnline
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30 animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-red-400" />}
            <span>{isOnline ? 'Network: ONLINE' : 'Network: OFFLINE (Testing)'}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending Reports Card */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Pending Reports in Local Queue
          </span>
          <p className="text-3xl font-black text-amber-400 font-mono">
            {queueList.length} <span className="text-xs font-normal text-slate-400">items</span>
          </p>
          <span className="text-[10px] text-slate-400">
            Stored in browser IndexedDB / localStorage
          </span>
        </div>

        {/* Last Sync Timestamp */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Last Successful Sync
          </span>
          <p className="text-2xl font-black text-white font-mono mt-1">
            {lastSyncTime}
          </p>
          <span className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Auto-sync enabled
          </span>
        </div>

        {/* Connection Status */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Current Connection Status
          </span>
          <p className={`text-2xl font-black font-mono mt-1 ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
            {isOnline ? 'Online (4G / SatLink)' : 'Offline (Disconnected)'}
          </p>
          <span className="text-[10px] text-slate-400">
            {isOnline ? 'Latency: 48ms | SEOC Node Kamrup' : 'Store-and-forward active'}
          </span>
        </div>
      </div>

      {/* Low-Bandwidth Mode & Cached GIS Tile Settings */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          Field Optimization & Bandwidth Management
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Low Bandwidth Toggle */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white block">Low-Bandwidth Mode</span>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Disables satellite raster imagery, compresses uploaded media to WebP, and streams essential vector hazard polygons only.
              </p>
            </div>
            <button
              onClick={() => setLowBandwidthMode(!lowBandwidthMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border ${
                lowBandwidthMode
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {lowBandwidthMode ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Cached Map Data */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-white block">Offline Cached GIS Data</span>
              <p className="text-[11px] text-slate-400">
                {cachedTilesCount} map tiles cached locally for Sikkim, Tawang, and Sohra sectors.
              </p>
            </div>
            <button
              onClick={() => {
                setCachedTilesCount(prev => prev + 128);
                alert('Downloaded additional 128 offline map tiles for North Eastern Region.');
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Pre-Cache Sector
            </button>
          </div>
        </div>
      </div>

      {/* Offline Sync Queue Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-cyan-400" />
              Offline Upload Queue ({queueList.length} Pending)
            </h4>
            <p className="text-xs text-slate-400">Items waiting to upload automatically once connection is re-established</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearQueue}
              disabled={queueList.length === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 text-xs font-bold transition-colors disabled:opacity-40"
            >
              Clear Queue
            </button>

            <button
              onClick={handleForceSync}
              disabled={queueList.length === 0 || isSyncing}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-1.5 disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Items...' : 'Force Synchronize Now'}</span>
            </button>
          </div>
        </div>

        {queueList.length === 0 ? (
          <div className="p-8 text-center space-y-2 border border-dashed border-slate-800 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h5 className="text-sm font-bold text-white">Queue is Empty</h5>
            <p className="text-xs text-slate-400">All reports and sensor telemetry have been synchronized with the central server.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Item ID</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Payload Size</th>
                  <th className="py-2.5 px-3">Queued At</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {queueList.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">{item.id}</td>
                    <td className="py-2.5 px-3 font-medium text-white">{item.type}</td>
                    <td className="py-2.5 px-3 text-slate-400">{item.location}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        item.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        item.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{item.size}</td>
                    <td className="py-2.5 px-3 text-slate-400">{item.queued_at}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.status === 'syncing' ? 'bg-cyan-500/20 text-cyan-300 animate-pulse' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
