import { fetchBackendAPI } from "./api";

export async function getMonthAverage(ubic, ind, inicio, fin, norm) {
  return await fetchBackendAPI("/prom-data-norms", { ubic, ind, inicio, fin, norm });
}

export async function getDayHourlyData(sensor_id, contaminant, date) {
  return await fetchBackendAPI("/datos-fecha", { sensor_id, contaminant, date });
}
