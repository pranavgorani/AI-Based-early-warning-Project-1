import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Incident, IssueType, IncidentSeverity } from '../types';
import { api } from '../services/api';
import {
  FilePlus2,
  Camera,
  Video,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Upload,
  UserCheck,
  Smartphone,
  Shield,
  Send,
  Navigation,
  Clock,
  WifiOff,
  Radio,
  FileCheck,
  Sparkles,
  Bot,
  AlertOctagon
} from 'lucide-react';
import { geminiService, AITriageResult } from '../services/geminiService';

interface IncidentReportingPageProps {
  onIncidentSubmitted: (inc: Incident) => void;
  onNavigateToManagement: () => void;
  isOnlineMode?: boolean;
}

export const IncidentReportingPage: React.FC<IncidentReportingPageProps> = ({
  onIncidentSubmitted,
  onNavigateToManagement,
  isOnlineMode = true
}) => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState<'citizen' | 'field'>(
    user?.role === 'Citizen' ? 'citizen' : 'field'
  );

  // Form Fields
  const [title, setTitle] = useState('Ground Subsidence & Slope Creep Observed');
  const [location, setLocation] = useState('Baisakhi Sector Km 182, Tawang Road');
  const [district, setDistrict] = useState('Tawang');
  const [state, setState] = useState('Arunachal Pradesh');
  const [latitude, setLatitude] = useState(27.5861);
  const [longitude, setLongitude] = useState(91.8594);
  const [issueType, setIssueType] = useState<IssueType>('Landslide');
  const [severity, setSeverity] = useState<IncidentSeverity>('High');
  const [description, setDescription] = useState(
    'Noticed severe ground fracturing and rapid boulder displacement blocking half the highway width following monsoon downpour.'
  );
  const [roadStatus, setRoadStatus] = useState<'Open' | 'Partially Blocked' | 'Blocked' | 'Critical'>('Blocked');
  const [peopleAffected, setPeopleAffected] = useState(120);

  // Media simulation state
  const [uploadedImage, setUploadedImage] = useState<string>(
    'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'
  );
  const [uploadedVideoName, setUploadedVideoName] = useState<string | null>('slope_crack_footage_2026.mp4');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIncident, setSubmittedIncident] = useState<Incident | null>(null);

  // Field Officer specific states
  const [fieldOfficerNotes, setFieldOfficerNotes] = useState(
    'Initial geotechnical assessment confirms active planar slip along 38° scarp cut. Road clearance earthmovers required immediately.'
  );
  const [verifiedByOfficer, setVerifiedByOfficer] = useState(true);
  const [aiTriage, setAiTriage] = useState<AITriageResult | null>(null);
  const [isAnalyzingTriage, setIsAnalyzingTriage] = useState(false);

  // Gemini Vision Verification State (Requirement 8)
  const [visionVerification, setVisionVerification] = useState<any>(null);
  const [isVerifyingVision, setIsVerifyingVision] = useState(false);

  const handleVerifyImageWithVision = async (imgData?: string) => {
    const targetImg = imgData || uploadedImage;
    if (!targetImg) return;
    setIsVerifyingVision(true);
    try {
      const res = await api.verifyReport(targetImg);
      setVisionVerification(res);
      if (res.severity) {
        // Map to valid severity
        const s = res.severity;
        if (s === 'Critical' || s === 'High' || s === 'Moderate' || s === 'Low') {
          setSeverity(s);
        } else if (s === 'Severe') {
          setSeverity('Critical');
        }
      }
      if (res.damageType && res.damageType.includes('road')) {
        setRoadStatus('Blocked');
      }
    } catch (err) {
      console.error('Vision verification failed:', err);
    } finally {
      setIsVerifyingVision(false);
    }
  };

  const handleRunAiTriage = async () => {
    setIsAnalyzingTriage(true);
    try {
      const res = await geminiService.analyzeIncidentTriage({
        title,
        description: description || 'Severe landslide and ground rupture observed on slope cut.',
        location: location || 'Arterial Corridor',
        district: district || 'East District',
        state: state || 'Meghalaya',
        reportedSeverity: severity,
        casualtiesReported: peopleAffected,
        roadBlocked: roadStatus === 'Blocked'
      });
      setAiTriage(res);
    } catch {
      // Handled
    } finally {
      setIsAnalyzingTriage(false);
    }
  };

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
          // Fallback realistic NE coordinates (Tawang / Cherrapunji)
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

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedVideoName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 5-digit number padded format: NER-INC-2026-00452
      const randomFive = Math.floor(10000 + Math.random() * 90000);
      const generatedId = `NER-INC-2026-${randomFive}`;

      const incidentPayload: Partial<Incident> = {
        id: generatedId,
        title: reportType === 'citizen' ? `${issueType} Reported at ${location}` : title,
        location,
        district,
        state,
        latitude,
        longitude,
        severity,
        issue_type: issueType,
        description: reportType === 'field' ? `${description} [Field Inspection Note: ${fieldOfficerNotes}]` : description,
        images: [uploadedImage],
        reported_by: user ? user.name : reportType === 'citizen' ? 'Citizen Volunteer' : 'Field Geotechnical Inspector',
        reporter_role: reportType === 'citizen' ? 'Citizen' : 'Field Official',
        status: reportType === 'field' && verifiedByOfficer ? 'Verified' : 'Pending Verification',
        road_status: roadStatus,
        people_affected: peopleAffected
      };

      const created = await api.createIncident(incidentPayload);

      // Also queue to local offline storage if offline
      if (!isOnlineMode) {
        try {
          const queue = JSON.parse(localStorage.getItem('nerwatch_offline_queue') || '[]');
          queue.push({
            ...created,
            queued_at: new Date().toISOString(),
            sync_status: 'pending'
          });
          localStorage.setItem('nerwatch_offline_queue', JSON.stringify(queue));
        } catch (err) {
          console.warn('Queue save error:', err);
        }
      }

      setSubmittedIncident(created);
      onIncidentSubmitted(created);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400">
            <FilePlus2 className="w-5 h-5" />
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-['Outfit']">
            Mobile & Field Reporting Portal
          </h2>
          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            PHASE 4 DUAL-MODE
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Crowdsourced Citizen reporting and verified Field Officer hazard verification connected directly to MDoNER State Emergency Operations Centers (SEOC)
        </p>
      </div>

      {/* Mode Switcher: Citizen Quick Mode vs Field Official Mode */}
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
          <span>Citizen Quick Report (Mobile First)</span>
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
          <span>Field Official Mode (Verification & Roads)</span>
        </button>
      </div>

      {submittedIncident ? (
        /* ========================================================================= */
        /* Exact Success Message & Generated Incident ID (Phase 4 Requirement) */
        /* ========================================================================= */
        <div className="glass-panel rounded-2xl p-8 border border-emerald-500/40 text-center space-y-5 shadow-2xl bg-gradient-to-b from-slate-900/95 to-slate-950">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
              REPORT TRANSMITTED SUCCESSFULLY
            </span>
            <h3 className="text-2xl font-black text-white font-mono">
              Incident ID: <span className="text-cyan-400">{submittedIncident.id}</span>
            </h3>
            <p className="text-sm font-semibold text-slate-200 max-w-lg mx-auto mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 leading-relaxed">
              "Your report has been submitted successfully and forwarded to the nearest disaster management authority."
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-md mx-auto text-left text-xs space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <strong className="text-white">{submittedIncident.location}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hazard Observed:</span>
              <strong className="text-amber-400">{submittedIncident.issue_type}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Severity Tier:</span>
              <strong className="text-red-400">{submittedIncident.severity}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Road Status:</span>
              <strong className="text-cyan-300">{submittedIncident.road_status}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Verification Status:</span>
              <span className="text-emerald-400 font-bold">{submittedIncident.status}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={() => {
                setSubmittedIncident(null);
                setTitle('Ground Subsidence & Slope Creep Observed');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              Submit Another Report
            </button>
            <button
              onClick={onNavigateToManagement}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-colors shadow-lg shadow-cyan-500/25"
            >
              View in Incident Management Pipeline
            </button>
          </div>
        </div>
      ) : (
        /* Report Form */
        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Reporting Mode: <strong className="text-white">{reportType === 'citizen' ? 'Citizen Public Form' : 'Field Officer Technical Inspection'}</strong></span>
            </div>
            <span className="text-[10px] font-mono text-cyan-300">
              {isOnlineMode ? '● ONLINE TRANSMISSION' : '⚠ OFFLINE STORAGE QUEUE'}
            </span>
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

          {/* Technical Title for Field Official */}
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

          {/* Photo & Video Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Upload Photo */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                Upload Photo Evidence
              </label>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
                {uploadedImage && (
                  <img
                    src={uploadedImage}
                    alt="Hazard Preview"
                    className="w-full h-28 object-cover rounded-lg border border-slate-700"
                  />
                )}
                <div className="flex items-center justify-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Photo</span>
                    <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                  </label>
                  {uploadedImage && (
                    <button
                      type="button"
                      onClick={() => handleVerifyImageWithVision()}
                      disabled={isVerifyingVision}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isVerifyingVision ? 'animate-spin' : ''}`} />
                      <span>{isVerifyingVision ? 'Verifying...' : 'Verify with Vision AI'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Video */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-cyan-400" />
                Upload Video Footage
              </label>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2 flex flex-col justify-center min-h-[140px]">
                {uploadedVideoName ? (
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 space-y-1">
                    <span className="text-cyan-400 font-bold block truncate">🎬 {uploadedVideoName}</span>
                    <span className="text-[10px] text-emerald-400">Captured (1080p, 18s slope slip clip)</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No video selected</p>
                )}
                <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors">
                  <Video className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Record / Upload Video</span>
                  <input type="file" accept="video/*" onChange={handleVideoFileChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Gemini Vision Structured Assessment Card (Requirement 8) */}
          {visionVerification && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Gemini Vision Hazard Verification Matrix
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    visionVerification.verified
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {visionVerification.verified ? 'GENUINE LANDSLIDE VERIFIED' : 'UNVERIFIED HAZARD'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Confidence: {visionVerification.confidence}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Assessed Severity</span>
                  <span className="text-xs font-black text-amber-300">{visionVerification.severity}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Identified Damage Type</span>
                  <span className="text-xs font-black text-cyan-300">{visionVerification.damageType}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Human Review Status</span>
                  <span className="text-xs font-bold text-red-400">Mandatory (Safety Protocol)</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <strong className="text-white block mb-0.5">Vision AI Finding:</strong>
                {visionVerification.description}
              </p>
            </div>
          )}

          {/* Location & Auto GPS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Location Details & Auto GPS
              </label>
              <button
                type="button"
                onClick={handleAutoGPS}
                disabled={isGettingLocation}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <Navigation className={`w-3.5 h-3.5 ${isGettingLocation ? 'animate-spin' : ''}`} />
                <span>{isGettingLocation ? 'Detecting GPS...' : 'Auto GPS Location'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Specific Landmark / Highway Milestone"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  placeholder="District"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono text-slate-400">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                Latitude: <strong className="text-white">{latitude} N</strong>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                Longitude: <strong className="text-white">{longitude} E</strong>
              </div>
            </div>
          </div>

          {/* Severity & Road Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Estimated Severity
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Low', 'Moderate', 'High', 'Critical'] as IncidentSeverity[]).map(sev => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      severity === sev
                        ? sev === 'Critical' ? 'bg-red-500 text-white border-red-400 shadow-md' :
                          sev === 'High' ? 'bg-orange-500 text-white border-orange-400 shadow-md' :
                          sev === 'Moderate' ? 'bg-amber-500 text-slate-950 border-amber-400' :
                          'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Highway / Road Status
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Open', 'Partially Blocked', 'Blocked'] as const).map(rs => (
                  <button
                    key={rs}
                    type="button"
                    onClick={() => setRoadStatus(rs)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      roadStatus === rs
                        ? rs === 'Blocked' ? 'bg-red-600 text-white border-red-500' :
                          rs === 'Partially Blocked' ? 'bg-amber-600 text-white border-amber-500' :
                          'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {rs}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Detailed Ground Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Field Official Extra Section */}
          {reportType === 'field' && (
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/40 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-blue-300">
                <span className="flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4" />
                  Field Official Verification & Action Dispatch
                </span>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={verifiedByOfficer}
                    onChange={e => setVerifiedByOfficer(e.target.checked)}
                    className="rounded text-cyan-500 bg-slate-900"
                  />
                  <span>Mark as Verified On-Site</span>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Geological Inspection Findings
                </label>
                <input
                  type="text"
                  value={fieldOfficerNotes}
                  onChange={e => setFieldOfficerNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* AI Instant Triage & Damage Assessment (Powered by Gemini 2.5 Flash) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  Gemini 2.5 Flash Hazard Triage
                </span>
              </div>
              <button
                type="button"
                onClick={handleRunAiTriage}
                disabled={isAnalyzingTriage}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {isAnalyzingTriage ? (
                  <>
                    <Bot className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Triage...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI Triage Assessment</span>
                  </>
                )}
              </button>
            </div>

            {aiTriage ? (
              <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Assessed Threat:</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      aiTriage.assessedSeverity === 'Critical' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                      aiTriage.assessedSeverity === 'High' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {aiTriage.assessedSeverity} Hazard
                    </span>
                  </div>
                  <span className="text-cyan-400 font-mono text-[11px]">
                    AI Confidence: {aiTriage.confidenceScore}%
                  </span>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1 font-semibold">Immediate Tactical Protocol:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-200">
                    {aiTriage.immediateActions.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="text-slate-400 mr-1">Recommended Units:</span>
                  {aiTriage.recommendedUnits.map((u, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-200 border border-blue-700/50 text-[10px] font-mono">
                      {u}
                    </span>
                  ))}
                </div>

                <p className="text-[11px] text-cyan-300/90 italic bg-cyan-950/20 p-2 rounded border border-cyan-900/40">
                  "{aiTriage.publicAdvisory}"
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">
                Click <strong className="text-cyan-300">Run AI Triage Assessment</strong> to evaluate shear hazard, verify road cut severity, and generate instant dispatch recommendations before transmission.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>
              {isSubmitting
                ? 'Transmitting Hazard Report...'
                : reportType === 'citizen'
                ? 'Submit Citizen Hazard Report'
                : 'Transmit Verified Official Report'}
            </span>
          </button>
        </form>
      )}
    </div>
  );
};
