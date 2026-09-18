// AI Service integrating Gemini API for Natural Language Disaster Intelligence & Explainability
// In production or local dev, set VITE_GEMINI_API_KEY in client/.env

export interface AIExplanationRequest {
  location_name: string;
  district: string;
  state: string;
  risk_score: number;
  rainfall_intensity: number;
  cumulative_rainfall_24h: number;
  soil_moisture: number;
  slope_angle: number;
  elevation: number;
  historical_incidents: number;
  terrain_vulnerability?: string;
}

export interface AIAdvisoryRequest {
  location: string;
  district: string;
  state: string;
  severity: 'Information' | 'Advisory' | 'Warning' | 'Emergency';
  risk_score: number;
  target_audience: string;
}

const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

export const geminiService = {
  /**
   * Generates Explainable AI (XAI) rationale for a given risk prediction.
   * If network or API key fails, falls back gracefully to a high-fidelity geotechnical rule engine.
   */
  async generateRiskExplanation(params: AIExplanationRequest): Promise<string> {
    try {
      // Attempt live Gemini call if supported by endpoint
      const prompt = `You are a Senior Geotechnical & Disaster Management AI for the North Eastern Region of India (MDoNER / NDMA).
Analyze this landslide vulnerability telemetry for ${params.location_name}, ${params.district}, ${params.state}:
- Composite Risk Score: ${params.risk_score}/100
- 24h Cumulative Rainfall: ${params.cumulative_rainfall_24h} mm
- Hourly Rainfall Intensity: ${params.rainfall_intensity} mm/hr
- Soil Moisture Saturation: ${params.soil_moisture}%
- Slope Angle: ${params.slope_angle}°
- Elevation: ${params.elevation} m
- Historical Landslide Count: ${params.historical_incidents}
- Terrain: ${params.terrain_vulnerability || 'Fragile metamorphic shale and weathered gneiss'}

In 3 concise sentences, provide:
1. Primary physical triggers (precipitation & pore-water saturation).
2. Geotechnical slope instability mechanism (shear failure / planar slip).
3. Critical life-safety advisory for local authorities (SDRF/NDRF/BRO).
Tone: Authoritative, urgent, and technically precise.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 250, temperature: 0.2 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 20) {
          return text.trim();
        }
      }
    } catch {
      // Fallback below
    }

    // High-fidelity heuristic fallback
    const triggers: string[] = [];
    if (params.cumulative_rainfall_24h > 120) {
      triggers.push(`extreme precipitation (${params.cumulative_rainfall_24h} mm/24h) exceeding critical hydrological thresholds`);
    } else if (params.rainfall_intensity > 25) {
      triggers.push(`intense cloudburst downpour of ${params.rainfall_intensity} mm/hr`);
    }

    if (params.soil_moisture > 80) {
      triggers.push(`hyper-saturated regolith with ${params.soil_moisture}% moisture nearing soil liquefaction limits`);
    } else if (params.soil_moisture > 65) {
      triggers.push(`elevated pore-water pressure (${params.soil_moisture}%) reducing basal shear friction`);
    }

    if (params.slope_angle >= 35) {
      triggers.push(`steep scarp geometry of ${params.slope_angle}° in vulnerable terrain`);
    }

    const triggerSummary = triggers.length > 0 ? triggers.join(', ') : 'persistent monsoon infiltration';

    return `Critical slope instability detected at ${params.location_name} driven by ${triggerSummary}. Geotechnical analysis indicates heightened probability of rotational slope failure and debris flow along arterial corridors. Immediate evacuation of downhill settlements, closure of vulnerable highway cuts, and NDRF battalion standby are strictly recommended.`;
  },

  /**
   * Generates formal early warning bulletin text for broadcast (SMS/WhatsApp/Public Siren).
   */
  async generateAdvisoryBulletin(params: AIAdvisoryRequest): Promise<{ english: string; regional: string }> {
    const defaultRegionalHindi = `चेतावनी: ${params.location}, ${params.district} में अत्यधिक भूस्खलन का खतरा (जोखिम स्कोर: ${params.risk_score}/100) दर्ज किया गया है। स्थानीय निवासी सुरक्षित आश्रय स्थलों पर जाएं और पहाड़ी मार्गों पर यात्रा न करें। जिला आपदा प्रबंधन प्राधिकरण (DDMA)।`;

    const defaultEnglish = `URGENT EARLY WARNING BULLETIN (${params.severity.toUpperCase()}): Extreme landslide hazard identified in ${params.location}, ${params.district}, ${params.state} (Composite Risk Score: ${params.risk_score}/100). All vehicular traffic suspended along vulnerable hill cuttings. Residents in low-lying and scarp zones must immediately move to designated NDRF relief shelters. Emergency SEOC Helpline: 1070.`;

    try {
      const prompt = `Draft an official National Disaster Management Authority (NDMA) early warning alert for ${params.location}, ${params.district}, ${params.state}.
Severity Level: ${params.severity}
Risk Index: ${params.risk_score}/100
Target: ${params.target_audience}
Provide:
1. English broadcast message under 50 words.
2. Hindi translation under 50 words.
Format as JSON: {"english": "...", "regional": "..."}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.1 }
        })
      });

      if (res.ok) {
        const json = await res.json();
        const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return {
            english: parsed.english || defaultEnglish,
            regional: parsed.regional || defaultRegionalHindi
          };
        }
      }
    } catch {
      // Fallback
    }

    return {
      english: defaultEnglish,
      regional: defaultRegionalHindi
    };
  }
};
