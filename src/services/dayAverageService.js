import { fetchBackendAPI } from "./api";

export function getMonthAverage(ubic, ind, inicio, fin, norm) {
  return fetchBackendAPI("/prom-data-norms", { ubic, ind, inicio, fin, norm });
}

export async function getDayHourlyData(sensor_id, contaminant, date) {
  return await fetchBackendAPI("/datos-fecha", { sensor_id, contaminant, date });
}
