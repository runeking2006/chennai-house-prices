import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57", "#8dd1e1"];

export default function AnalyticsView() {
  const [ownership, setOwnership] = useState("Freehold");
  const [propertyDistribution, setPropertyDistribution] = useState([]);
  const [drillDown, setDrillDown] = useState({ type: null, district: null });

  // Fetch property distribution for selected ownership
  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        const res = await fetch(`https://chennai-house-prices.onrender.com/analytics/property_distribution?ownership_type=${ownership}`);
        const json = await res.json();
        setPropertyDistribution(json); // expects: { property_type, district, taluk_counts }
      } catch (err) {
        console.error("Failed to fetch property distribution", err);
      }
    };
    fetchDistribution();
  }, [ownership]);

  // Pie chart helpers
  const getPieData = (type) => {
    const filtered = propertyDistribution.filter(d => d.property_type === type);
    const districtMap = {};
    filtered.forEach(d => {
      districtMap[d.district] = (districtMap[d.district] || 0) + d.count;
    });
    return Object.entries(districtMap).map(([name, value]) => ({ name, value }));
  };

  const getTalukData = (type, district) => {
    const filtered = propertyDistribution.filter(d => d.property_type === type && d.district === district);
    if (!filtered.length) return [];
    return Object.entries(filtered[0].taluk_counts).map(([name, value]) => ({ name, value }));
  };

  const handleSliceClick = (type, district) => setDrillDown({ type, district });
  const handleBack = () => setDrillDown({ type: null, district: null });

  const propertyTypes = ["Apartment", "Plot", "Flat", "Commercial"];

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
        >
          <option>Freehold</option>
          <option>Leasehold</option>
        </select>
      </div>

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
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={getTalukData(drillDown.type, drillDown.district)}
                dataKey="value"
                nameKey="name"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {getTalukData(drillDown.type, drillDown.district).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
          {propertyTypes.map((type) => (
            <div key={type} className="bg-white p-4 rounded-2xl shadow-md">
              <h3 className="text-lg font-semibold text-center mb-2">{type} Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getPieData(type)}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                    onClick={(entry) => handleSliceClick(type, entry.name)}
                  >
                    {getPieData(type).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
