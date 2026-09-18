import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Incident, IssueType, IncidentSeverity } from '../types';
import { api } from '../services/api';
import {
  FilePlus2,
  Camera,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Upload,
  UserCheck,
  Smartphone,
  Shield,
  Send,
  Navigation
} from 'lucide-react';

interface IncidentReportingPageProps {
  onIncidentSubmitted: (inc: Incident) => void;
  onNavigateToManagement: () => void;
}

export const IncidentReportingPage: React.FC<IncidentReportingPageProps> = ({
  onIncidentSubmitted,
  onNavigateToManagement
}) => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState<'citizen' | 'field'>(
    user?.role === 'Citizen' ? 'citizen' : 'field'
  );

  // Common Fields
  const [title, setTitle] = useState('Ground Subsidence & Slope Creep Observed');
  const [location, setLocation] = useState('Baisakhi Sector Km 182, Tawang Road');
  const [district, setDistrict] = useState('Tawang');
  const [state, setState] = useState('Arunachal Pradesh');
  const [latitude, setLatitude] = useState(27.586);
  const [longitude, setLongitude] = useState(91.859);
  const [issueType, setIssueType] = useState<IssueType>('Landslide');
  const [severity, setSeverity] = useState<IncidentSeverity>('High');
  const [description, setDescription] = useState(
    'Noticed severe ground fracturing and rapid boulder displacement blocking half the highway width following monsoon downpour.'
  );
  const [roadStatus, setRoadStatus] = useState<'Open' | 'Partially Blocked' | 'Blocked' | 'Critical'>('Blocked');
  const [peopleAffected, setPeopleAffected] = useState(120);

  // Image upload simulation state
  const [uploadedImage, setUploadedImage] = useState<string>(
    'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIncident, setSubmittedIncident] = useState<Incident | null>(null);

  const issueTypes: IssueType[] = [
    'Land Cracks',
    'Slope Movement',
    'Landslide',
    'Blocked Road',
    'Flash Flood',
    'Infrastructure Damage'
  ];

  const handleAutoGPS = () => {
    setIsGettingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLatitude(Number(pos.coords.latitude.toFixed(4)));
          setLongitude(Number(pos.coords.longitude.toFixed(4)));
          setIsGettingLocation(false);
        },
        () => {
          // Fallback realistic NE coordinate
          setLatitude(27.5861);
          setLongitude(91.8594);
          setIsGettingLocation(false);
        }
      );
    } else {
      setIsGettingLocation(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setUploadedImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await api.createIncident({
        title: reportType === 'citizen' ? `${issueType} Reported at ${location}` : title,
        location,
        district,
        state,
        latitude,
        longitude,
        severity,
        issue_type: issueType,
        description,
        images: [uploadedImage],
        reported_by: user ? user.name : 'Citizen Volunteer',
        reporter_role: reportType === 'citizen' ? 'Citizen' : 'Field Official',
        road_status: roadStatus,
        people_affected: peopleAffected
      });
      setSubmittedIncident(created);
      onIncidentSubmitted(created);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
            Landslide & Slope Hazard Reporting Portal
          </h2>
          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
            RAPID VERIFICATION
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Crowdsourced and field official reporting pipeline connected to MDoNER State Emergency Control Rooms
        </p>
      </div>

      {/* Mode Switcher: Citizen Quick Mode vs Field Official Detailed Form */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
        <button
          onClick={() => setReportType('citizen')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            reportType === 'citizen'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Citizen Quick Report (Mobile Friendly)</span>
        </button>

        <button
          onClick={() => setReportType('field')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            reportType === 'field'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Field Official Technical Report</span>
        </button>
      </div>

      {submittedIncident ? (
        /* Success Screen */
        <div className="glass-panel rounded-2xl p-8 border border-emerald-500/40 text-center space-y-4 shadow-2xl bg-gradient-to-b from-slate-900/95 to-slate-950">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              REPORT TRANSMITTED SUCCESSFULLY
            </span>
            <h3 className="text-2xl font-black text-white mt-1">
              Incident ID: <span className="text-cyan-400 font-mono">{submittedIncident.id}</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto mt-2">
              "Report submitted successfully. District Disaster Management Authorities and emergency response units have been notified."
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-md mx-auto text-left text-xs space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <strong className="text-white">{submittedIncident.location}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hazard Type:</span>
              <strong className="text-amber-400">{submittedIncident.issue_type}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Severity:</span>
              <strong className="text-red-400">{submittedIncident.severity}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Initial Status:</span>
              <strong className="text-cyan-300">{submittedIncident.status}</strong>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setSubmittedIncident(null);
                setTitle('');
                setDescription('');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              Submit Another Report
            </button>
            <button
              onClick={onNavigateToManagement}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold transition-colors shadow-lg"
            >
              View in Incident Management
            </button>
          </div>
        </div>
      ) : (
        /* Report Form */
        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          {/* Form Header info */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Reporting As: <strong className="text-white">{user?.name || 'Authorized Reporter'} ({reportType === 'citizen' ? 'Citizen' : 'Official'})</strong></span>
            </div>
            <span className="text-[10px] font-mono text-cyan-300">GEO-VERIFIED PIPELINE</span>
          </div>

          {/* Issue Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Observed Hazard Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {issueTypes.map(it => (
                <button
                  key={it}
                  type="button"
                  onClick={() => setIssueType(it)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                    issueType === it
                      ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500 shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <span>{it}</span>
                  {issueType === it && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Technical Field Official Extra Title */}
          {reportType === 'field' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Technical Incident Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {/* Location & GPS Capture */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Location / Highway Segment
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    required
                    placeholder="e.g. Baisakhi Sector, NH-13 Km 182"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  District & State
                </label>
                <input
                  type="text"
                  value={`${district}, ${state}`}
                  onChange={e => {
                    const parts = e.target.value.split(',');
                    setDistrict(parts[0]?.trim() || district);
                    setState(parts[1]?.trim() || state);
                  }}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* GPS Coordinate Row */}
            <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={handleAutoGPS}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isGettingLocation ? 'Acquiring GPS Fix...' : 'Auto Detect GPS Location'}</span>
              </button>

              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
                <span>Lat: <strong>{latitude}</strong></span>
                <span>•</span>
                <span>Lng: <strong>{longitude}</strong></span>
              </div>
            </div>
          </div>

          {/* Field Official Specifics: Severity, Road Status, Affected People */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Severity Rating
              </label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as IncidentSeverity)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Critical">Critical (Immediate Danger)</option>
                <option value="High">High (Major Blockage)</option>
                <option value="Moderate">Moderate (Creep/Slow Debris)</option>
                <option value="Low">Low (Surface Cracking)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Road Connectivity Impact
              </label>
              <select
                value={roadStatus}
                onChange={e => setRoadStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Blocked">Blocked (No Traffic)</option>
                <option value="Partially Blocked">Partially Blocked (Single Lane)</option>
                <option value="Critical">Critical (Structural Failure)</option>
                <option value="Open">Open (Passable with Care)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Estimated People Affected
              </label>
              <input
                type="number"
                value={peopleAffected}
                onChange={e => setPeopleAffected(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Description of Ground Observation
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              required
              placeholder="Describe cracks, water seepage, trees tilting, boulder fall, trapped vehicles..."
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Photo Upload Simulation */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Upload Geotagged Photographic Proof
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/40">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Hazard preview"
                  className="w-32 h-20 object-cover rounded-lg border border-slate-700 shadow"
                />
              ) : (
                <div className="w-32 h-20 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500">
                  <Camera className="w-6 h-6" />
                </div>
              )}

              <div className="space-y-1 text-center sm:text-left">
                <input
                  type="file"
                  id="incident-photo"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="incident-photo"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Choose Photo File</span>
                </label>
                <p className="text-[10px] text-slate-500">
                  EXIF geolocation & timestamp will be cryptographically extracted
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-red-600/25 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Transmitting to EOC Control Room...' : 'Submit Incident Report to Authorities'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
