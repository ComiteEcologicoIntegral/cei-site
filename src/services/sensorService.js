
import { fetchBackendAPI } from "./api";

export function getSystemSensors (system_name) {
  return fetchBackendAPI(`/system/${system_name}/sensors`);
}
