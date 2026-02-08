import { apiUrl, APIV2URL } from "../constants";

async function fetchApi(domain, url, queryParams = {}, options = {}) {
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${domain}${url}${queryString ? `?${queryString}` : ""}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  return await fetch(fullUrl, {
    ...options,
    headers,
  });
}

async function requestJson(domain, url, queryParams = {}, options = {}) {
  const response = await fetchApi(domain, url, queryParams, options)

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "API request failed");
  }

  try {
    return response.json();
  } catch (error) {
    return response.text();
  }
}

async function requestCSV(domain, path, queryParams = {}, options = {}) {
  const response = await fetchApi(domain, path, queryParams, options);
  if (!response.ok) {
    throw new Error("Failed to download CSV");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "data.csv"; // fallback name
  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function fetchBackendAPI(url, queryParams = {}, options = {}) {
  return requestJson(apiUrl, url, queryParams, options);
}

export async function fetchNewBackendApi(url, queryParams = {}, options = {}) {
  return requestJson(APIV2URL, url, queryParams, options);
}

export async function fetchNewBackendApiCsvRes(
  url,
  queryParams = {},
  options = {},
) {
  return requestCSV(APIV2URL, url, queryParams, options);
}
