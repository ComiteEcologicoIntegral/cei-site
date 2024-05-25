import { fetchBackendAPI } from "./api";

export async function getMonthAverage(ubic, ind, inicio, fin, norm) {
  return await fetchBackendAPI("/prom-data-norms", { ubic, ind, inicio, fin, norm });
}

export async function getDayHourlyData(ubic, ind, inicio, fin) {
  return await fetchBackendAPI("/datos-fecha", { ubic, ind, inicio, fin });
}
