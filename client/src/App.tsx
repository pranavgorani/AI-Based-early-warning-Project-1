import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { api } from './services/api';
import { LocationData, SensorData, Incident, Alert, Road, EmergencyTeam, AnalyticsSummary, RiskPrediction } from './types';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ExplainabilityModal } from './components/ExplainabilityModal';
import { BroadcastAlertModal } from './components/BroadcastAlertModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { CommandCenter } from './pages/CommandCenter';
import { LiveRiskMapPage } from './pages/LiveRiskMapPage';
import { AIPredictionsPage } from './pages/AIPredictionsPage';
import { RainfallWeatherPage } from './pages/RainfallWeatherPage';
import { SensorMonitoringPage } from './pages/SensorMonitoringPage';
import { IncidentReportingPage } from './pages/IncidentReportingPage';
import { IncidentManagementPage } from './pages/IncidentManagementPage';
import { RoadConnectivityPage } from './pages/RoadConnectivityPage';
import { AlertsCenterPage } from './pages/AlertsCenterPage';
import { EmergencyResponsePage } from './pages/EmergencyResponsePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { SystemArchitecturePage } from './pages/SystemArchitecturePage';
import { DataIntegrationPage } from './pages/DataIntegrationPage';
import { OfflineSyncPage } from './pages/OfflineSyncPage';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Data Store
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [roads, setRoads] = useState<Road[]>([]);
  const [emergencyTeams, setEmergencyTeams] = useState<EmergencyTeam[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [predictions, setPredictions] = useState<RiskPrediction[]>([]);

  // Offline Architecture State
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(3);

  // Periodic Live Sensor Telemetry Loop (Phase 1 & 2 real-time integration)
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prevSensors =>
        prevSensors.map(s => {
          if (s.status === 'Offline') return s;
          const delta = (Math.random() - 0.48) * 1.5;
          const newReading = Math.min(99, Math.max(15, Math.round((s.current_reading || 50) + delta)));
          return {
            ...s,
            current_reading: newReading,
            last_updated: 'Just now'
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Modals
  const [explainabilityLocation, setExplainabilityLocation] = useState<LocationData | null>(null);
  const [broadcastTargetLocation, setBroadcastTargetLocation] = useState<LocationData | null>(null);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState<boolean>(false);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locs, sens, incs, alts, rds, teams, anl] = await Promise.all([
          api.getLocations(),
          api.getSensors(),
          api.getIncidents(),
          api.getAlerts(),
          api.getRoads(),
          api.getEmergencyTeams(),
          api.getAnalyticsSummary()
        ]);
        setLocations(locs);
        setSensors(sens);
        setIncidents(incs);
        setAlerts(alts);
        setRoads(rds);
        setEmergencyTeams(teams);
        setAnalytics(anl);
      } catch (err) {
        console.error('Data load error:', err);
      }
    };
    fetchData();
  }, []);

  // Filter locations if state selected in Navbar
  const displayedLocations = selectedState === 'All States'
    ? locations
    : locations.filter(l => l.state.toLowerCase() === selectedState.toLowerCase());

  const activeAlertsCount = alerts.filter(a => a.status === 'Active').length;
  const pendingIncidentsCount = incidents.filter(i => i.status === 'Pending Verification').length;

  const handleOpenBroadcast = (loc?: LocationData) => {
    setBroadcastTargetLocation(loc || null);
    setIsBroadcastModalOpen(true);
  };

  const handleAlertBroadcasted = (newAlert: Alert) => {
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleIncidentSubmitted = (newInc: Incident) => {
    setIncidents(prev => [newInc, ...prev]);
    if (!isOnline) {
      setOfflineQueueCount(prev => prev + 1);
    }
  };

  // Render Page Content
  const renderContent = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage
            onLaunchDashboard={() => setCurrentPage('dashboard')}
            onExploreMap={() => setCurrentPage('live-map')}
            onLoginClick={() => setCurrentPage('login')}
            onReportIncident={() => setCurrentPage('incident-report')}
          />
        );

      case 'login':
        return (
          <LoginPage
            onSuccess={() => setCurrentPage('dashboard')}
            onBackToHome={() => setCurrentPage('landing')}
          />
        );

      case 'dashboard':
        return (
          <CommandCenter
            locations={displayedLocations}
            sensors={sensors}
            incidents={incidents}
            alerts={alerts}
            roads={roads}
            analytics={analytics}
            onOpenExplainability={loc => setExplainabilityLocation(loc)}
            onOpenBroadcast={loc => handleOpenBroadcast(loc)}
            onNavigate={page => setCurrentPage(page)}
          />
        );

      case 'live-map':
        return (
          <LiveRiskMapPage
            locations={displayedLocations}
            sensors={sensors}
            incidents={incidents}
            roads={roads}
            onOpenExplainability={loc => setExplainabilityLocation(loc)}
            onOpenBroadcast={loc => handleOpenBroadcast(loc)}
          />
        );

      case 'data-integration':
        return <DataIntegrationPage />;

      case 'offline-sync':
        return (
          <OfflineSyncPage
            isOnline={isOnline}
            onToggleOnline={() => setIsOnline(!isOnline)}
            onNavigate={p => setCurrentPage(p)}
          />
        );

      case 'ai-predictions':
        return (
          <AIPredictionsPage
            predictions={predictions}
            onPredictionAdded={pred => {
              setPredictions(prev => [pred, ...prev]);
              setLocations(prev => [
                {
                  id: pred.location_id,
                  name: pred.location_name,
                  district: pred.district,
                  state: pred.state,
                  latitude: 27.58 + (Math.random() - 0.5) * 0.3,
                  longitude: 91.86 + (Math.random() - 0.5) * 0.3,
                  elevation: pred.elevation,
                  slope_angle: pred.slope_angle,
                  soil_type: 'Fragile Moraine / Regolith',
                  risk_level: pred.risk_category,
                  risk_score: pred.risk_score,
                  rainfall_24h: pred.cumulative_rainfall_24h,
                  soil_moisture_pct: pred.soil_moisture,
                  population_at_risk: 14200,
                  historical_incidents: 16,
                  last_updated: 'Just now',
                  why_at_risk: pred.contributing_factors,
                  recommended_action: pred.recommended_action
                },
                ...prev
              ]);
            }}
          />
        );

      case 'weather':
        return <RainfallWeatherPage />;

      case 'sensors':
        return (
          <SensorMonitoringPage
            sensors={sensors}
            onSensorUpdated={updated => {
              setSensors(prev => prev.map(s => s.id === updated.id ? updated : s));
            }}
            onSensorAdded={newS => {
              setSensors(prev => [newS, ...prev]);
            }}
          />
        );

      case 'incident-report':
        return (
          <IncidentReportingPage
            onIncidentSubmitted={handleIncidentSubmitted}
            onNavigateToManagement={() => setCurrentPage('incident-management')}
            isOnlineMode={isOnline}
          />
        );

      case 'incident-management':
        return (
          <IncidentManagementPage
            incidents={incidents}
            onIncidentUpdated={updated => {
              setIncidents(prev => prev.map(i => i.id === updated.id ? updated : i));
            }}
            onOpenEmergencyResponse={() => setCurrentPage('emergency-response')}
          />
        );

      case 'road-connectivity':
        return (
          <RoadConnectivityPage
            roads={roads}
            onRoadUpdated={updated => {
              setRoads(prev => prev.map(r => r.id === updated.id ? updated : r));
            }}
          />
        );

      case 'alerts':
        return (
          <AlertsCenterPage
            alerts={alerts}
            onAlertUpdated={updated => {
              setAlerts(prev => prev.map(a => a.id === updated.id ? updated : a));
            }}
            onOpenBroadcast={() => handleOpenBroadcast()}
          />
        );

      case 'emergency-response':
        return (
          <EmergencyResponsePage
            incidents={incidents}
            emergencyTeams={emergencyTeams}
            onTeamUpdated={updated => {
              setEmergencyTeams(prev => prev.map(t => t.id === updated.id ? updated : t));
            }}
            onOpenBroadcast={() => handleOpenBroadcast()}
          />
        );

      case 'analytics':
        return <AnalyticsPage analytics={analytics} />;

      case 'user-management':
        return <UserManagementPage />;

      case 'architecture':
        return <SystemArchitecturePage />;

      default:
        return (
          <CommandCenter
            locations={displayedLocations}
            sensors={sensors}
            incidents={incidents}
            alerts={alerts}
            roads={roads}
            analytics={analytics}
            onOpenExplainability={loc => setExplainabilityLocation(loc)}
            onOpenBroadcast={loc => handleOpenBroadcast(loc)}
            onNavigate={page => setCurrentPage(page)}
          />
        );
    }
  };

  // If on Landing or Login page, render full screen without dashboard shell
  if (currentPage === 'landing' || currentPage === 'login') {
    return (
      <div className="min-h-screen bg-[#071324]">
        {renderContent()}
      </div>
    );
  }

  // Dashboard Shell
  return (
    <div className="min-h-screen bg-[#071324] flex flex-col">
      <Navbar
        selectedState={selectedState}
        onSelectState={st => setSelectedState(st)}
        searchQuery={searchQuery}
        onSearchChange={q => setSearchQuery(q)}
        alerts={alerts}
        onOpenAlerts={() => setCurrentPage('alerts')}
        onNavigate={p => setCurrentPage(p)}
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
        offlineCount={offlineQueueCount}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentPage={currentPage}
          onNavigate={p => setCurrentPage(p)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeAlertsCount={activeAlertsCount}
          pendingIncidentsCount={pendingIncidentsCount}
        />

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 bg-[#071324]">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Explainable AI Modal */}
      {explainabilityLocation && (
        <ExplainabilityModal
          location={explainabilityLocation}
          onClose={() => setExplainabilityLocation(null)}
          onBroadcastAlert={loc => {
            setExplainabilityLocation(null);
            handleOpenBroadcast(loc);
          }}
          onDispatchTeam={() => {
            setExplainabilityLocation(null);
            setCurrentPage('emergency-response');
          }}
        />
      )}

      {/* Broadcast Alert Modal */}
      {isBroadcastModalOpen && (
        <BroadcastAlertModal
          location={broadcastTargetLocation}
          onClose={() => setIsBroadcastModalOpen(false)}
          onAlertBroadcasted={handleAlertBroadcasted}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
