export interface SimulationInput {
  address: string;
  roof_area: number;
  roof_angle: number;
  floor_area?: number;
}

export interface SimulationOutput {
  estimated_generation: number;
  zeh_judgment: 'good' | 'fair' | 'poor';
  input_summary: SimulationInput;
  details: {
    solar_irradiance: number;
    efficiency_factor: number;
    location: string;
  };
}

export interface SolarIrradianceData {
  location: string;
  annual_irradiance: number;
  prefecture: string;
}