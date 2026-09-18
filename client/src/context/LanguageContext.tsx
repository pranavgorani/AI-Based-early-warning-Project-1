import React, { createContext, useContext, useState } from 'react';

export type LanguageCode = 'en' | 'hi' | 'as' | 'bn' | 'kha' | 'miz' | 'mni' | 'ne';

export interface LanguageInfo {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'as', label: 'Assamese', nativeLabel: 'অসমীয়া' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'kha', label: 'Khasi', nativeLabel: 'Khasi' },
  { code: 'miz', label: 'Mizo', nativeLabel: 'Mizo' },
  { code: 'mni', label: 'Manipuri', nativeLabel: 'মৈতৈলোন্' },
  { code: 'ne', label: 'Nepali', nativeLabel: 'नेपाली' },
];

const translations: Record<string, Record<string, string>> = {
  en: {
    appTitle: 'NER-WATCH AI',
    appTagline: 'Intelligent Disaster Preparedness for a Resilient Northeast',
    ministry: 'Ministry of Development of North Eastern Region (MDoNER)',
    launchDashboard: 'Launch Command Dashboard',
    exploreRiskZones: 'Explore Live Risk Map',
    dashboard: 'Command Center',
    liveMap: 'Live GIS Risk Map',
    aiPredictions: 'AI Predictions',
    rainfallWeather: 'Rainfall & Weather',
    sensorMonitoring: 'Sensor Intelligence',
    landslideReports: 'Incident Reporting',
    incidentManagement: 'Incident Management',
    roadConnectivity: 'Road & Infrastructure',
    alerts: 'Alerts & Notifications',
    emergencyResponse: 'Emergency Response',
    analytics: 'Analytics & Reports',
    userManagement: 'User Management',
    architecture: 'System Architecture',
    logout: 'Sign Out',
    activeHighRiskZones: 'Active High-Risk Zones',
    criticalAlerts: 'Critical Alerts',
    monitoredSensors: 'Monitored Sensors',
    affectedRoads: 'Affected Roads',
    rainfallRiskIndex: 'Rainfall Risk Index',
    aiPredictionConfidence: 'AI Prediction Confidence',
    whyAtRisk: 'Why This Area Is at Risk',
    runAiPrediction: 'Run AI Prediction',
    submitReport: 'Submit Incident Report',
    offlineMode: 'Offline Mode Active',
    onlineMode: 'Live Telemetry Connected',
    searchPlaceholder: 'Search zones, highways, sensors...',
    alertBanner: 'Heavy rainfall detected. Landslide risk is high in vulnerable hill corridors. Stay alert and avoid steep slopes.'
  },
  hi: {
    appTitle: 'एनईआर-वॉच एआई',
    appTagline: 'एक लचीले पूर्वोत्तर के लिए बुद्धिमान आपदा तैयारी',
    ministry: 'उत्तर पूर्वी क्षेत्र विकास मंत्रालय (MDoNER)',
    launchDashboard: 'कमांड डैशबोर्ड शुरू करें',
    exploreRiskZones: 'लाइव जोखिम मानचित्र देखें',
    dashboard: 'कमांड सेंटर',
    liveMap: 'लाइव जीआईएस जोखिम मानचित्र',
    aiPredictions: 'एआई पूर्वानुमान',
    rainfallWeather: 'वर्षा और मौसम',
    sensorMonitoring: 'सेंसर इंटेलिजेंस',
    landslideReports: 'घटना रिपोर्टिंग',
    incidentManagement: 'घटना प्रबंधन',
    roadConnectivity: 'सड़क व अवसंरचना',
    alerts: 'चेतावनी एवं सूचनाएं',
    emergencyResponse: 'आपातकालीन प्रतिक्रिया',
    analytics: 'एनालिटिक्स व रिपोर्ट',
    userManagement: 'उपयोगकर्ता प्रबंधन',
    architecture: 'सिस्टम वास्तुकला',
    logout: 'साइन आउट',
    activeHighRiskZones: 'सक्रिय उच्च-जोखिम क्षेत्र',
    criticalAlerts: 'गंभीर चेतावनियाँ',
    monitoredSensors: 'निगरानी वाले सेंसर',
    affectedRoads: 'प्रभावित सड़कें',
    rainfallRiskIndex: 'वर्षा जोखिम सूचकांक',
    aiPredictionConfidence: 'एआई पूर्वानुमान सटीकता',
    whyAtRisk: 'यह क्षेत्र जोखिम में क्यों है?',
    runAiPrediction: 'एआई पूर्वानुमान चलाएं',
    submitReport: 'घटना रिपोर्ट दर्ज करें',
    offlineMode: 'ऑफ़लाइन मोड सक्रिय',
    onlineMode: 'लाइव टेलीमेट्री कनेक्टेड',
    searchPlaceholder: 'क्षेत्र, राजमार्ग, सेंसर खोजें...',
    alertBanner: 'भारी वर्षा दर्ज की गई है। आपके क्षेत्र में भूस्खलन का खतरा अधिक है। सतर्क रहें और संवेदनशील ढलानों से बचें।'
  },
  as: {
    appTitle: 'NER-WATCH AI',
    appTagline: 'উত্তৰ-পূবৰ দুৰ্যোগ ব্যৱস্থাপনাৰ এআই মঞ্চ',
    ministry: 'উত্তৰ পূব অঞ্চল উন্নয়ন মন্ত্ৰালয় (MDoNER)',
    launchDashboard: 'কমাণ্ড ডেশ্বব’ৰ্ড খোলক',
    dashboard: 'কমাণ্ড কেন্দ্ৰ',
    liveMap: 'লাইভ জিআইএছ মানচিত্ৰ',
    aiPredictions: 'এআই ভৱিষ্যদ্বাণী',
    alerts: 'সতৰ্কবাৰ্তা',
    alertBanner: 'প্ৰবল বৃষ্টিপাত ধৰা পৰিছে। পাহাৰীয়া অঞ্চলত ভূমিস্খলনৰ আশংকা অতি বেছি। সতৰ্ক থাকক।'
  },
  bn: {
    appTitle: 'NER-WATCH AI',
    appTagline: 'উত্তর-পূর্বাঞ্চলের জন্য দুর্যোগ ব্যবস্থাপনা প্ল্যাটফর্ম',
    ministry: 'উত্তর পূর্বাঞ্চল উন্নয়ন মন্ত্রক (MDoNER)',
    launchDashboard: 'কমান্ড ড্যাশবোর্ড খুলুন',
    dashboard: 'কমান্ড সেন্টার',
    liveMap: 'লাইভ জিআইএস ম্যাপ',
    aiPredictions: 'এআই পূর্বাভাস',
    alerts: 'সতর্কবার্তা',
    alertBanner: 'ভারী বৃষ্টিপাত রেকর্ড করা হয়েছে। পাহাড়ে ভূমিধসের ঝুঁকি খুব বেশি। সতর্ক থাকুন।'
  },
  kha: {
    appTitle: 'NER-WATCH AI',
    appTagline: 'Ka jingiada na ka jingtwa khyndew ha NE',
    ministry: 'Ministry of Development of North Eastern Region (MDoNER)',
    launchDashboard: 'Plie Dashboard',
    dashboard: 'Command Center',
    liveMap: 'Map jingma',
    aiPredictions: 'AI Prediction',
    alerts: 'Jingkyrpad',
    alertBanner: 'Slap jur bha. Ka jingma na ka jingtwa khyndew ka long kaba khraw. Sumar.'
  },
  miz: {
    appTitle: 'NER-WATCH AI',
    appTagline: 'Chhiatrup venhimna atana AI hmang rualrem',
    ministry: 'Ministry of Development of North Eastern Region (MDoNER)',
    launchDashboard: 'Luhna',
    dashboard: 'Command Center',
    liveMap: 'Leimin Map',
    aiPredictions: 'AI Hriattirna',
    alerts: 'Vanhriattirna',
    alertBanner: 'Ruahtui a tlak nasat avangin leimin hlauhawm a sang hle. Fimkhur rawh u.'
  },
  mni: {
    appTitle: 'NER-WATCH AI',
    appTagline: 'অৱাং নোংপোক লমদমগী চীং তেম্বা ঙাকথোকপগী এআই প্লেটফোর্ম',
    ministry: 'MDoNER',
    launchDashboard: 'দেশবোর্দ হাংদোকউ',
    dashboard: 'কমান্ড সেন্তর',
    liveMap: 'জিআইএস মেপ',
    aiPredictions: 'এআই ৱার্নিং',
    alerts: 'চেকশিন ৱার্নিং',
    alertBanner: 'নোং কন্না চূবনা মরম ওইদুনা চীং তেম্বগী অশোইবা লৈ। চেকশিন্না লৈবীয়ু।'
  },
  ne: {
    appTitle: 'NER-WATCH AI',
    appTagline: 'पूर्वोत्तर विपद् व्यवस्थापन र पहिरो पूर्व चेतावनी प्रणाली',
    ministry: 'MDoNER',
    launchDashboard: 'ड्यासबोर्ड खोल्नुहोस्',
    dashboard: 'कमान्ड सेन्टर',
    liveMap: 'प्रत्यक्ष नक्सा',
    aiPredictions: 'एआई भविष्यवाणी',
    alerts: 'सूचना तथा चेतावनी',
    alertBanner: 'अत्यधिक वर्षा भइरहेको छ। पहिरोको उच्च जोखिम छ। सतर्क रहनुहोस्।'
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
