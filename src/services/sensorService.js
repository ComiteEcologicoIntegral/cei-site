
import { fetchBackendAPI, fetchNewBackendAPI } from "./api";

export function getSystemSensors (system_name) {
  return fetchBackendAPI(`/system/${system_name}/sensors`);
}

export async function getSystemSensorsMetadata(system_name) {
  return fetchNewBackendAPI('/sensors', {system: system_name});
}
