import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { predictPrice } from "./api"; // API helper
import AnalyticsView from "./AnalyticsView"; // Your analytics component

// ===== District–Taluk pairs =====
const district_taluk_pairs = [
  ["Chennai", "Alandur"], ["Chennai", "Ambattur"], ["Chennai", "Aminjikarai"], ["Chennai", "Ayanavaram"],
  ["Chennai", "Egmore"], ["Chennai", "Guindy"], ["Chennai", "Madhavaram"], ["Chennai", "Madhuravoyal"],
  ["Chennai", "Mambalam"], ["Chennai", "Mylapore"], ["Chennai", "Perambur"], ["Chennai", "Purasavakkam"],
  ["Chennai", "Sholinganallur"], ["Chennai", "Thiruvottriyur"], ["Chennai", "Tondiarpet"], ["Chennai", "Velacherry"],
  ["Coimbatore", "Anaimalai"], ["Coimbatore", "Annur"], ["Coimbatore", "Coimbatore_North"], ["Coimbatore", "Coimbatore_South"],
  ["Coimbatore", "Kinathukadavu"], ["Coimbatore", "Madukarai"], ["Coimbatore", "Mettupalayam"], ["Coimbatore", "Perur"],
  ["Coimbatore", "Pollachi"], ["Coimbatore", "Sulur"], ["Coimbatore", "Valparai"],
  ["Cuddalore", "Bhuvanagiri"], ["Cuddalore", "Chidambaram"], ["Cuddalore", "Kattumannarkoil"], ["Cuddalore", "Kurinjipadi"],
  ["Cuddalore", "Panruti"], ["Cuddalore", "Srimushnam"], ["Cuddalore", "Thittakudi"], ["Cuddalore", "Veppur"], ["Cuddalore", "Virudhachalam"],
  ["Dharmapuri", "Dharmapuri"], ["Dharmapuri", "Harur"], ["Dharmapuri", "Karimangalam"], ["Dharmapuri", "Nallampalli"],
  ["Dharmapuri", "Palacode"], ["Dharmapuri", "Pappireddipatti"], ["Dharmapuri", "Pennagaram"],
  ["Dindigul", "Atthur"], ["Dindigul", "Dindigul_East"], ["Dindigul", "Dindigul_West"], ["Dindigul", "Guziliyamparai"],
  ["Dindigul", "Kodaikanal"], ["Dindigul", "Natham"], ["Dindigul", "Nilakottai"], ["Dindigul", "Oddanchatram"],
  ["Dindigul", "Palani"], ["Dindigul", "Vedasandur"],
  ["Erode", "Erode"], ["Erode", "Anthiyur"], ["Erode", "Bhavani"], ["Erode", "Gobichettipalayam"], ["Erode", "Kodumudi"],
  ["Erode", "Modakurichi"], ["Erode", "Nambiyur"], ["Erode", "Perundurai"], ["Erode", "Sathyamangalam"], ["Erode", "Thalavadi"],
  ["Kancheepuram", "Kancheepuram"], ["Kancheepuram", "Kundrathur"], ["Kancheepuram", "Sriperumbudur"],
  ["Kancheepuram", "Uthiramerur"], ["Kancheepuram", "Walajabad"],
  ["Kanniyakumari", "Agasteeswaram"], ["Kanniyakumari", "Kalkulam"], ["Kanniyakumari", "Killiyur"], ["Kanniyakumari", "Thiruvatar"],
  ["Kanniyakumari", "Thovalai"], ["Kanniyakumari", "Vilavankodu"],
  ["Karur", "Karur"], ["Karur", "Aravakurichi"], ["Karur", "Kadavur"], ["Karur", "Krishnarayapuram"],
  ["Karur", "Kulithalai"], ["Karur", "Manmangalam"], ["Karur", "Pugalur"],
  ["Madurai", "Kallikudi"], ["Madurai", "Madurai_East"], ["Madurai", "Madurai_North"], ["Madurai", "Madurai_South"],
  ["Madurai", "Madurai_West"], ["Madurai", "Melur"], ["Madurai", "Peraiyur"], ["Madurai", "Thirumangalam"],
  ["Madurai", "Thiruparankundram"], ["Madurai", "Usilampatti"], ["Madurai", "Vadipatti"],
  ["Nagapattinam", "Nagapattinam"], ["Nagapattinam", "Kilvelur"], ["Nagapattinam", "Thirukkuvalai"], ["Nagapattinam", "Vedaranyam"],
  ["Namakkal", "Namakkal"], ["Namakkal", "Kholli_Hills"], ["Namakkal", "Kumarapalayam"], ["Namakkal", "Mohanoor"],
  ["Namakkal", "Paramathi_Velur"], ["Namakkal", "Rasipuram"], ["Namakkal", "Senthamangalam"], ["Namakkal", "Tiruchengode"],
  ["Nilgiris", "Udagamandalam"], ["Nilgiris", "Coonoor"], ["Nilgiris", "Gudalur"], ["Nilgiris", "Kothagiri"],
  ["Nilgiris", "Kundah"], ["Nilgiris", "Pandalur"],
  ["Perambalur", "Perambalur"], ["Perambalur", "Alathur"], ["Perambalur", "Kunnam"], ["Perambalur", "Veppanthattai"],
  ["Pudukottai", "Pudukottai"], ["Pudukottai", "Alangudi"], ["Pudukottai", "Aranthangi"], ["Pudukottai", "Avudiyarkoil"],
  ["Pudukottai", "Gandarvakottai"], ["Pudukottai", "Iluppur"], ["Pudukottai", "Karambakudi"], ["Pudukottai", "Kulathur"],
  ["Pudukottai", "Manamelkudi"], ["Pudukottai", "Ponnamaravathi"], ["Pudukottai", "Thirumayam"], ["Pudukottai", "Viralimalai"],
  ["Ramanathapuram", "Ramanathapuram"], ["Ramanathapuram", "Kadaladi"], ["Ramanathapuram", "Kamuthi"], ["Ramanathapuram", "Kezhakarai"],
  ["Ramanathapuram", "Mudukulathur"], ["Ramanathapuram", "Paramakudi"], ["Ramanathapuram", "Rajasingamangalam"],
  ["Ramanathapuram", "Rameswaram"], ["Ramanathapuram", "Tiruvadanai"],
  ["Salem", "Salem"], ["Salem", "Attur"], ["Salem", "Edapadi"], ["Salem", "Gangavalli"], ["Salem", "Kadaiyampatti"],
  ["Salem", "Mettur"], ["Salem", "Omalur"], ["Salem", "Pethanayakanpalayam"], ["Salem", "Salem_South"], ["Salem", "Salem_West"],
  ["Salem", "Sankari"], ["Salem", "Vazhapadi"], ["Salem", "Yercaud"],
  ["Sivagangai", "Sivagangai"], ["Sivagangai", "Devakottai"], ["Sivagangai", "Ilayankudi"], ["Sivagangai", "Kalaiyarkovil"],
  ["Sivagangai", "Karaikudi"], ["Sivagangai", "Manamadurai"], ["Sivagangai", "Singampunari"], ["Sivagangai", "Thirupuvanam"],
  ["Sivagangai", "Tirupathur"],
  ["Thanjavur", "Thanjavur"], ["Thanjavur", "Boothalur"], ["Thanjavur", "Kumbakonam"], ["Thanjavur", "Orathanadu"],
  ["Thanjavur", "Papanasam"], ["Thanjavur", "Pattukottai"], ["Thanjavur", "Peravurani"], ["Thanjavur", "Thiruvaiyaru"],
  ["Thanjavur", "Thiruvidaimaruthur"],
  ["Theni", "Theni"], ["Theni", "Aandipatti"], ["Theni", "Bodinayakanur"], ["Theni", "Periyakulam"], ["Theni", "Uthamapalayam"],
  ["Thiruvallur", "Thiruvallur"], ["Thiruvallur", "Avadi"], ["Thiruvallur", "Gummidipoondi"], ["Thiruvallur", "Pallipattu"],
  ["Thiruvallur", "Ponneri"], ["Thiruvallur", "Poonamallee"], ["Thiruvallur", "RK_Pet"], ["Thiruvallur", "Tiruthani"], ["Thiruvallur","Uthukottai"],
  ["Thiruvannamalai", "Thiruvannamalai"], ["Thiruvannamalai", "Arni"], ["Thiruvannamalai", "Chengam"], ["Thiruvannamalai", "Chetpet"],
  ["Thiruvannamalai", "Cheyyar"], ["Thiruvannamalai", "Jamunamarathur"], ["Thiruvannamalai", "Kalasapakkam"], ["Thiruvannamalai", "Kilpennathur"],
  ["Thiruvannamalai", "Polur"], ["Thiruvannamalai", "Thandramet"], ["Thiruvannamalai", "Vandavasi"], ["Thiruvannamalai", "Vembakkam"],
  ["Thiruvarur", "Thiruvarur"], ["Thiruvarur", "Kodavasal"], ["Thiruvarur", "Koothanallur"], ["Thiruvarur", "Mannargudi"],
  ["Thiruvarur", "Nannilam"], ["Thiruvarur", "Needamangalam"], ["Thiruvarur", "Thiruthuraipoondi"], ["Thiruvarur", "Valangaiman"],
  ["Thoothukudi", "Thoothukudi"], ["Thoothukudi", "Eral"], ["Thoothukudi", "Ettayapuram"], ["Thoothukudi", "Kayathar"],
  ["Thoothukudi", "Kovilpatti"], ["Thoothukudi", "Ottapidaram"], ["Thoothukudi", "Sattankulam"], ["Thoothukudi", "Srivaikundam"],
  ["Thoothukudi", "Tiruchendur"], ["Thoothukudi", "Vilathikulam"],
  ["Tiruchirappalli", "Lalgudi"], ["Tiruchirappalli", "Manachanallur"], ["Tiruchirappalli", "Manapparai"], ["Tiruchirappalli", "Marungapuri"],
  ["Tiruchirappalli", "Musiri"], ["Tiruchirappalli", "Srirangam"], ["Tiruchirappalli", "Thottiam"], ["Tiruchirappalli", "Thuraiyur"],
  ["Tiruchirappalli", "Tiruchirappalli_West"], ["Tiruchirappalli", "Tiruchirappalli_East"], ["Tiruchirappalli", "Tiruverumbur"],
  ["Tirunelveli", "Tirunelveli"], ["Tirunelveli", "Ambasamudram"], ["Tirunelveli", "Cheranmahadevi"], ["Tirunelveli", "Manur"],
  ["Tirunelveli", "Nanguneri"], ["Tirunelveli", "Palayamkottai"], ["Tirunelveli", "Radhapuram"], ["Tirunelveli", "Thisayanvilai"],
  ["Vellore", "Vellore"], ["Vellore", "Aanikattu"], ["Vellore", "Gudiyatham"], ["Vellore", "K_V_Kuppam"],
  ["Vellore", "Katpadi"], ["Vellore", "Pernambut"],
  ["Villupuram", "Villupuram"], ["Villupuram", "Gingee"], ["Villupuram", "Kandachipuram"], ["Villupuram", "Marakanam"],
  ["Villupuram", "Melmalaiyanur"], ["Villupuram", "Thiruvennainallur"], ["Villupuram", "Tindivanam"], ["Villupuram", "Vanur"], ["Villupuram", "Vikravandi"],
  ["Virudhunagar", "Virudhunagar"], ["Virudhunagar", "Aruppukottai"], ["Virudhunagar", "Kariyapatti"], ["Virudhunagar", "Rajapalayam"],
  ["Virudhunagar", "Sathur"], ["Virudhunagar", "Sivakasi"], ["Virudhunagar", "Srivilliputhur"], ["Virudhunagar", "Tiruchuli"],
  ["Virudhunagar", "Vembakottai"], ["Virudhunagar", "Watrap"],
  ["Ariyalur", "Ariyalur"], ["Ariyalur", "Andimadam"], ["Ariyalur", "Sendurai"], ["Ariyalur", "Udaiyarpalayam"],
  ["Krishnagiri", "Krishnagiri"], ["Krishnagiri", "Anjetty"], ["Krishnagiri", "Bargur"], ["Krishnagiri", "Hosur"],
  ["Krishnagiri", "Pochampalli"], ["Krishnagiri", "Sulagiri"], ["Krishnagiri", "Thenkanikottai"], ["Krishnagiri", "Uthangarai"],
  ["Tiruppur", "Avinashi"], ["Tiruppur", "Dharapuram"], ["Tiruppur", "Kangeyam"], ["Tiruppur", "Madathukkulam"],
  ["Tiruppur", "Oothukuli"], ["Tiruppur", "Palladam"], ["Tiruppur", "Tiruppur_North"], ["Tiruppur", "Tiruppur_South"], ["Tiruppur", "Udumalaipettai"],
  ["Chengalpattu", "Chengalpattu"], ["Chengalpattu", "Cheyyur"], ["Chengalpattu", "Maduranthakam"], ["Chengalpattu", "Pallavaram"],
  ["Chengalpattu", "Tambaram"], ["Chengalpattu", "Thirukalukundram"], ["Chengalpattu","Tiruporur"], ["Chengalpattu", "Vandalur"],
  ["Kallakurichi", "Kallakurichi"], ["Kallakurichi", "Chinnaselam"], ["Kallakurichi", "Kalvarayan_Hills"], ["Kallakurichi", "Sankarapuram"],
  ["Kallakurichi", "Tirukoilur"], ["Kallakurichi", "Ulundurpet"],
  ["Ranipet", "Arakkonam"], ["Ranipet", "Arcot"], ["Ranipet", "Kalavai"], ["Ranipet", "Nemili"], ["Ranipet", "Sholingur"], ["Ranipet", "Walajah"],
  ["Tenkasi", "Tenkasi"], ["Tenkasi", "Alangulam"], ["Tenkasi", "Kadayanallur"], ["Tenkasi", "Sankarankovil"], ["Tenkasi", "Shenkottai"],
  ["Tenkasi", "Sivagiri"], ["Tenkasi", "Thiruvengadam"], ["Tenkasi", "Veerakeralampudur"],
  ["Tirupathur", "Tirupathur"], ["Tirupathur", "Ambur"], ["Tirupathur", "Natrampalli"], ["Tirupathur", "Vaniyambadi"],
  ["Mayiladuthurai", "Mayiladuthurai"], ["Mayiladuthurai", "Kuthalam"], ["Mayiladuthurai", "Sirkali"], ["Mayiladuthurai", "Tharangambadi"]
];

// === Helper for Indian currency formatting ===
const formatINR = (num, decimals = 0) => {
  return num.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Simple loading spinner component
const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);


export default function App() {
  const [form, setForm] =useState({
    district: "",
    taluk: "",
    property_type: "",
    ownership_type: "",
    built_area_sqft: "",
    bedrooms: "",
    bathrooms: "",
  });

  const [taluks, setTaluks] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [showAnalytics, setShowAnalytics] = useState(false);

  const districts = [...new Set(district_taluk_pairs.map(([d]) => d))];
  const taluks_by_district = districts.reduce((acc, d) => {
    acc[d] = district_taluk_pairs.filter(([district]) => district === d).map(([, t]) => t);
    return acc;
  }, {});

  useEffect(() => {
    if (form.district) {
      setTaluks(taluks_by_district[form.district] || []);
      setForm((prev) => ({ ...prev, taluk: "" }));
    }
  }, [form.district]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const storeFormData = async (data) => {
    try {
      const res = await fetch("https://chennai-house-prices.onrender.com/store_form_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      console.log("Form data store response:", result);
    } catch (err) {
      console.error("Storing form data failed:", err);
    }
  };

  const handlePredict = async () => {
    // 2️⃣ Form validation before API call
    if (!form.district || !form.taluk || !form.property_type || !form.ownership_type || !form.built_area_sqft || !form.bedrooms || !form.bathrooms) {
        setMessage("Please fill in all required fields.");
        return;
    }

    setLoading(true);
    setPrediction(null);
    setMessage("");
    try {
      const res = await predictPrice({
        ...form,
        built_area_sqft: parseFloat(form.built_area_sqft),
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
      });

      if (res.predicted_price) {
        const totalPrice = parseFloat(res.predicted_price);
        const perSqft = totalPrice / parseFloat(form.built_area_sqft || 1);
        setPrediction({ totalPrice, perSqft });
        storeFormData({
          district: form.district,
          taluk: form.taluk,
          property_type: form.property_type,
          ownership_type: form.ownership_type,
          built_area_sqft: parseFloat(form.built_area_sqft),
          bedrooms: parseInt(form.bedrooms),
          bathrooms: parseInt(form.bathrooms),
        });
      } else if (res.error) setMessage(res.error);
    } catch (err) {
      console.error("Prediction error:", err);
      // 5️⃣ API error handling
      setMessage(err?.message || "Prediction failed. Try again later.");
    }
    setLoading(false);
  };



  return (
    <div className="bg-white min-h-screen">
      {/* TOGGLE — stays on top */}
      <div className="sticky top-0 z-50 bg-white py-4 flex justify-center gap-4">
        <button
          onClick={() => setShowAnalytics(false)}
          className={`px-4 py-2 rounded-lg font-semibold ${
            !showAnalytics ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          🏠 Predictor
        </button>

        <button
          onClick={() => setShowAnalytics(true)}
          className={`px-4 py-2 rounded-lg font-semibold ${
            showAnalytics ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          📊 Analytics
        </button>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="p-6 overflow-y-auto">
        {showAnalytics ? (
          <AnalyticsView onBack={() => setShowAnalytics(false)} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6 space-y-5">
              <h2 className="text-2xl font-bold text-center text-indigo-700">
                🏠 Tamil Nadu Property Price Predictor
              </h2>

              {/* District */}
              <select
                name="district"
                value={form.district}
                onChange={handleChange}
                aria-label="Select District" // 6️⃣ Accessibility
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select District</option>
                {/* 1️⃣ Dropdown keys */}
                {districts.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>

              {/* Taluk */}
              <select
                name="taluk"
                value={form.taluk}
                onChange={handleChange}
                disabled={!form.district}
                aria-label="Select Taluk" // 6️⃣ Accessibility
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <option value="">Select Taluk</option>
                {/* 1️⃣ Dropdown keys */}
                {taluks.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>

              {/* Property Type */}
              <select
                name="property_type"
                value={form.property_type}
                onChange={handleChange}
                aria-label="Select Property Type" // 6️⃣ Accessibility
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Property Type</option>
                {/* 1️⃣ Dropdown keys */}
                <option value="Flat">Flat</option>
                <option value="Commercial">Commercial</option>
                <option value="Plot">Plot</option>
                <option value="Apartment">Apartment</option>
              </select>

              {/* Ownership Type */}
              <select
                name="ownership_type"
                value={form.ownership_type}
                onChange={handleChange}
                aria-label="Select Ownership Type" // 6️⃣ Accessibility
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Ownership Type</option>
                {/* 1️⃣ Dropdown keys */}
                <option value="Freehold">Freehold</option>
                <option value="Leasehold">Leasehold</option>
              </select>

              {/* Inputs */}
              <input
                type="number"
                name="built_area_sqft"
                placeholder="Built Area (sqft)"
                value={form.built_area_sqft}
                onChange={handleChange}
                min="0" // 3️⃣ Prevent invalid numeric input
                aria-label="Built Area (sqft)" // 6️⃣ Accessibility
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  name="bedrooms"
                  placeholder="Bedrooms"
                  value={form.bedrooms}
                  onChange={handleChange}
                  min="0" // 3️⃣ Prevent invalid numeric input
                  aria-label="Bedrooms" // 6️⃣ Accessibility
                  className="w-1/2 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  name="bathrooms"
                  placeholder="Bathrooms"
                  value={form.bathrooms}
                  onChange={handleChange}
                  min="0" // 3️⃣ Prevent invalid numeric input
                  aria-label="Bathrooms" // 6️⃣ Accessibility
                  className="w-1/2 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Predict Button */}
              <button
                onClick={handlePredict}
                disabled={loading}
                // 7️⃣ Loading spinner styling
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {/* 7️⃣ Loading spinner */}
                {loading ? (
                  <>
                    <Spinner />
                    Predicting...
                  </>
                ) : (
                  "Predict"
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Note: These predictions are used for understanding user preferences for buying property.
              </p>

              {/* Result */}
              {prediction && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 p-4 rounded-xl text-center border border-green-200"
                >
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-lg font-semibold text-green-700">
                      Predicted Price: ₹ {formatINR(prediction.totalPrice)}
                    </p>
                    <p className="text-sm text-gray-700">
                      Per sqft: ₹ {formatINR(prediction.perSqft, 2)}
                    </p>
                    <button
                      onClick={() => {
                        setForm({
                          district: "",
                          taluk: "",
                          property_type: "",
                          ownership_type: "",
                          built_area_sqft: "",
                          bedrooms: "",
                          bathrooms: "",
                        });
                        setPrediction(null);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Reset
                    </button>
                  </div>
                </motion.div>
              )}

              {message && (
                <p className="text-red-500 text-sm text-center font-medium">{message}</p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}