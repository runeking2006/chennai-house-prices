// api.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export async function fetchMeta() {
  const res = await fetch(`${API_BASE_URL}/meta`);

  if (!res.ok) {
    throw new Error("Failed to load meta");
  }

  return res.json();
}

export async function predictPrice(data) {
  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok && result.error) {
    throw new Error(result.error);
  }

  return result;
}

export async function storeFormData(data) {
  const res = await fetch(`${API_BASE_URL}/store_form_data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function getPropertyDistribution(ownership_type) {
  const res = await fetch(
    `${API_BASE_URL}/analytics/property_distribution?ownership_type=${ownership_type}`
  );

  if (!res.ok) {
    throw new Error("Failed to load analytics");
  }

  return res.json();
}

export async function getTrends() {
  const res = await fetch(`${API_BASE_URL}/analytics/trends`);

  if (!res.ok) {
    throw new Error("Failed to load trends");
  }

  return res.json();
}