import {
  User,
  LocationData,
  SensorData,
  Incident,
  Alert,
  Road,
  EmergencyTeam,
  RiskPrediction,
  AnalyticsSummary
} from '../types';

// Fallback seed data in case backend is offline
import {
  initialUsers,
  initialLocations,
  initialSensors,
  initialIncidents,
  initialAlerts,
  initialRoads,
  initialEmergencyTeams,
  initialPredictions
} from '../data/seedData';

const BASE_URL = '/api';

// Helper for local storage persistence when backend is offline
const getStorage = <T>(key: string, defaultVal: T): T => {
  try {
    const saved = localStorage.getItem(`nerwatch_${key}`);
    return saved ? JSON.parse(saved) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setStorage = <T>(key: string, val: T): void => {
  try {
    localStorage.setItem(`nerwatch_${key}`, JSON.stringify(val));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
};

// Network status listener
export let isOnline = navigator.onLine;
window.addEventListener('online', () => { isOnline = true; });
window.addEventListener('offline', () => { isOnline = false; });

export const api = {
  // Auth
  login: async (email: string, password?: string, role?: string): Promise<{ token: string; user: User }> => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      if (res.ok) return await res.json();
    } catch {
      // Offline fallback
    }
    const found = initialUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      return { token: 'mock-token-' + found.id, user: found };
    }
    const fallbackUser: User = {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0].toUpperCase(),
      email,
      role: (role as any) || 'Citizen',
      district: 'Kamrup',
      state: 'Assam',
      created_at: new Date().toISOString()
    };
    return { token: 'mock-token-' + fallbackUser.id, user: fallbackUser };
  },

  // Locations
  getLocations: async (state?: string, district?: string): Promise<LocationData[]> => {
    try {
      const params = new URLSearchParams();
      if (state && state !== 'All States') params.append('state', state);
      if (district && district !== 'All Districts') params.append('district', district);
      const res = await fetch(`${BASE_URL}/locations?${params.toString()}`);
      if (res.ok) return await res.json();
    } catch {
      // Offline fallback
    }
    let list = getStorage<LocationData[]>('locations', initialLocations);
    if (state && state !== 'All States') {
      list = list.filter(l => l.state.toLowerCase() === state.toLowerCase());
    }
    if (district && district !== 'All Districts') {
      list = list.filter(l => l.district.toLowerCase() === district.toLowerCase());
    }
    return list;
  },

  // Sensors
  getSensors: async (): Promise<SensorData[]> => {
    try {
      const res = await fetch(`${BASE_URL}/sensors`);
      if (res.ok) return await res.json();
    } catch {}
    return getStorage<SensorData[]>('sensors', initialSensors);
  },

  createSensor: async (sensor: Partial<SensorData>): Promise<SensorData> => {
    try {
      const res = await fetch(`${BASE_URL}/sensors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sensor)
      });
      if (res.ok) return await res.json();
    } catch {}
    const newSensor: SensorData = {
      id: `SN-${Date.now().toString().slice(-4)}`,
      sensor_type: sensor.sensor_type || 'Soil Moisture Sensor',
      location_id: sensor.location_id || 'loc-1',
      location_name: sensor.location_name || 'Assigned Zone',
      district: sensor.district || 'Kamrup',
      state: sensor.state || 'Assam',
      latitude: sensor.latitude || 26.2,
      longitude: sensor.longitude || 92.9,
      status: 'Online',
      battery_level: 100,
      current_reading: sensor.current_reading || 45,
      unit: sensor.unit || '%',
      alert_threshold: sensor.alert_threshold || 75,
      last_updated: 'Just now'
    };
    const list = getStorage<SensorData[]>('sensors', initialSensors);
    list.unshift(newSensor);
    setStorage('sensors', list);
    return newSensor;
  },

  updateSensor: async (id: string, updates: Partial<SensorData>): Promise<SensorData> => {
    try {
      const res = await fetch(`${BASE_URL}/sensors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch {}
    const list = getStorage<SensorData[]>('sensors', initialSensors);
    const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates, last_updated: 'Just now' };
      setStorage('sensors', list);
      return list[idx];
    }
    throw new Error('Sensor not found');
  },

  // Incidents
  getIncidents: async (): Promise<Incident[]> => {
    try {
      const res = await fetch(`${BASE_URL}/incidents`);
      if (res.ok) return await res.json();
    } catch {}
    return getStorage<Incident[]>('incidents', initialIncidents);
  },

  createIncident: async (incident: Partial<Incident>): Promise<Incident> => {
    try {
      const res = await fetch(`${BASE_URL}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incident)
      });
      if (res.ok) return await res.json();
    } catch {}
    const newInc: Incident = {
      id: `NER-INC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      title: incident.title || 'Slope Anomaly Report',
      location: incident.location || 'Reported Ridge',
      district: incident.district || 'Tawang',
      state: incident.state || 'Arunachal Pradesh',
      latitude: incident.latitude || 27.58,
      longitude: incident.longitude || 91.86,
      severity: incident.severity || 'High',
      issue_type: incident.issue_type || 'Landslide',
      description: incident.description || 'Observed ground cracks and mudflow.',
      images: incident.images || ['https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'],
      reported_by: incident.reported_by || 'Field Observer',
      reporter_role: incident.reporter_role || 'Citizen',
      status: 'Pending Verification',
      assigned_officer: incident.assigned_officer || 'Unassigned',
      road_status: incident.road_status || 'Partially Blocked',
      people_affected: incident.people_affected || 0,
      created_at: new Date().toISOString()
    };
    const list = getStorage<Incident[]>('incidents', initialIncidents);
    list.unshift(newInc);
    setStorage('incidents', list);
    return newInc;
  },

  updateIncident: async (id: string, updates: Partial<Incident>): Promise<Incident> => {
    try {
      const res = await fetch(`${BASE_URL}/incidents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch {}
    const list = getStorage<Incident[]>('incidents', initialIncidents);
    const idx = list.findIndex(i => i.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      setStorage('incidents', list);
      return list[idx];
    }
    throw new Error('Incident not found');
  },

  // Alerts
  getAlerts: async (): Promise<Alert[]> => {
    try {
      const res = await fetch(`${BASE_URL}/alerts`);
      if (res.ok) return await res.json();
    } catch {}
    return getStorage<Alert[]>('alerts', initialAlerts);
  },

  broadcastAlert: async (alert: Partial<Alert>): Promise<Alert> => {
    try {
      const res = await fetch(`${BASE_URL}/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      });
      if (res.ok) return await res.json();
    } catch {}
    const newAlt: Alert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      title: alert.title || 'Emergency Landslide Broadcast',
      message: alert.message || 'Urgent risk alert issued for specified zone.',
      severity: alert.severity || 'Emergency',
      alert_type: alert.alert_type || 'Landslide Risk Alert',
      location: alert.location || 'North Eastern Sector',
      district: alert.district || 'All Districts',
      state: alert.state || 'NER',
      target_users: alert.target_users || 'Authorities and Public',
      channels: alert.channels || ['SMS', 'Mobile Push', 'WhatsApp'],
      status: 'Active',
      recommended_action: alert.recommended_action || 'Follow immediate evacuation protocols.',
      created_at: new Date().toISOString()
    };
    const list = getStorage<Alert[]>('alerts', initialAlerts);
    list.unshift(newAlt);
    setStorage('alerts', list);
    return newAlt;
  },

  updateAlert: async (id: string, updates: Partial<Alert>): Promise<Alert> => {
    try {
      const res = await fetch(`${BASE_URL}/alerts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch {}
    const list = getStorage<Alert[]>('alerts', initialAlerts);
    const idx = list.findIndex(a => a.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      setStorage('alerts', list);
      return list[idx];
    }
    throw new Error('Alert not found');
  },

  // Roads
  getRoads: async (): Promise<Road[]> => {
    try {
      const res = await fetch(`${BASE_URL}/roads`);
      if (res.ok) return await res.json();
    } catch {}
    return getStorage<Road[]>('roads', initialRoads);
  },

  updateRoad: async (id: string, updates: Partial<Road>): Promise<Road> => {
    try {
      const res = await fetch(`${BASE_URL}/roads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch {}
    const list = getStorage<Road[]>('roads', initialRoads);
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates, last_inspection: 'Just now' };
      setStorage('roads', list);
      return list[idx];
    }
    throw new Error('Road not found');
  },

  // Emergency Teams
  getEmergencyTeams: async (): Promise<EmergencyTeam[]> => {
    try {
      const res = await fetch(`${BASE_URL}/emergency-teams`);
      if (res.ok) return await res.json();
    } catch {}
    return getStorage<EmergencyTeam[]>('emergencyTeams', initialEmergencyTeams);
  },

  updateEmergencyTeam: async (id: string, updates: Partial<EmergencyTeam>): Promise<EmergencyTeam> => {
    try {
      const res = await fetch(`${BASE_URL}/emergency-teams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch {}
    const list = getStorage<EmergencyTeam[]>('emergencyTeams', initialEmergencyTeams);
    const idx = list.findIndex(t => t.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      setStorage('emergencyTeams', list);
      return list[idx];
    }
    throw new Error('Team not found');
  },

  // AI Predictions
  getPredictions: async (): Promise<RiskPrediction[]> => {
    try {
      const res = await fetch(`${BASE_URL}/predictions`);
      if (res.ok) return await res.json();
    } catch {}
    return getStorage<RiskPrediction[]>('predictions', initialPredictions);
  },

  runPrediction: async (params: {
    state: string;
    district: string;
    location_name?: string;
    rainfall_intensity: number;
    cumulative_rainfall_24h: number;
    soil_moisture: number;
    slope_angle: number;
    elevation: number;
    historical_incidents: number;
  }): Promise<RiskPrediction> => {
    try {
      const res = await fetch(`${BASE_URL}/predictions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) return await res.json();
    } catch {}

    // Offline simulation calculation matching the required formula:
    // Risk Score = Rainfall (30%) + Soil Moisture (20%) + Slope (20%) + Historical (15%) + Terrain (10%) + Weather Forecast (5%)
    const rainfallNorm = Math.min(100, (params.cumulative_rainfall_24h / 150) * 70 + (params.rainfall_intensity / 40) * 30);
    const moistureNorm = Math.min(100, Math.max(0, params.soil_moisture));
    const slopeNorm = Math.min(100, (params.slope_angle / 45) * 100);
    const histNorm = Math.min(100, (params.historical_incidents / 25) * 100);
    const terrainNorm = 65;
    const forecastNorm = Math.min(100, rainfallNorm * 0.9 + 10);

    const rawScore =
      rainfallNorm * 0.30 +
      moistureNorm * 0.20 +
      slopeNorm * 0.20 +
      histNorm * 0.15 +
      terrainNorm * 0.10 +
      forecastNorm * 0.05;

    const score = Math.round(Math.min(100, Math.max(0, rawScore)));
    let category: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk' = 'Low Risk';
    let time_window = 'Beyond 48 Hours';

    if (score >= 76) {
      category = 'Critical Risk';
      time_window = 'Next 3-6 Hours';
    } else if (score >= 51) {
      category = 'High Risk';
      time_window = 'Next 12-24 Hours';
    } else if (score >= 26) {
      category = 'Moderate Risk';
      time_window = 'Next 24-48 Hours';
    }

    const factors: string[] = [];
    if (params.cumulative_rainfall_24h > 90) factors.push(`High 24h precipitation: ${params.cumulative_rainfall_24h}mm`);
    if (params.soil_moisture > 70) factors.push(`Critical soil saturation: ${params.soil_moisture}%`);
    if (params.slope_angle > 30) factors.push(`Steep topography: ${params.slope_angle}° angle`);
    if (params.historical_incidents > 5) factors.push(`Past landslide frequency: ${params.historical_incidents} events`);
    if (factors.length === 0) factors.push('Normal environmental parameters detected');

    const newPred: RiskPrediction = {
      id: `prd-${Date.now()}`,
      location_id: `loc-${Date.now()}`,
      location_name: params.location_name || `${params.district} Hill Section`,
      district: params.district,
      state: params.state,
      risk_score: score,
      risk_category: category,
      probability: Math.round(Math.min(99, score * 0.95 + 4)),
      rainfall_intensity: params.rainfall_intensity,
      cumulative_rainfall_24h: params.cumulative_rainfall_24h,
      soil_moisture: params.soil_moisture,
      slope_angle: params.slope_angle,
      elevation: params.elevation,
      contributing_factors: factors,
      recommended_action:
        category === 'Critical Risk'
          ? 'Sound Red Alert, evacuate vulnerable dwellings, halt arterial road traffic.'
          : category === 'High Risk'
          ? 'Place emergency response teams on standby and notify DDMO.'
          : 'Standard monitoring advised.',
      time_window,
      created_at: new Date().toISOString()
    };

    const list = getStorage<RiskPrediction[]>('predictions', initialPredictions);
    list.unshift(newPred);
    setStorage('predictions', list);
    return newPred;
  },

  // Analytics Summary
  getAnalyticsSummary: async (): Promise<AnalyticsSummary> => {
    try {
      const res = await fetch(`${BASE_URL}/analytics/summary`);
      if (res.ok) return await res.json();
    } catch {}

    return {
      kpis: {
        activeHighRiskZones: 24,
        criticalAlerts: 7,
        monitoredSensors: 1248,
        affectedRoads: 18,
        rainfallRiskIndex: 78,
        predictionConfidence: 94.2
      },
      stateRiskDistribution: [
        { state: 'Assam', low: 12, moderate: 18, high: 8, critical: 3 },
        { state: 'Arunachal Pradesh', low: 8, moderate: 14, high: 19, critical: 12 },
        { state: 'Meghalaya', low: 5, moderate: 9, high: 14, critical: 9 },
        { state: 'Manipur', low: 11, moderate: 16, high: 7, critical: 2 },
        { state: 'Mizoram', low: 7, moderate: 15, high: 11, critical: 4 },
        { state: 'Nagaland', low: 9, moderate: 12, high: 9, critical: 3 },
        { state: 'Sikkim', low: 4, moderate: 8, high: 16, critical: 11 },
        { state: 'Tripura', low: 15, moderate: 10, high: 3, critical: 1 },
      ],
      monthlyIncidents: [
        { month: 'Apr', incidents: 14, rainfall_avg: 120 },
        { month: 'May', incidents: 28, rainfall_avg: 210 },
        { month: 'Jun', incidents: 84, rainfall_avg: 480 },
        { month: 'Jul', incidents: 132, rainfall_avg: 640 },
        { month: 'Aug', incidents: 110, rainfall_avg: 590 },
        { month: 'Sep (Live)', incidents: 64, rainfall_avg: 380 },
      ],
      rainfallVsLandslideCorrelation: [
        { rainfall: 45, incidents: 2, soil_moisture: 40 },
        { rainfall: 75, incidents: 5, soil_moisture: 55 },
        { rainfall: 110, incidents: 12, soil_moisture: 70 },
        { rainfall: 145, incidents: 22, soil_moisture: 82 },
        { rainfall: 180, incidents: 38, soil_moisture: 88 },
        { rainfall: 220, incidents: 54, soil_moisture: 94 },
      ],
      sensorBreakdown: {
        total: 1248,
        online: 1190,
        warning: 42,
        offline: 16
      }
    };
  }
};
