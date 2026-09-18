import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Shield,
  MapPin,
  Cpu,
  AlertTriangle,
  Layers,
  Radio,
  CloudRain,
  Activity,
  Compass,
  ArrowRight,
  CheckCircle2,
  FileText,
  Users,
  WifiOff,
  Globe,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onExploreMap: () => void;
  onLoginClick: () => void;
  onReportIncident: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onExploreMap,
  onLoginClick,
  onReportIncident
}) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#071324] text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Top Government Strip */}
      <div className="bg-[#0B192C] border-b border-slate-800 px-6 py-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>भारत सरकार | Government of India</span>
          </div>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-cyan-400 font-medium">
            Ministry of Development of North Eastern Region (MDoNER)
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden sm:inline">Smart India Hackathon Edition</span>
          <button
            onClick={onLoginClick}
            className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
          >
            Official Portal Login →
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 px-6 max-w-7xl mx-auto">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>AI-POWERED DISASTER INTELLIGENCE PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-['Outfit']">
              AI-Powered Early Warning & <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                Landslide Risk Monitoring
              </span>
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-slate-300 tracking-wide font-['Outfit']">
              "Predict. Monitor. Warn. Protect."
            </p>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              An intelligent disaster management platform designed to monitor landslide-prone zones across
              India's North Eastern Region using AI, satellite data, weather intelligence, GIS mapping,
              and real-time field reporting.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onLaunchDashboard}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Launch Command Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreMap}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 font-bold text-sm transition-all"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Explore Risk Zones</span>
              </button>

              <button
                onClick={onReportIncident}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 font-bold text-sm transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Report Incident</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden glass-panel-glow p-4 border border-cyan-500/30 shadow-2xl bg-gradient-to-b from-slate-900/90 to-[#071324]">
              {/* Simulated GIS Radar Map Visual */}
              <div className="relative h-80 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
                {/* Radar Grid Circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full border border-cyan-500/20"></div>
                  <div className="w-48 h-48 rounded-full border border-cyan-500/25 absolute"></div>
                  <div className="w-32 h-32 rounded-full border border-cyan-500/30 absolute"></div>
                  <div className="w-16 h-16 rounded-full border border-cyan-500/40 absolute"></div>
                  {/* Radar Sweep Animation */}
                  <div className="absolute inset-0 origin-center animate-radar-sweep pointer-events-none bg-gradient-to-tr from-cyan-500/15 via-transparent to-transparent"></div>
                </div>

                {/* Simulated NER Map Pin Points */}
                <div className="absolute top-12 left-16 flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping absolute"></span>
                  <span className="w-3 h-3 rounded-full bg-red-500 relative"></span>
                  <span className="text-[9px] font-bold text-red-300 bg-slate-900/80 px-1 rounded border border-red-500/30">
                    Tawang (89)
                  </span>
                </div>

                <div className="absolute top-36 left-28 flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-[9px] font-bold text-red-300 bg-slate-900/80 px-1 rounded border border-red-500/30">
                    Sohra (84)
                  </span>
                </div>

                <div className="absolute top-20 right-20 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                  <span className="text-[9px] font-bold text-orange-300 bg-slate-900/80 px-1 rounded border border-orange-500/30">
                    Gangtok (72)
                  </span>
                </div>

                <div className="absolute bottom-16 right-28 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-[9px] font-bold text-amber-300 bg-slate-900/80 px-1 rounded border border-amber-500/30">
                    Kohima (48)
                  </span>
                </div>

                <div className="absolute bottom-8 left-36 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                  <span className="text-[9px] font-bold text-orange-300 bg-slate-900/80 px-1 rounded border border-orange-500/30">
                    Aizawl (68)
                  </span>
                </div>

                {/* Center Badge */}
                <div className="relative z-10 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/50 backdrop-blur-md shadow-lg text-center">
                  <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">LIVE SATELLITE FEED</p>
                  <p className="text-xs font-extrabold text-white">NORTH EAST INDIA REGION</p>
                </div>
              </div>

              {/* Floating Stat Card 1 */}
              <div className="absolute -bottom-4 -left-4 p-3 rounded-xl bg-slate-900/95 border border-red-500/40 shadow-2xl backdrop-blur-md flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                  <AlertTriangle className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Critical Threat Detected</p>
                  <p className="text-xs font-extrabold text-white">NH-13 Sela Corridor (91% Prob)</p>
                </div>
              </div>

              {/* Floating Stat Card 2 */}
              <div className="absolute -top-3 -right-3 p-3 rounded-xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Telemetry Active</p>
                  <p className="text-xs font-extrabold text-cyan-300">1,248 IoT Sensors Online</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key National Statistics Section */}
      <section className="border-y border-slate-800 bg-[#08172c] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-['Outfit']">8</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
                NE States Covered
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">2,450+</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
                Monitored Risk Zones
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-['Outfit']">92%</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
                AI Accuracy Rate
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-['Outfit']">24/7</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
                Real-Time Monitoring
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2 md:col-span-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-purple-400 font-['Outfit']">1,200+</p>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
                Historical Records
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: 4-Step Process */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">OPERATIONAL WORKFLOW</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
            How The Early Warning System Operates
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            From sensor telemetry to rapid emergency mobilization in 4 seamless stages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            {
              step: '01',
              title: 'Data Collection',
              desc: 'Continuous real-time ingestion from IMD Doppler radar, IoT piezometers, inclinometers, GSI geological surveys, and GPS-verified citizen reports.',
              icon: Radio,
              color: 'text-blue-400 border-blue-500/30 bg-blue-500/10'
            },
            {
              step: '02',
              title: 'AI Risk Analysis',
              desc: 'Multi-factor weighted risk modeling fusing rainfall intensity (30%), soil moisture (20%), slope angle (20%), and historical hazard recurrence (15%).',
              icon: Cpu,
              color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
            },
            {
              step: '03',
              title: 'Early Warning Generation',
              desc: 'Autonomous alert generation when threshold limits are breached, transmitting localized warnings via SMS, Mobile Push, WhatsApp, and emergency sirens.',
              icon: AlertTriangle,
              color: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
            },
            {
              step: '04',
              title: 'Emergency Response',
              desc: 'Automated priority queues dispatch NDRF/SDRF rescue teams, guide traffic diversions along mountain highways, and activate designated relief camps.',
              icon: Shield,
              color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 relative group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-slate-700 group-hover:text-cyan-400 transition-colors font-mono">
                    {item.step}
                  </span>
                  <div className={`p-3 rounded-xl border ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-20 px-6 bg-[#081528] border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">CUTTING-EDGE CAPABILITIES</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
              Complete Disaster Management Ecosystem
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Built specifically for the fragile geology, steep terrain, and monsoon conditions of North East India
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'AI Landslide Prediction',
                desc: 'Explainable AI scoring system evaluating slope stability, rainfall saturation, and geological pore-water pressure.',
                icon: Cpu
              },
              {
                title: 'Real-Time GIS Mapping',
                desc: 'High-resolution interactive GIS mapping with color-coded risk heat zones across all 8 North Eastern states.',
                icon: MapPin
              },
              {
                title: 'Rainfall Monitoring',
                desc: '24-hour predictive precipitation curves, cloudburst detection, and IMD Doppler radar integration architecture.',
                icon: CloudRain
              },
              {
                title: 'Soil Moisture Intelligence',
                desc: 'Direct telemetry ingestion from field piezometers and moisture probes warning before critical soil liquefaction.',
                icon: Activity
              },
              {
                title: 'Citizen Reporting',
                desc: 'Mobile-first crowd-sourced hazard reporting with automatic GPS geotagging, photo upload, and instant unique Incident IDs.',
                icon: Users
              },
              {
                title: 'Multi-Channel Alerts',
                desc: 'Simulated dispatch across SMS broadcast, push notifications, WhatsApp alerts, and automated community sirens.',
                icon: Radio
              },
              {
                title: 'Offline Field Operations',
                desc: 'PWA-enabled offline caching and local draft queues designed for remote hill areas with patchy connectivity.',
                icon: WifiOff
              },
              {
                title: 'Multilingual Support',
                desc: 'Emergency bulletins localized in English, Hindi, Assamese, Bengali, Khasi, Mizo, Manipuri, and Nepali.',
                icon: Globe
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#06101E] py-12 px-6 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-sm">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>NER-WATCH AI System</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Developed for the Ministry of Development of North Eastern Region (MDoNER), Government of India.
            </p>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <button onClick={onLaunchDashboard} className="hover:text-cyan-400 transition-colors">Command Center</button>
            <button onClick={onExploreMap} className="hover:text-cyan-400 transition-colors">GIS Risk Map</button>
            <button onClick={onLoginClick} className="hover:text-cyan-400 transition-colors">Role Login</button>
          </div>

          <p className="text-[11px] text-slate-600 font-mono">
            Smart India Hackathon 2026 Prototype
          </p>
        </div>
      </footer>
    </div>
  );
};
