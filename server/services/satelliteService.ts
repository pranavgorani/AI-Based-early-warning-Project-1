// Satellite Data Abstraction Layer (ISRO / Sentinel / Landsat Change Detection)

export interface SatelliteChangeIndicator {
  sectorId: string;
  sectorName: string;
  state: string;
  latitude: number;
  longitude: number;
  satelliteSource: 'ISRO Cartosat-3 (DEMO)' | 'ESA Sentinel-1/2 (DEMO)' | 'USGS Landsat-9 (DEMO)';
  ndviVegetationLossPct: number;
  insarDeformationMmPerMonth: number;
  scarDetected: boolean;
  slopeChangeSeverity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  observationDate: string;
  notes: string;
}

class SatelliteService {
  private indicators: SatelliteChangeIndicator[] = [
    {
      sectorId: 'SAT-SEC-01',
      sectorName: 'Cherrapunji South Scarp',
      state: 'Meghalaya',
      latitude: 25.27,
      longitude: 91.73,
      satelliteSource: 'ESA Sentinel-1/2 (DEMO)',
      ndviVegetationLossPct: 34.2,
      insarDeformationMmPerMonth: 18.5,
      scarDetected: true,
      slopeChangeSeverity: 'CRITICAL',
      observationDate: '2026-09-18',
      notes: 'InSAR phase coherence indicates accelerated line-of-sight downhill displacement following torrential monsoon pulse.'
    },
    {
      sectorId: 'SAT-SEC-02',
      sectorName: 'Sela Tunnel North Approach',
      state: 'Arunachal Pradesh',
      latitude: 27.58,
      longitude: 91.86,
      satelliteSource: 'ISRO Cartosat-3 (DEMO)',
      ndviVegetationLossPct: 22.8,
      insarDeformationMmPerMonth: 12.1,
      scarDetected: true,
      slopeChangeSeverity: 'HIGH',
      observationDate: '2026-09-17',
      notes: 'Optical multispectral scarring visible above cut-and-cover slope retaining wall.'
    },
    {
      sectorId: 'SAT-SEC-03',
      sectorName: 'Aizawl Urban Ridge Sector 4',
      state: 'Mizoram',
      latitude: 23.73,
      longitude: 92.71,
      satelliteSource: 'ESA Sentinel-1/2 (DEMO)',
      ndviVegetationLossPct: 15.0,
      insarDeformationMmPerMonth: 8.4,
      scarDetected: false,
      slopeChangeSeverity: 'MODERATE',
      observationDate: '2026-09-16',
      notes: 'Moderate creep detected across sandstone-shale interbedding zone.'
    }
  ];

  getIndicators(): SatelliteChangeIndicator[] {
    return [...this.indicators];
  }
}

export const satelliteService = new SatelliteService();
