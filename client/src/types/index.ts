export type UserRole = 'Super Admin' | 'District Administration' | 'Disaster Management Officer' | 'Field Official' | 'Citizen';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  district: string;
  state: string;
  designation?: string;
  phone?: string;
  created_at: string;
}

export type RiskLevel = 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk';

export interface LocationData {
  id: string;
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  elevation: number;
  slope_angle: number;
  soil_type: string;
  risk_level: RiskLevel;
  risk_score: number;
  rainfall_24h: number;
  soil_moisture_pct: number;
  population_at_risk: number;
  historical_incidents: number;
  last_updated: string;
  why_at_risk?: string[];
  recommended_action?: string;
}

export type SensorType = 'Soil Moisture Sensor' | 'Rain Gauge' | 'Ground Movement Sensor' | 'Tilt Sensor' | 'Vibration Sensor';

export interface SensorData {
  id: string;
  sensor_type: SensorType;
  location_id: string;
  location_name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  status: 'Online' | 'Offline' | 'Warning';
  battery_level: number;
  current_reading: number;
  unit: string;
  alert_threshold: number;
  last_updated: string;
}

export interface RiskPrediction {
  id: string;
  location_id: string;
  location_name: string;
  district: string;
  state: string;
  risk_score: number;
  risk_category: RiskLevel;
  probability: number;
  rainfall_intensity: number;
  cumulative_rainfall_24h: number;
  soil_moisture: number;
  slope_angle: number;
  elevation: number;
  contributing_factors: string[];
  recommended_action: string;
  time_window: string;
  created_at: string;
}

export type IncidentSeverity = 'Low' | 'Moderate' | 'High' | 'Critical';
export type IncidentStatus = 'Pending Verification' | 'Verified' | 'Under Investigation' | 'Response Initiated' | 'Resolved';
export type IssueType = 'Land Cracks' | 'Slope Movement' | 'Landslide' | 'Blocked Road' | 'Flash Flood' | 'Infrastructure Damage';

export interface Incident {
  id: string;
  title: string;
  location: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  severity: IncidentSeverity;
  issue_type: IssueType;
  description: string;
  images: string[];
  reported_by: string;
  reporter_role: string;
  status: IncidentStatus;
  assigned_officer?: string;
  road_status: 'Open' | 'Partially Blocked' | 'Blocked' | 'Critical';
  people_affected: number;
  created_at: string;
}

export type AlertSeverity = 'Information' | 'Advisory' | 'Warning' | 'Emergency';
export type AlertType = 'Landslide Risk Alert' | 'Heavy Rainfall Warning' | 'Road Blockage Alert' | 'Sensor Failure' | 'Evacuation Advisory';

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  alert_type: AlertType;
  location: string;
  district: string;
  state: string;
  target_users: string;
  channels: ('SMS' | 'Mobile Push' | 'Email' | 'WhatsApp' | 'Local Siren')[];
  status: 'Active' | 'Acknowledged' | 'Resolved';
  recommended_action: string;
  created_at: string;
}

export interface Road {
  id: string;
  road_name: string;
  highway_no: string;
  district: string;
  state: string;
  start_point: string;
  end_point: string;
  status: 'Open' | 'Partially Blocked' | 'Blocked' | 'Critical';
  risk_level: RiskLevel;
  blockage_cause?: string;
  estimated_clearance_time?: string;
  alternate_route?: string;
  last_inspection: string;
}

export interface EmergencyTeam {
  id: string;
  name: string;
  type: 'NDRF Battalion' | 'SDRF Unit' | 'QRT Medical' | 'Heavy Earthmovers' | 'Helicopter Air Wing';
  base_location: string;
  district: string;
  state: string;
  status: 'Available' | 'Deployed' | 'Standby' | 'En Route';
  personnel_count: number;
  vehicles: string;
  assigned_incident_id?: string;
  eta_minutes: number;
  contact_number: string;
}

export interface AnalyticsSummary {
  kpis: {
    activeHighRiskZones: number;
    criticalAlerts: number;
    monitoredSensors: number;
    affectedRoads: number;
    rainfallRiskIndex: number;
    predictionConfidence: number;
  };
  stateRiskDistribution: {
    state: string;
    low: number;
    moderate: number;
    high: number;
    critical: number;
  }[];
  monthlyIncidents: {
    month: string;
    incidents: number;
    rainfall_avg: number;
  }[];
  rainfallVsLandslideCorrelation: {
    rainfall: number;
    incidents: number;
    soil_moisture: number;
  }[];
  sensorBreakdown: {
    total: number;
    online: number;
    warning: number;
    offline: number;
  };
}
