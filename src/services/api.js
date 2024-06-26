export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://aire.comiteecologicointegral.org/api"
    : "http://127.0.0.1:8000";

export async function fetchBackendAPI(url,  queryParams = {}, options = {}) {
  console.log("url", url)
  console.log("queryParams", queryParams)
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = `${BASE_URL}${url}${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }

  return response.json();
}
