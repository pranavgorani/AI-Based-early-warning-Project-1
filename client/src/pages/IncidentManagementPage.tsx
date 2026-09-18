import React, { useState } from 'react';
import { Incident, IncidentStatus, IncidentSeverity } from '../types';
import { api } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';
import {
  ListTodo,
  Search,
  Filter,
  UserCheck,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  Clock,
  Eye,
  X,
  Send,
  ShieldAlert
} from 'lucide-react';

interface IncidentManagementPageProps {
  incidents: Incident[];
  onIncidentUpdated: (incident: Incident) => void;
  onOpenEmergencyResponse?: () => void;
}

export const IncidentManagementPage: React.FC<IncidentManagementPageProps> = ({
  incidents,
  onIncidentUpdated,
  onOpenEmergencyResponse
}) => {
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [viewingIncident, setViewingIncident] = useState<Incident | null>(null);
  const [assigningIncident, setAssigningIncident] = useState<Incident | null>(null);
  const [newOfficer, setNewOfficer] = useState('');

  const officers = [
    'Dr. Rajesh Sarma (MDoNER Commissioner)',
    'Pema Khandu Dorjee (DDMO Tawang)',
    'Temsula Jamir (Senior Geologist GSI)',
    'Col. Arvind Negi (BRO Project Swastik)',
    'Inspector T. Norbu (District Police)',
    'Meghalaya SDMA Quick Response Desk'
  ];

  const filtered = incidents.filter(i => {
    const matchesSearch =
      !search ||
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.location.toLowerCase().includes(search.toLowerCase());
    const matchesDistrict = selectedDistrict === 'All' || i.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesSeverity = selectedSeverity === 'All' || i.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'All' || i.status === selectedStatus;
    return matchesSearch && matchesDistrict && matchesSeverity && matchesStatus;
  });

  const handleUpdateStatus = async (inc: Incident, newStatus: IncidentStatus) => {
    try {
      const updated = await api.updateIncident(inc.id, { status: newStatus });
      onIncidentUpdated(updated);
      if (viewingIncident?.id === inc.id) {
        setViewingIncident(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignOfficer = async () => {
    if (!assigningIncident || !newOfficer) return;
    try {
      const updated = await api.updateIncident(assigningIncident.id, {
        assigned_officer: newOfficer,
        status: assigningIncident.status === 'Pending Verification' ? 'Verified' : assigningIncident.status
      });
      onIncidentUpdated(updated);
      setAssigningIncident(null);
    } catch (err) {
      console.error(err);
    }
  };

  const uniqueDistricts = Array.from(new Set(incidents.map(i => i.district)));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
              Incident Management & Verification Dashboard
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              OFFICIAL WORKFLOW
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track, verify, assign officers, and initiate rapid NDRF / SDRF response teams across North East India
          </p>
        </div>

        {onOpenEmergencyResponse && (
          <button
            onClick={onOpenEmergencyResponse}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all self-start md:self-auto"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Emergency Priority Queue</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* District Filter */}
          <select
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-medium focus:outline-none"
          >
            <option value="All">All Districts</option>
            {uniqueDistricts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={e => setSelectedSeverity(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-medium focus:outline-none"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-medium focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Verified">Verified</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Response Initiated">Response Initiated</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ID, title, road..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-52"
          />
        </div>
      </div>

      {/* Incidents Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Title & Hazard Type</th>
                <th className="py-3 px-4">Location / District</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Reported By</th>
                <th className="py-3 px-4">Workflow Status</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(inc => (
                <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                    {inc.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white line-clamp-1">{inc.title}</p>
                    <span className="text-[10px] text-amber-400 font-medium">{inc.issue_type}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-slate-200 line-clamp-1">{inc.location}</p>
                    <span className="text-[10px] text-slate-400">{inc.district}, {inc.state}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <RiskBadge level={inc.severity} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-white font-medium">{inc.reported_by}</p>
                    <span className="text-[10px] text-slate-400">{inc.reporter_role}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={inc.status}
                      onChange={e => handleUpdateStatus(inc, e.target.value as IncidentStatus)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer focus:outline-none ${
                        inc.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : inc.status === 'Response Initiated'
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : inc.status === 'Verified'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : inc.status === 'Under Investigation'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <option value="Pending Verification">Pending Verification</option>
                      <option value="Verified">Verified</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Response Initiated">Response Initiated</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    {inc.assigned_officer && inc.assigned_officer !== 'Unassigned' ? (
                      <span className="text-slate-300 font-medium truncate block max-w-[140px]">
                        {inc.assigned_officer}
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setAssigningIncident(inc);
                          setNewOfficer(officers[0]);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
                      >
                        + Assign Desk
                      </button>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setViewingIncident(inc)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {viewingIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4 text-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-cyan-400 font-bold">{viewingIncident.id}</span>
                <h3 className="text-lg font-black text-white mt-1">{viewingIncident.title}</h3>
                <p className="text-xs text-slate-400">{viewingIncident.location} ({viewingIncident.district}, {viewingIncident.state})</p>
              </div>
              <button onClick={() => setViewingIncident(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Images */}
            {viewingIncident.images && viewingIncident.images.length > 0 && (
              <div className="rounded-xl overflow-hidden border border-slate-800 h-52 bg-slate-950">
                <img
                  src={viewingIncident.images[0]}
                  alt="Incident photographic evidence"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Severity</span>
                <RiskBadge level={viewingIncident.severity} size="sm" />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Road Status</span>
                <strong className="text-white">{viewingIncident.road_status}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">People Affected</span>
                <strong className="text-cyan-300">{viewingIncident.people_affected}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Reported By</span>
                <strong className="text-white">{viewingIncident.reported_by}</strong>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Detailed Field Observation
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed p-3 rounded-xl bg-slate-950 border border-slate-800">
                {viewingIncident.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                Timestamp: {new Date(viewingIncident.created_at).toLocaleString()}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAssigningIncident(viewingIncident);
                    setNewOfficer(viewingIncident.assigned_officer || officers[0]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300"
                >
                  Change Officer
                </button>
                <button
                  onClick={() => setViewingIncident(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Officer Modal */}
      {assigningIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Assign Incident Handling Desk</h3>
                <p className="text-[10px] text-cyan-400 font-mono">{assigningIncident.id}</p>
              </div>
              <button onClick={() => setAssigningIncident(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block text-slate-300 font-semibold mb-1">
                Select Authorized Official / Emergency Team
              </label>
              <select
                value={newOfficer}
                onChange={e => setNewOfficer(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
              >
                {officers.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setAssigningIncident(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignOfficer}
                  className="px-5 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl shadow"
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
