import { apiUrl, APIV2URL } from "../constants";

export async function fetchBackendAPI(url, queryParams = {}, options = {}) {
  return fetchAPI(apiUrl, url, queryParams, options)
}

export async function fetchAPIV2(url, queryParams = {}, options = {}) {
  return fetchAPI(APIV2URL, url, queryParams, options)
}

async function fetchAPI(domain, url, queryParams = {}, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${domain}${url}${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }

  try {
    return response.json();
  } catch (error) {
    console.log('Error:', error);
    return response.text();
  }
}

