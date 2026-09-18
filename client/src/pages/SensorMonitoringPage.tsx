import React, { useState } from 'react';
import { SensorData, SensorType } from '../types';
import { api } from '../services/api';
import {
  Activity,
  Plus,
  Battery,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wifi,
  Radio,
  Search,
  RefreshCw,
  X,
  Gauge
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface SensorMonitoringPageProps {
  sensors: SensorData[];
  onSensorUpdated: (sensor: SensorData) => void;
  onSensorAdded: (sensor: SensorData) => void;
}

export const SensorMonitoringPage: React.FC<SensorMonitoringPageProps> = ({
  sensors,
  onSensorUpdated,
  onSensorAdded
}) => {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSensor, setEditingSensor] = useState<SensorData | null>(null);

  // Add form fields
  const [newType, setNewType] = useState<SensorType>('Soil Moisture Sensor');
  const [newLocation, setNewLocation] = useState('Sela Tunnel Ridge');
  const [newDistrict, setNewDistrict] = useState('Tawang');
  const [newState, setNewState] = useState('Arunachal Pradesh');
  const [newReading, setNewReading] = useState(48);
  const [newThreshold, setNewThreshold] = useState(75);

  const filteredSensors = sensors.filter(s => {
    const matchesType = selectedType === 'All' || s.sensor_type === selectedType;
    const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
    const matchesSearch =
      !search ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.location_name.toLowerCase().includes(search.toLowerCase()) ||
      s.district.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const onlineCount = sensors.filter(s => s.status === 'Online').length;
  const warningCount = sensors.filter(s => s.status === 'Warning').length;
  const offlineCount = sensors.filter(s => s.status === 'Offline').length;

  const healthData = [
    { name: 'Online (Nominal)', value: onlineCount, color: '#10b981' },
    { name: 'Threshold Warning', value: warningCount, color: '#f59e0b' },
    { name: 'Offline / Battery Low', value: offlineCount, color: '#ef4444' },
  ];

  const handleAddSensor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const unitMap: Record<SensorType, string> = {
        'Soil Moisture Sensor': '%',
        'Rain Gauge': 'mm/hr',
        'Ground Movement Sensor': 'mm/day',
        'Tilt Sensor': '° tilt',
        'Vibration Sensor': 'mm/s'
      };

      const created = await api.createSensor({
        sensor_type: newType,
        location_name: newLocation,
        district: newDistrict,
        state: newState,
        current_reading: newReading,
        unit: unitMap[newType],
        alert_threshold: newThreshold
      });
      onSensorAdded(created);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveThreshold = async () => {
    if (!editingSensor) return;
    try {
      const updated = await api.updateSensor(editingSensor.id, {
        alert_threshold: editingSensor.alert_threshold
      });
      onSensorUpdated(updated);
      setEditingSensor(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
              IoT Sensor Intelligence & Telemetry Network
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              1,248 NODES ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time wireless geotechnical telemetry across slopes, roads, and watersheds in North East India
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Deploy New Sensor</span>
        </button>
      </div>

      {/* Sensor Health Overview Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: 3 Metric Counters */}
        <div className="lg:col-span-8 grid grid-cols-3 gap-4">
          <div className="glass-panel p-4 rounded-xl border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Online & Active</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-400 mt-1">{onlineCount}</p>
            <span className="text-[10px] text-slate-400">Transmitting every 60s</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-amber-500/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Threshold Breached</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-black text-amber-400 mt-1">{warningCount}</p>
            <span className="text-[10px] text-slate-400">Immediate attention</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-red-500/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Offline / Low Battery</span>
              <XCircle className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-3xl font-black text-red-400 mt-1">{offlineCount}</p>
            <span className="text-[10px] text-slate-400">Field team dispatched</span>
          </div>
        </div>

        {/* Right: Pie Chart Distribution */}
        <div className="lg:col-span-4 glass-panel p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="w-28 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={healthData} dataKey="value" innerRadius={22} outerRadius={36} paddingAngle={4}>
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] space-y-1">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Nominal</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Threshold Alert</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400"></span> Offline</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-medium focus:outline-none"
          >
            <option value="All">All Sensor Types</option>
            <option value="Soil Moisture Sensor">Soil Moisture Sensors</option>
            <option value="Rain Gauge">Rain Gauges</option>
            <option value="Ground Movement Sensor">Ground Movement Sensors</option>
            <option value="Tilt Sensor">Tilt Sensors</option>
            <option value="Vibration Sensor">Vibration Sensors</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-medium focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Online">Online</option>
            <option value="Warning">Warning</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sensor ID or zone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48"
          />
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSensors.map(sensor => {
          const isBreached = sensor.current_reading >= sensor.alert_threshold;
          return (
            <div
              key={sensor.id}
              className={`glass-panel rounded-2xl p-4 border transition-all hover:-translate-y-1 ${
                isBreached
                  ? 'border-red-500/50 shadow-lg shadow-red-500/10'
                  : 'border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-cyan-400">{sensor.id}</span>
                  <h4 className="text-xs font-bold text-white mt-0.5">{sensor.sensor_type}</h4>
                  <p className="text-[10px] text-slate-400">{sensor.location_name}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    sensor.status === 'Online'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : sensor.status === 'Warning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}
                >
                  {sensor.status}
                </span>
              </div>

              {/* Reading Display */}
              <div className="my-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Current Telemetry</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-black ${isBreached ? 'text-red-400' : 'text-white'}`}>
                      {sensor.current_reading}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{sensor.unit}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Threshold</span>
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    {sensor.alert_threshold} {sensor.unit}
                  </span>
                </div>
              </div>

              {/* Battery & Last Updated */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 mb-3">
                <span className="flex items-center gap-1 font-mono">
                  <Battery className="w-3 h-3 text-emerald-400" />
                  {sensor.battery_level}%
                </span>
                <span>{sensor.last_updated}</span>
              </div>

              {/* Action */}
              <button
                onClick={() => setEditingSensor(sensor)}
                className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Configure Threshold</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Sensor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Deploy New IoT Sensor Node</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSensor} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sensor Modality</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as SensorType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option>Soil Moisture Sensor</option>
                  <option>Rain Gauge</option>
                  <option>Ground Movement Sensor</option>
                  <option>Tilt Sensor</option>
                  <option>Vibration Sensor</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deployment Location Name</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">State</label>
                  <input
                    type="text"
                    value={newState}
                    onChange={e => setNewState(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">District</label>
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={e => setNewDistrict(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Reading</label>
                  <input
                    type="number"
                    value={newReading}
                    onChange={e => setNewReading(Number(e.target.value))}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Alert Threshold</label>
                  <input
                    type="number"
                    value={newThreshold}
                    onChange={e => setNewThreshold(Number(e.target.value))}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl shadow"
                >
                  Register Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Threshold Configuration Modal */}
      {editingSensor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Configure Alarm Threshold</h3>
                <p className="text-[10px] text-slate-400">{editingSensor.id} - {editingSensor.location_name}</p>
              </div>
              <button onClick={() => setEditingSensor(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                When telemetry exceeds this value, an autonomous RED ALERT notification is broadcast to the district emergency operations center.
              </p>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Threshold ({editingSensor.unit})
                </label>
                <input
                  type="number"
                  value={editingSensor.alert_threshold}
                  onChange={e =>
                    setEditingSensor({
                      ...editingSensor,
                      alert_threshold: Number(e.target.value)
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSensor(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveThreshold}
                  className="px-5 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl shadow"
                >
                  Save Threshold
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
