
import { fetchBackendAPI, fetchAPIV2 } from "./api";

export function getSystemSensors (system_name) {
  return fetchBackendAPI(`/system/${system_name}/sensors`);
}

export async function getSystemSensorsMetadata(system_name) {
  return fetchAPIV2('/sensors', {system: system_name});
}
