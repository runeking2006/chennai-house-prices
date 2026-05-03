import React, { useEffect, useState } from "react";

export default function BrokerView({ onBack }) {
  const [data, setData] = useState({
    hotspots: [],
    recent_activity: [],
    summary: { total_searches: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/broker/insights`
        );

        if (!res.ok) throw new Error("Failed to fetch data");

        const json = await res.json();

        setData({
          hotspots: json.hotspots || [],
          recent_activity: json.recent_activity || [],
          summary: json.summary || { total_searches: 0 }
        });

      } catch (err) {
        console.error("Broker API error:", err);
        setError("Failed to load broker insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading broker insights...
      </p>
    );

  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        {error}
        <div>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-gray-200 rounded"
          >
            ← Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">

      {/* Back */}
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
      >
        ← Back
      </button>

      {/* Hotspots */}
      <div>
        <h2 className="text-2xl font-bold mb-4">🔥 Top Demand Areas</h2>

        {data.hotspots.length === 0 ? (
          <p className="text-gray-500">No hotspot data available.</p>
        ) : (
          <div className="space-y-2">
            {data.hotspots.map((h, i) => (
              <div
                key={i}
                className="p-3 bg-white shadow rounded-lg flex justify-between"
              >
                <span>
                  {i + 1}. {h.district} - {h.taluk}
                </span>
                <span className="font-semibold text-indigo-600">
                  {h.demand_count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Market Summary */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📊 Market Overview</h2>

        <div className="p-4 bg-white shadow rounded-lg">
          <p className="text-lg">
            Total Searches:{" "}
            <span className="font-bold text-indigo-600">
              {data.summary.total_searches}
            </span>
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold mb-4">⚡ Live Market Activity</h2>

        {data.recent_activity.length === 0 ? (
          <p className="text-gray-500">No recent activity.</p>
        ) : (
          <div className="space-y-2">
            {data.recent_activity.map((r, i) => (
              <div
                key={i}
                className="p-3 bg-white shadow rounded-lg text-sm"
              >
                <span className="font-medium">
                  {r.district} - {r.taluk}
                </span>{" "}
                | {r.property_type} | {r.built_area_sqft} sqft
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}