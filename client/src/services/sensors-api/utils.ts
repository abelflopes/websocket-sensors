import type { SensorData } from "./types";

export function isSensorData(value: unknown): value is SensorData {
  return (
    typeof value === "object" &&
    value !== null &&
    JSON.stringify(["id", "name", "connected", "unit", "value"]) ===
      JSON.stringify(Object.keys(value))
  );
}
