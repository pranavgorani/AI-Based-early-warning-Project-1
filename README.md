# 🏔️ NER-WATCH AI | Early Warning & Landslide Risk Monitoring System
### Ministry of Development of North Eastern Region (MDoNER) | Disaster Management

> **"Predict. Monitor. Warn. Protect."**  
> An enterprise-grade, full-stack, AI-powered real-time landslide prediction, early warning, and disaster risk management platform for the 8 North Eastern States of India (Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Sikkim, Tripura).

---

## 📌 Problem Statement & Objectives
- **Target Organization**: Ministry of Development of North Eastern Region (MDoNER)
- **Theme**: Disaster Management
- **Key Objective**: Develop an AI-driven, multi-modal geotechnical and meteorological early warning platform for district administrations, disaster management officers (DDMO / SDMA), field officials, and citizens to mitigate loss of life and critical infrastructure damage caused by recurring monsoon landslides.

---

## 🚀 Key Features & Highlights

1. **Interactive Leaflet GIS Risk Map**
   - High-resolution spatial mapping of all 8 North Eastern States.
   - Dynamic color-coded hazard heat zones: **Low (Green)**, **Moderate (Yellow)**, **High (Orange)**, **Critical (Red)**.
   - Real-time layers: Active Incidents, IoT Telemetry Sensors, Blocked Lifeline Highways (NH-13, NH-10, NH-27, SH-5), Relief Shelters, and Medical Hubs.
   - Base tile switching: Dark GIS, Esri World Satellite, and Topographic views.

2. **Explainable AI (XAI) Engine ("Why This Area Is at Risk")**
   - Click any hotspot to trigger an explainable scientific breakdown decomposing:
     - 24-hr cumulative rainfall & cloudburst intensity thresholds
     - Soil moisture saturation percentage
     - Digital Elevation Model (DEM) slope steepness
     - Historical recurrence count from Geological Survey of India (GSI)
     - Immediate recommended preventive actions and evacuation guidelines.

3. **Physics-Informed AI Risk Scoring Formula**
   - Multi-variate mathematical scoring model:
     $$\text{Risk Score} = 0.30 \times \text{Rainfall} + 0.20 \times \text{Soil Moisture} + 0.20 \times \text{Slope} + 0.15 \times \text{Historical} + 0.10 \times \text{Terrain} + 0.05 \times \text{Forecast}$$
   - Real-time interactive simulation form to test custom rainfall (mm/hr), soil saturation (%), and slope angles (°).

4. **Multi-Agency Emergency Coordination & Priority Queue**
   - Automated priority queue ranking incidents by population affected, road accessibility, and risk level.
   - Live tracking of tactical units: **NDRF 12th Bn**, **SDRF Units**, **BRO Swastik Excavators**, and **IAF Air Wings**.
   - One-click multi-channel CAP alert broadcaster simulating SMS, Mobile Push, WhatsApp, and Local Sirens.

5. **Crowdsourced Citizen & Field Official Reporting**
   - **Citizen Quick Mode**: Mobile-first report with automatic GPS acquisition, photo upload, and instant unique Incident ID (`NER-INC-2026-XXXXX`).
   - **Field Official Mode**: Technical geotechnical survey, crack depth measurements, road status, and casualty assessments.

6. **Weather Intelligence & IMD Radar Integration**
   - Real-time hyetograph curves, 24-hr precipitation trends, and 7-day comparative analysis against 30-year monsoon baselines.
   - Radar telemetry integration architecture for Mohanbari, Agartala, Guwahati, and Cherrapunji DWR stations.

7. **Multilingual Localization**
   - Full translation support for **English** and **Hindi (हिन्दी)**, with interface architecture for **Assamese (অসমীয়া)**, **Bengali (বাংলা)**, **Khasi**, **Mizo**, **Manipuri (মৈতৈলোন্)**, and **Nepali (नेपाली)**.

---

## 🔑 Demo Login Credentials (1-Click Switcher Available on Login Page)

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@nerwatch.gov.in` | `admin123` | Full root access, user provisioning, threshold configuration |
| **District Officer** | `officer@nerwatch.gov.in` | `officer123` | Regional alerts, priority queue, evacuation orders |
| **Field Official** | `field@nerwatch.gov.in` | `field123` | Geological logs, road inspection, sensor calibration |
| **Citizen** | `citizen@nerwatch.gov.in` | `citizen123` | Public hazard report submission, SMS alerts, public maps |

---

## 💻 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Leaflet.js, Recharts, Lucide React Icons.
- **Backend**: Node.js, Express.js REST API, in-memory store with LocalStorage syncing & PWA resilience.
- **Database Model**: PostgreSQL / Supabase schema (Users, Locations, Sensors, Incidents, Alerts, Roads, EmergencyTeams).
- **APIs**:
  - `POST /api/auth/login`
  - `GET /api/locations`
  - `GET /api/sensors`, `POST /api/sensors`, `PUT /api/sensors/:id`
  - `POST /api/predictions` (Live AI risk calculation)
  - `GET /api/incidents`, `POST /api/incidents`, `PUT /api/incidents/:id`
  - `GET /api/alerts`, `POST /api/alerts` (CAP broadcast)
  - `GET /api/roads`, `PUT /api/roads/:id`
  - `GET /api/analytics/summary`

---

## 🛠️ Quick Start Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Run Backend Server
```bash
cd server
npm install
npm run dev
# Server starts on http://localhost:5000
```

### Run Frontend Client
```bash
cd client
npm install
npm run dev
# Web application starts on http://localhost:3000
```

Open your browser at **`http://localhost:3000`**.
