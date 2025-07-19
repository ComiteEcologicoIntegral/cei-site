
import mockdata from './sensor_indexes_response_sample.json'
import { fetchBackendAPI, fetchAPIV2 } from "./api";

export function getSystemSensors (system_name) {
  return fetchBackendAPI(`/system/${system_name}/sensors`);
}

export async function getSystemSensorsMetadata(system_name) {
  return fetchAPIV2('/sensors', {system: system_name});
}

export async function getSensorIndexes(sensor_id) {
  // TODO: Return real api call response once the endpoint is complete
  // return fetchAPIV2(`/sensors/{sensor_id}/indexes`);
  return {
    ok: true,
    async json() {
      return mockdata
    }
  }
}
