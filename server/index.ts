import express, { Request, Response } from 'express';
import cors from 'cors';
import {
  initialUsers,
  initialLocations,
  initialSensors,
  initialIncidents,
  initialAlerts,
  initialRoads,
  initialEmergencyTeams,
  initialPredictions
} from './data/seedData';
import { Incident, SensorData, Alert, Road, EmergencyTeam, RiskPrediction, LocationData } from './types';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory state store initialized with seed data
let users = [...initialUsers];
let locations = [...initialLocations];
let sensors = [...initialSensors];
let incidents = [...initialIncidents];
let alerts = [...initialAlerts];
let roads = [...initialRoads];
let emergencyTeams = [...initialEmergencyTeams];
let predictions = [...initialPredictions];

// Helper: AI Risk Prediction Formula
export function calculateRisk(params: {
  rainfall_intensity: number; // mm/hr (0-100)
  cumulative_rainfall_24h: number; // mm (0-300)
  soil_moisture: number; // % (0-100)
  slope_angle: number; // degrees (0-60)
  historical_incidents: number; // count (0-50)
  elevation?: number;
  soil_type_factor?: number; // 0-100
}): {
  risk_score: number;
  risk_category: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk';
  probability: number;
  contributing_factors: string[];
  recommended_action: string;
  time_window: string;
} {
  const {
    rainfall_intensity,
    cumulative_rainfall_24h,
    soil_moisture,
    slope_angle,
    historical_incidents,
    soil_type_factor = 60
  } = params;

  // Normalized factors (0-100)
  const rainfallNorm = Math.min(100, (cumulative_rainfall_24h / 150) * 70 + (rainfall_intensity / 40) * 30);
  const moistureNorm = Math.min(100, Math.max(0, soil_moisture));
  const slopeNorm = Math.min(100, (slope_angle / 45) * 100);
  const histNorm = Math.min(100, (historical_incidents / 25) * 100);
  const terrainNorm = Math.min(100, soil_type_factor);
  const forecastNorm = Math.min(100, rainfallNorm * 0.9 + 10);

  // Formula:
  // Risk Score = Rainfall (30%) + Soil Moisture (20%) + Slope (20%) + Historical (15%) + Terrain (10%) + Weather Forecast (5%)
  const rawScore =
    rainfallNorm * 0.30 +
    moistureNorm * 0.20 +
    slopeNorm * 0.20 +
    histNorm * 0.15 +
    terrainNorm * 0.10 +
    forecastNorm * 0.05;

  const score = Math.round(Math.min(100, Math.max(0, rawScore)));

  let category: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk';
  let probability = Math.round(Math.min(99, score * 0.95 + 4));
  let time_window = 'Beyond 48 Hours';
  const factors: string[] = [];

  if (score >= 76) {
    category = 'Critical Risk';
    time_window = 'Next 3-6 Hours';
  } else if (score >= 51) {
    category = 'High Risk';
    time_window = 'Next 12-24 Hours';
  } else if (score >= 26) {
    category = 'Moderate Risk';
    time_window = 'Next 24-48 Hours';
  } else {
    category = 'Low Risk';
    time_window = 'Standard Monitoring';
  }

  if (cumulative_rainfall_24h > 100 || rainfall_intensity > 25) {
    factors.push(`Severe rainfall intensity detected (${cumulative_rainfall_24h.toFixed(1)}mm/24h)`);
  }
  if (soil_moisture > 75) {
    factors.push(`Soil saturation reached critical moisture capacity (${soil_moisture}%)`);
  }
  if (slope_angle > 30) {
    factors.push(`Steep slope angle (${slope_angle}°) exceeds structural slip threshold`);
  }
  if (historical_incidents >= 10) {
    factors.push(`High historical recurrence area (${historical_incidents} registered events)`);
  }
  if (factors.length === 0) {
    factors.push('Stable geological conditions with normal drainage capacity');
  }

  let recommended_action = 'Maintain standard sensor surveillance. No immediate evacuation required.';
  if (category === 'Critical Risk') {
    recommended_action = 'Immediate Red Alert evacuation for downhill settlements, suspend transit on arterial highways, and mobilize NDRF/SDRF rapid rescue battalions.';
  } else if (category === 'High Risk') {
    recommended_action = 'Issue High Alert advisory to district authorities, station heavy excavators on vulnerable mountain roads, and inspect slope drainage.';
  } else if (category === 'Moderate Risk') {
    recommended_action = 'Place road maintenance crews on 30-minute standby, monitor soil moisture telemetry every 15 minutes, and issue travel warning.';
  }

  return {
    risk_score: score,
    risk_category: category,
    probability,
    contributing_factors: factors,
    recommended_action,
    time_window
  };
}

// 1. Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'NER-WATCH AI Core API Engine',
    organization: 'Ministry of Development of North Eastern Region (MDoNER)',
    version: '1.0.0',
    active_risk_zones: locations.filter(l => l.risk_score >= 51).length,
    total_sensors: sensors.length,
    timestamp: new Date().toISOString()
  });
});

// 2. Authentication APIs
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  const user = users.find(u => u.email.toLowerCase() === email?.toLowerCase() && u.password === password);

  if (!user) {
    // If not found in seed, create simulated session for demonstration
    const fallbackUser = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role: role || 'Citizen',
      district: 'Kamrup',
      state: 'Assam',
      created_at: new Date().toISOString()
    };
    return res.json({
      token: `mock-jwt-token-${fallbackUser.id}`,
      user: fallbackUser
    });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    token: `mock-jwt-token-${user.id}`,
    user: userWithoutPassword
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, role, district, state, phone } = req.body;
  const newUser = {
    id: `usr-${Date.now()}`,
    name: name || 'Public User',
    email,
    password: password || 'citizen123',
    role: role || 'Citizen',
    district: district || 'Guwahati',
    state: state || 'Assam',
    phone: phone || '+91 90000 00000',
    created_at: new Date().toISOString()
  };
  users.push(newUser);
  const { password: _, ...userSafe } = newUser;
  res.status(201).json({ token: `mock-jwt-token-${newUser.id}`, user: userSafe });
});

// 3. Locations & GIS APIs
app.get('/api/locations', (req: Request, res: Response) => {
  const { state, district, risk_level } = req.query;
  let filtered = [...locations];

  if (state && state !== 'All States') {
    filtered = filtered.filter(l => l.state.toLowerCase() === (state as string).toLowerCase());
  }
  if (district && district !== 'All Districts') {
    filtered = filtered.filter(l => l.district.toLowerCase() === (district as string).toLowerCase());
  }
  if (risk_level && risk_level !== 'All') {
    filtered = filtered.filter(l => l.risk_level === risk_level);
  }

  res.json(filtered);
});

app.get('/api/locations/:id', (req: Request, res: Response) => {
  const location = locations.find(l => l.id === req.params.id);
  if (!location) return res.status(404).json({ error: 'Location not found' });
  res.json(location);
});

// 4. Sensors APIs
app.get('/api/sensors', (req: Request, res: Response) => {
  const { type, status, state } = req.query;
  let result = [...sensors];
  if (type && type !== 'All') result = result.filter(s => s.sensor_type === type);
  if (status && status !== 'All') result = result.filter(s => s.status === status);
  if (state && state !== 'All') result = result.filter(s => s.state === state);
  res.json(result);
});

app.post('/api/sensors', (req: Request, res: Response) => {
  const newSensor: SensorData = {
    id: `SN-${Date.now().toString().slice(-4)}`,
    sensor_type: req.body.sensor_type || 'Soil Moisture Sensor',
    location_id: req.body.location_id || 'loc-1',
    location_name: req.body.location_name || 'Assigned Zone',
    district: req.body.district || 'Kamrup',
    state: req.body.state || 'Assam',
    latitude: req.body.latitude || 26.2,
    longitude: req.body.longitude || 92.9,
    status: 'Online',
    battery_level: 100,
    current_reading: req.body.current_reading || 45,
    unit: req.body.unit || '%',
    alert_threshold: req.body.alert_threshold || 75,
    last_updated: 'Just now'
  };
  sensors.unshift(newSensor);
  res.status(201).json(newSensor);
});

app.put('/api/sensors/:id', (req: Request, res: Response) => {
  const index = sensors.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Sensor not found' });
  sensors[index] = { ...sensors[index], ...req.body, last_updated: 'Just now' };
  res.json(sensors[index]);
});

// 5. Predictions & AI Engine APIs
app.get('/api/predictions', (req: Request, res: Response) => {
  res.json(predictions);
});

app.post('/api/predictions', (req: Request, res: Response) => {
  const {
    location_id,
    location_name,
    district,
    state,
    rainfall_intensity = 25,
    cumulative_rainfall_24h = 80,
    soil_moisture = 70,
    slope_angle = 35,
    elevation = 1200,
    historical_incidents = 8,
    soil_type_factor = 60
  } = req.body;

  const result = calculateRisk({
    rainfall_intensity: Number(rainfall_intensity),
    cumulative_rainfall_24h: Number(cumulative_rainfall_24h),
    soil_moisture: Number(soil_moisture),
    slope_angle: Number(slope_angle),
    historical_incidents: Number(historical_incidents),
    elevation: Number(elevation),
    soil_type_factor: Number(soil_type_factor)
  });

  const newPrediction: RiskPrediction = {
    id: `prd-${Date.now()}`,
    location_id: location_id || `loc-custom-${Date.now()}`,
    location_name: location_name || `${district || 'Hill Ridge'}, ${state || 'NER'}`,
    district: district || 'General District',
    state: state || 'Assam',
    risk_score: result.risk_score,
    risk_category: result.risk_category,
    probability: result.probability,
    rainfall_intensity: Number(rainfall_intensity),
    cumulative_rainfall_24h: Number(cumulative_rainfall_24h),
    soil_moisture: Number(soil_moisture),
    slope_angle: Number(slope_angle),
    elevation: Number(elevation),
    contributing_factors: result.contributing_factors,
    recommended_action: result.recommended_action,
    time_window: result.time_window,
    created_at: new Date().toISOString()
  };

  predictions.unshift(newPrediction);
  res.status(201).json(newPrediction);
});

// 6. Incidents APIs
app.get('/api/incidents', (req: Request, res: Response) => {
  const { status, severity, district, state } = req.query;
  let list = [...incidents];
  if (status && status !== 'All') list = list.filter(i => i.status === status);
  if (severity && severity !== 'All') list = list.filter(i => i.severity === severity);
  if (district && district !== 'All') list = list.filter(i => i.district.toLowerCase() === (district as string).toLowerCase());
  if (state && state !== 'All') list = list.filter(i => i.state.toLowerCase() === (state as string).toLowerCase());
  res.json(list);
});

app.post('/api/incidents', (req: Request, res: Response) => {
  const newIncident: Incident = {
    id: `NER-INC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    title: req.body.title || 'Reported Slope Instability Incident',
    location: req.body.location || 'North Eastern Sector',
    district: req.body.district || 'Tawang',
    state: req.body.state || 'Arunachal Pradesh',
    latitude: req.body.latitude || 27.58,
    longitude: req.body.longitude || 91.86,
    severity: req.body.severity || 'High',
    issue_type: req.body.issue_type || 'Landslide',
    description: req.body.description || 'Reported anomaly and slope creep observed.',
    images: req.body.images && req.body.images.length > 0 ? req.body.images : ['https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'],
    reported_by: req.body.reported_by || 'Field Reporter',
    reporter_role: req.body.reporter_role || 'Citizen',
    status: 'Pending Verification',
    assigned_officer: req.body.assigned_officer || 'Unassigned',
    road_status: req.body.road_status || 'Partially Blocked',
    people_affected: Number(req.body.people_affected) || 0,
    created_at: new Date().toISOString()
  };

  incidents.unshift(newIncident);

  // Automatically generate alert if Critical or High severity
  if (newIncident.severity === 'Critical' || newIncident.severity === 'High') {
    alerts.unshift({
      id: `ALT-${Date.now().toString().slice(-4)}`,
      title: `NEW INCIDENT: ${newIncident.title}`,
      message: `Incident ${newIncident.id} reported at ${newIncident.location} (${newIncident.district}, ${newIncident.state}). Severity: ${newIncident.severity}. Status: ${newIncident.status}.`,
      severity: newIncident.severity === 'Critical' ? 'Emergency' : 'Warning',
      alert_type: 'Landslide Risk Alert',
      location: newIncident.location,
      district: newIncident.district,
      state: newIncident.state,
      target_users: 'District Officials & Emergency Response Teams',
      channels: ['SMS', 'Mobile Push'],
      status: 'Active',
      recommended_action: 'Dispatch field inspection squad and notify DDMO immediately.',
      created_at: new Date().toISOString()
    });
  }

  res.status(201).json(newIncident);
});

app.put('/api/incidents/:id', (req: Request, res: Response) => {
  const index = incidents.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Incident not found' });
  incidents[index] = { ...incidents[index], ...req.body };
  res.json(incidents[index]);
});

// 7. Alerts APIs
app.get('/api/alerts', (req: Request, res: Response) => {
  const { severity, status } = req.query;
  let list = [...alerts];
  if (severity && severity !== 'All') list = list.filter(a => a.severity === severity);
  if (status && status !== 'All') list = list.filter(a => a.status === status);
  res.json(list);
});

app.post('/api/alerts', (req: Request, res: Response) => {
  const newAlert: Alert = {
    id: `ALT-${Date.now().toString().slice(-4)}`,
    title: req.body.title,
    message: req.body.message,
    severity: req.body.severity || 'Warning',
    alert_type: req.body.alert_type || 'Landslide Risk Alert',
    location: req.body.location || 'Regional Zone',
    district: req.body.district || 'All Districts',
    state: req.body.state || 'NER',
    target_users: req.body.target_users || 'Authorities and Public',
    channels: req.body.channels || ['SMS', 'Mobile Push'],
    status: 'Active',
    recommended_action: req.body.recommended_action || 'Follow official SDMA advisories.',
    created_at: new Date().toISOString()
  };
  alerts.unshift(newAlert);
  res.status(201).json(newAlert);
});

app.put('/api/alerts/:id', (req: Request, res: Response) => {
  const index = alerts.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Alert not found' });
  alerts[index] = { ...alerts[index], ...req.body };
  res.json(alerts[index]);
});

// 8. Roads APIs
app.get('/api/roads', (req: Request, res: Response) => {
  const { status, state, district } = req.query;
  let list = [...roads];
  if (status && status !== 'All') list = list.filter(r => r.status === status);
  if (state && state !== 'All') list = list.filter(r => r.state === state);
  if (district && district !== 'All') list = list.filter(r => r.district.toLowerCase() === (district as string).toLowerCase());
  res.json(list);
});

app.put('/api/roads/:id', (req: Request, res: Response) => {
  const index = roads.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Road not found' });
  roads[index] = { ...roads[index], ...req.body, last_inspection: 'Just now' };
  res.json(roads[index]);
});

// 9. Emergency Response Teams APIs
app.get('/api/emergency-teams', (req: Request, res: Response) => {
  res.json(emergencyTeams);
});

app.put('/api/emergency-teams/:id', (req: Request, res: Response) => {
  const index = emergencyTeams.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Team not found' });
  emergencyTeams[index] = { ...emergencyTeams[index], ...req.body };
  res.json(emergencyTeams[index]);
});

// 10. Analytics Summary API
app.get('/api/analytics/summary', (req: Request, res: Response) => {
  const totalZones = locations.length;
  const criticalZones = locations.filter(l => l.risk_level === 'Critical Risk').length;
  const highRiskZones = locations.filter(l => l.risk_level === 'High Risk').length;
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved').length;
  const activeAlerts = alerts.filter(a => a.status === 'Active').length;
  const blockedRoads = roads.filter(r => r.status === 'Blocked' || r.status === 'Critical').length;
  const onlineSensors = sensors.filter(s => s.status === 'Online').length;

  const stateRiskDistribution = [
    { state: 'Assam', low: 12, moderate: 18, high: 8, critical: 3 },
    { state: 'Arunachal Pradesh', low: 8, moderate: 14, high: 19, critical: 12 },
    { state: 'Meghalaya', low: 5, moderate: 9, high: 14, critical: 9 },
    { state: 'Manipur', low: 11, moderate: 16, high: 7, critical: 2 },
    { state: 'Mizoram', low: 7, moderate: 15, high: 11, critical: 4 },
    { state: 'Nagaland', low: 9, moderate: 12, high: 9, critical: 3 },
    { state: 'Sikkim', low: 4, moderate: 8, high: 16, critical: 11 },
    { state: 'Tripura', low: 15, moderate: 10, high: 3, critical: 1 },
  ];

  const monthlyIncidents = [
    { month: 'Apr', incidents: 14, rainfall_avg: 120 },
    { month: 'May', incidents: 28, rainfall_avg: 210 },
    { month: 'Jun', incidents: 84, rainfall_avg: 480 },
    { month: 'Jul', incidents: 132, rainfall_avg: 640 },
    { month: 'Aug', incidents: 110, rainfall_avg: 590 },
    { month: 'Sep (Live)', incidents: 64, rainfall_avg: 380 },
  ];

  const rainfallVsLandslideCorrelation = [
    { rainfall: 45, incidents: 2, soil_moisture: 40 },
    { rainfall: 75, incidents: 5, soil_moisture: 55 },
    { rainfall: 110, incidents: 12, soil_moisture: 70 },
    { rainfall: 145, incidents: 22, soil_moisture: 82 },
    { rainfall: 180, incidents: 38, soil_moisture: 88 },
    { rainfall: 220, incidents: 54, soil_moisture: 94 },
  ];

  res.json({
    kpis: {
      activeHighRiskZones: criticalZones + highRiskZones,
      criticalAlerts: activeAlerts,
      monitoredSensors: sensors.length,
      affectedRoads: blockedRoads,
      rainfallRiskIndex: 78,
      predictionConfidence: 94.2
    },
    stateRiskDistribution,
    monthlyIncidents,
    rainfallVsLandslideCorrelation,
    sensorBreakdown: {
      total: sensors.length,
      online: onlineSensors,
      warning: sensors.filter(s => s.status === 'Warning').length,
      offline: sensors.filter(s => s.status === 'Offline').length
    }
  });
});

app.listen(PORT, () => {
  console.log(`[NER-WATCH AI Server] Running on http://localhost:${PORT}`);
});
