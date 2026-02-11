import { apiUrl, APIV2URL } from "../constants";

async function fetchApi(domain, url, queryParams = {}, options = {}, headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }) {
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${domain}${url}${queryString ? `?${queryString}` : ""}`;
  // const headers = {
  //   "Content-Type": "application/json",
  //   ...(options.headers || {}),
  // };

  return await fetch(fullUrl, {
    ...options,
    headers,
  });
}

async function fetchCSVEndpoint(domain, url, queryParams = {}, options = {}) {
  const headers = {};
  return fetchApi(domain, url, queryParams, options, headers)

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

function getFilenameFromContentDisposition(disposition) {
  if (!disposition) return null;

  const filenameStarMatch = /filename\*\s*=\s*([^']*)''([^;]+)\s*/i.exec(disposition);
  if (filenameStarMatch && filenameStarMatch[2]) {
    try {
      const raw = filenameStarMatch[2].replace(/^"(.*)"$/, "$1");
      return decodeURIComponent(raw);
    } catch {
      throw new Error("Failed to extract filename")
    }
  }

  // Try classic filename="..."; allow quoted or unquoted
  const filenameMatch = /filename\s*=\s*("?)([^";]+)\1/i.exec(disposition);
  if (filenameMatch && filenameMatch[2]) {
    // Trim quotes/whitespace
    return filenameMatch[2].trim().replace(/[/\\?%*:|"<>]/g, "_"); // sanitize for safety
  }

  return null;
}

async function requestCSV(domain, path, queryParams = {}, options = {}) {
  const response = await fetchCSVEndpoint(domain, path, queryParams, options);
  if (!response.ok) {
    throw new Error("Failed to download CSV");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;

  const disposition = response.headers.get("content-disposition");

  a.download = getFilenameFromContentDisposition(disposition) || "data.csv";
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
