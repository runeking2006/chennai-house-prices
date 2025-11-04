// simple API wrapper for /meta and /predict

const API_BASE = "http://127.0.0.1:8000"; // set if needed, default same origin

export async function fetchMeta() {
  const res = await fetch(`${API_BASE}/meta`);
  if (!res.ok) throw new Error("Failed to load meta");
  return res.json();
}

export async function predictPrice(payload) {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok && data.error) throw new Error(data.error);
  return data;
}
