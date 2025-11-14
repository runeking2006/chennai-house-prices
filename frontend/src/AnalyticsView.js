import React, { useEffect, useState, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57", "#8dd1e1"];

export default function AnalyticsView() {
  const [ownership, setOwnership] = useState("Freehold");
  const [propertyDistribution, setPropertyDistribution] = useState([]);
  const [drillDown, setDrillDown] = useState({ type: null, district: null });

  // 1️⃣ Loading & Error Handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch property distribution for selected ownership
  useEffect(() => {
    const fetchDistribution = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`https://chennai-house-prices.onrender.com/analytics/property_distribution?ownership_type=${ownership}`);
        const json = await res.json();
        setPropertyDistribution(json); // expects: { property_type, district, taluk_counts }
      } catch (err) {
        console.error("Failed to fetch property distribution", err);
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchDistribution();
  }, [ownership]);

  // Pie chart helpers
  // 5️⃣ Performance Optimization: Wrap data-deriving functions in useCallback
  const getPieData = useCallback((type) => {
    const filtered = propertyDistribution.filter(d => d.property_type === type);
    const districtMap = {};
    filtered.forEach(d => {
      // Sum counts from the taluk_counts object
      const talukSum = Object.values(d.taluk_counts).reduce((acc, val) => acc + val, 0);
      districtMap[d.district] = (districtMap[d.district] || 0) + talukSum;
    });
    return Object.entries(districtMap).map(([name, value]) => ({ name, value }));
  }, [propertyDistribution]);

  const getTalukData = useCallback((type, district) => {
    const filtered = propertyDistribution.filter(d => d.property_type === type && d.district === district);
    if (!filtered.length) return [];
    return Object.entries(filtered[0].taluk_counts).map(([name, value]) => ({ name, value }));
  }, [propertyDistribution]);

  const handleSliceClick = (type, district) => setDrillDown({ type, district });
  const handleBack = () => setDrillDown({ type: null, district: null });

  const propertyTypes = ["Apartment", "Plot", "Flat", "Commercial"];

  // 5️⃣ Performance Optimization: Memoize talukData
  const talukData = useMemo(() => {
    if (!drillDown.type || !drillDown.district) return [];
    return getTalukData(drillDown.type, drillDown.district);
  }, [getTalukData, drillDown.type, drillDown.district]);
  
  // 6️⃣ UI Polish: Memoize totalCount
  const totalCount = useMemo(() => {
    return propertyDistribution.reduce((acc, d) => {
        const talukSum = Object.values(d.taluk_counts).reduce((sum, val) => sum + val, 0);
        return acc + talukSum;
    }, 0);
  }, [propertyDistribution]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 p-6 flex flex-col items-center space-y-6"
    >
      <div className="flex gap-4 items-center">
        <span className="font-semibold">Ownership:</span>
        <select
          value={ownership}
          onChange={(e) => setOwnership(e.target.value)}
          className="border border-gray-300 rounded-lg p-1"
          aria-label="Select Ownership Type" // 4️⃣ Accessibility
        >
          <option>Freehold</option>
          <option>Leasehold</option>
        </select>
      </div>

      {/* 1️⃣ Loading & Error Handling */}
      {loading && <p className="text-center text-gray-500">Loading analytics...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {/* 2️⃣ Empty Data Fallback */}
      {!loading && !error && propertyDistribution.length === 0 && (
        <p className="text-center text-gray-500">No data available for this selection.</p>
      )}

      {/* 6️⃣ UI Polish: Total count */}
      {!loading && !error && propertyDistribution.length > 0 && !drillDown.type && (
         <p className="text-center font-semibold mb-2">
            Total Properties: {totalCount}
        </p>
      )}


      {drillDown.type ? (
        <div className="w-full max-w-4xl">
          <button
            onClick={handleBack}
            className="mb-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            ← Back
          </button>
          <h2 className="text-xl font-bold text-center mb-4">
            {drillDown.type} in {drillDown.district} - Taluk Distribution
          </h2>

          {/* 2️⃣ Empty Data Fallback (for taluk) */}
          {talukData.length === 0 ? (
            <p className="text-center text-gray-500">No taluk data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={talukData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={150}
                  fill="#8884d8"
                  label
                >
                  {talukData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
          {propertyTypes.map((type) => {
            const pieData = getPieData(type); // Get data for this type
            
            return (
              // 4️⃣ Accessibility
              <div role="img" aria-label={`${type} Property Distribution Chart`} key={type} className="bg-white p-4 rounded-2xl shadow-md">
                <h3 className="text-lg font-semibold text-center mb-2">{type} Distribution</h3>
                
                {/* 2️⃣ Empty Data Fallback (for individual chart) */}
                {pieData.length === 0 ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-gray-500">No data available.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                        onClick={(entry) => {
                          // 3️⃣ Pie Slice Click Accuracy
                          console.log("Clicked slice:", entry);
                          handleSliceClick(type, entry.name);
                        }}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                
                {/* 6️⃣ UI Polish: Legend */}
                {pieData.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {pieData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-1">
                        <span className="w-4 h-4" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                        <span className="text-sm">{d.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}