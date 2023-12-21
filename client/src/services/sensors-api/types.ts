export interface SensorData {
  id: string;
  name: string;
  connected: boolean;
  unit: string;
  value: string | null;
}

export interface ConnectServerOptions {
  onConnect?: () => void;
  onSensorData?: (data: SensorData) => void;
}
