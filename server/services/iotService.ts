// IoT Sensor Abstraction Layer (Soil Moisture, Rain Gauge, Tilt, Vibration, Temp, Humidity)

export type SensorType =
  | 'soil_moisture'
  | 'rain_gauge'
  | 'tilt_sensor'
  | 'vibration_sensor'
  | 'temperature'
  | 'humidity';

export type SensorHealthStatus = 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE';

export interface NormalizedSensor {
  sensorId: string;
  type: SensorType;
  latitude: number;
  longitude: number;
  value: number;
  unit: string;
  status: SensorHealthStatus;
  batteryPct: number;
  locationName: string;
  district: string;
  state: string;
  timestamp: string;
  anomalyDetected: boolean;
}

class IoTService {
  private sensors: NormalizedSensor[] = [
    {
      sensorId: 'IOT-SM-01',
      type: 'soil_moisture',
      latitude: 25.27,
      longitude: 91.73,
      value: 88,
      unit: '%',
      status: 'CRITICAL',
      batteryPct: 92,
      locationName: 'Cherrapunji Escarpment',
      district: 'East Khasi Hills',
      state: 'Meghalaya',
      timestamp: new Date().toISOString(),
      anomalyDetected: true
    },
    {
      sensorId: 'IOT-TL-02',
      type: 'tilt_sensor',
      latitude: 27.58,
      longitude: 91.86,
      value: 7.4,
      unit: '°',
      status: 'WARNING',
      batteryPct: 88,
      locationName: 'Tawang Sela Ridge',
      district: 'Tawang',
      state: 'Arunachal Pradesh',
      timestamp: new Date().toISOString(),
      anomalyDetected: true
    },
    {
      sensorId: 'IOT-RG-03',
      type: 'rain_gauge',
      latitude: 27.33,
      longitude: 88.61,
      value: 38.4,
      unit: 'mm/hr',
      status: 'WARNING',
      batteryPct: 95,
      locationName: 'Gangtok 9th Mile Cut',
      district: 'Gangtok',
      state: 'Sikkim',
      timestamp: new Date().toISOString(),
      anomalyDetected: false
    },
    {
      sensorId: 'IOT-VB-04',
      type: 'vibration_sensor',
      latitude: 25.17,
      longitude: 93.02,
      value: 12.8,
      unit: 'mm/s',
      status: 'CRITICAL',
      batteryPct: 79,
      locationName: 'Haflong Rail Pass',
      district: 'Dima Hasao',
      state: 'Assam',
      timestamp: new Date().toISOString(),
      anomalyDetected: true
    },
    {
      sensorId: 'IOT-SM-05',
      type: 'soil_moisture',
      latitude: 23.73,
      longitude: 92.71,
      value: 74,
      unit: '%',
      status: 'NORMAL',
      batteryPct: 84,
      locationName: 'Aizawl Laipuitlang',
      district: 'Aizawl',
      state: 'Mizoram',
      timestamp: new Date().toISOString(),
      anomalyDetected: false
    },
    {
      sensorId: 'IOT-SM-06',
      type: 'soil_moisture',
      latitude: 25.67,
      longitude: 94.11,
      value: 0,
      unit: '%',
      status: 'OFFLINE',
      batteryPct: 0,
      locationName: 'Kohima Bypass Curve',
      district: 'Kohima',
      state: 'Nagaland',
      timestamp: new Date().toISOString(),
      anomalyDetected: false
    }
  ];

  getAllSensors(): NormalizedSensor[] {
    return [...this.sensors];
  }

  getAnomalies(): NormalizedSensor[] {
    return this.sensors.filter(s => s.status === 'CRITICAL' || s.status === 'WARNING' || s.anomalyDetected);
  }

  recordReading(reading: Partial<NormalizedSensor>): NormalizedSensor {
    const existingIndex = this.sensors.findIndex(s => s.sensorId === reading.sensorId);
    if (existingIndex >= 0) {
      this.sensors[existingIndex] = {
        ...this.sensors[existingIndex],
        ...reading,
        timestamp: new Date().toISOString()
      };
      return this.sensors[existingIndex];
    }

    const created: NormalizedSensor = {
      sensorId: reading.sensorId || `IOT-${Date.now().toString().slice(-4)}`,
      type: reading.type || 'soil_moisture',
      latitude: reading.latitude || 26.2,
      longitude: reading.longitude || 92.9,
      value: reading.value || 50,
      unit: reading.unit || '%',
      status: reading.status || 'NORMAL',
      batteryPct: reading.batteryPct || 100,
      locationName: reading.locationName || 'Assigned Monitoring Zone',
      district: reading.district || 'Kamrup',
      state: reading.state || 'Assam',
      timestamp: new Date().toISOString(),
      anomalyDetected: Boolean(reading.anomalyDetected)
    };

    this.sensors.unshift(created);
    return created;
  }
}

export const iotService = new IoTService();
