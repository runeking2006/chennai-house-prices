// src/App.js
import React, { useEffect, useState } from "react";
import { fetchMeta, predictPrice } from "./api";
import { motion, AnimatePresence } from "framer-motion";

/*
  NOTE: We use meta from backend when possible.
  If fetchMeta fails or is incomplete, fallback to the full district_taluk_pairs below.
*/

const district_taluk_pairs = [
    ("Chennai", "Alandur"), ("Chennai", "Ambattur"), ("Chennai", "Aminjikarai"), ("Chennai", "Ayanavaram"),
    ("Chennai", "Egmore"), ("Chennai", "Guindy"), ("Chennai", "Madhavaram"), ("Chennai", "Madhuravoyal"),
    ("Chennai", "Mambalam"), ("Chennai", "Mylapore"), ("Chennai", "Perambur"), ("Chennai", "Purasavakkam"),
    ("Chennai", "Sholinganallur"), ("Chennai", "Thiruvottriyur"), ("Chennai", "Tondiarpet"), ("Chennai", "Velacherry"),
    ("Coimbatore", "Anaimalai"), ("Coimbatore", "Annur"), ("Coimbatore", "Coimbatore_North"), ("Coimbatore", "Coimbatore_South"),
    ("Coimbatore", "Kinathukadavu"), ("Coimbatore", "Madukarai"), ("Coimbatore", "Mettupalayam"), ("Coimbatore", "Perur"),
    ("Coimbatore", "Pollachi"), ("Coimbatore", "Sulur"), ("Coimbatore", "Valparai"),
    ("Cuddalore", "Bhuvanagiri"), ("Cuddalore", "Chidambaram"), ("Cuddalore", "Kattumannarkoil"), ("Cuddalore", "Kurinjipadi"),
    ("Cuddalore", "Panruti"), ("Cuddalore", "Srimushnam"), ("Cuddalore", "Thittakudi"), ("Cuddalore", "Veppur"), ("Cuddalore", "Virudhachalam"),
    ("Dharmapuri", "Dharmapuri"), ("Dharmapuri", "Harur"), ("Dharmapuri", "Karimangalam"), ("Dharmapuri", "Nallampalli"),
    ("Dharmapuri", "Palacode"), ("Dharmapuri", "Pappireddipatti"), ("Dharmapuri", "Pennagaram"),
    ("Dindigul", "Atthur"), ("Dindigul", "Dindigul_East"), ("Dindigul", "Dindigul_West"), ("Dindigul", "Guziliyamparai"),
    ("Dindigul", "Kodaikanal"), ("Dindigul", "Natham"), ("Dindigul", "Nilakottai"), ("Dindigul", "Oddanchatram"),
    ("Dindigul", "Palani"), ("Dindigul", "Vedasandur"),
    ("Erode", "Erode"), ("Erode", "Anthiyur"), ("Erode", "Bhavani"), ("Erode", "Gobichettipalayam"), ("Erode", "Kodumudi"),
    ("Erode", "Modakurichi"), ("Erode", "Nambiyur"), ("Erode", "Perundurai"), ("Erode", "Sathyamangalam"), ("Erode", "Thalavadi"),
    ("Kancheepuram", "Kancheepuram"), ("Kancheepuram", "Kundrathur"), ("Kancheepuram", "Sriperumbudur"),
    ("Kancheepuram", "Uthiramerur"), ("Kancheepuram", "Walajabad"),
    ("Kanniyakumari", "Agasteeswaram"), ("Kanniyakumari", "Kalkulam"), ("Kanniyakumari", "Killiyur"), ("Kanniyakumari", "Thiruvatar"),
    ("Kanniyakumari", "Thovalai"), ("Kanniyakumari", "Vilavankodu"),
    ("Karur", "Karur"), ("Karur", "Aravakurichi"), ("Karur", "Kadavur"), ("Karur", "Krishnarayapuram"),
    ("Karur", "Kulithalai"), ("Karur", "Manmangalam"), ("Karur", "Pugalur"),
    ("Madurai", "Kallikudi"), ("Madurai", "Madurai_East"), ("Madurai", "Madurai_North"), ("Madurai", "Madurai_South"),
    ("Madurai", "Madurai_West"), ("Madurai", "Melur"), ("Madurai", "Peraiyur"), ("Madurai", "Thirumangalam"),
    ("Madurai", "Thiruparankundram"), ("Madurai", "Usilampatti"), ("Madurai", "Vadipatti"),
    ("Nagapattinam", "Nagapattinam"), ("Nagapattinam", "Kilvelur"), ("Nagapattinam", "Thirukkuvalai"), ("Nagapattinam", "Vedaranyam"),
    ("Namakkal", "Namakkal"), ("Namakkal", "Kholli_Hills"), ("Namakkal", "Kumarapalayam"), ("Namakkal", "Mohanoor"),
    ("Namakkal", "Paramathi_Velur"), ("Namakkal", "Rasipuram"), ("Namakkal", "Senthamangalam"), ("Namakkal", "Tiruchengode"),
    ("Nilgiris", "Udagamandalam"), ("Nilgiris", "Coonoor"), ("Nilgiris", "Gudalur"), ("Nilgiris", "Kothagiri"),
    ("Nilgiris", "Kundah"), ("Nilgiris", "Pandalur"),
    ("Perambalur", "Perambalur"), ("Perambalur", "Alathur"), ("Perambalur", "Kunnam"), ("Perambalur", "Veppanthattai"),
    ("Pudukottai", "Pudukottai"), ("Pudukottai", "Alangudi"), ("Pudukottai", "Aranthangi"), ("Pudukottai", "Avudiyarkoil"),
    ("Pudukottai", "Gandarvakottai"), ("Pudukottai", "Iluppur"), ("Pudukottai", "Karambakudi"), ("Pudukottai", "Kulathur"),
    ("Pudukottai", "Manamelkudi"), ("Pudukottai", "Ponnamaravathi"), ("Pudukottai", "Thirumayam"), ("Pudukottai", "Viralimalai"),
    ("Ramanathapuram", "Ramanathapuram"), ("Ramanathapuram", "Kadaladi"), ("Ramanathapuram", "Kamuthi"), ("Ramanathapuram", "Kezhakarai"),
    ("Ramanathapuram", "Mudukulathur"), ("Ramanathapuram", "Paramakudi"), ("Ramanathapuram", "Rajasingamangalam"),
    ("Ramanathapuram", "Rameswaram"), ("Ramanathapuram", "Tiruvadanai"),
    ("Salem", "Salem"), ("Salem", "Attur"), ("Salem", "Edapadi"), ("Salem", "Gangavalli"), ("Salem", "Kadaiyampatti"),
    ("Salem", "Mettur"), ("Salem", "Omalur"), ("Salem", "Pethanayakanpalayam"), ("Salem", "Salem_South"), ("Salem", "Salem_West"),
    ("Salem", "Sankari"), ("Salem", "Vazhapadi"), ("Salem", "Yercaud"),
    ("Sivagangai", "Sivagangai"), ("Sivagangai", "Devakottai"), ("Sivagangai", "Ilayankudi"), ("Sivagangai", "Kalaiyarkovil"),
    ("Sivagangai", "Karaikudi"), ("Sivagangai", "Manamadurai"), ("Sivagangai", "Singampunari"), ("Sivagangai", "Thirupuvanam"),
    ("Sivagangai", "Tirupathur"),
    ("Thanjavur", "Thanjavur"), ("Thanjavur", "Boothalur"), ("Thanjavur", "Kumbakonam"), ("Thanjavur", "Orathanadu"),
    ("Thanjavur", "Papanasam"), ("Thanjavur", "Pattukottai"), ("Thanjavur", "Peravurani"), ("Thanjavur", "Thiruvaiyaru"),
    ("Thanjavur", "Thiruvidaimaruthur"),
    ("Theni", "Theni"), ("Theni", "Aandipatti"), ("Theni", "Bodinayakanur"), ("Theni", "Periyakulam"), ("Theni", "Uthamapalayam"),
    ("Thiruvallur", "Thiruvallur"), ("Thiruvallur", "Avadi"), ("Thiruvallur", "Gummidipoondi"), ("Thiruvallur", "Pallipattu"),
    ("Thiruvallur", "Ponneri"), ("Thiruvallur", "Poonamallee"), ("Thiruvallur", "RK_Pet"), ("Thiruvallur", "Tiruthani"), ("Thiruvallur", "Uthukottai"),
    ("Thiruvannamalai", "Thiruvannamalai"), ("Thiruvannamalai", "Arni"), ("Thiruvannamalai", "Chengam"), ("Thiruvannamalai", "Chetpet"),
    ("Thiruvannamalai", "Cheyyar"), ("Thiruvannamalai", "Jamunamarathur"), ("Thiruvannamalai", "Kalasapakkam"), ("Thiruvannamalai", "Kilpennathur"),
    ("Thiruvannamalai", "Polur"), ("Thiruvannamalai", "Thandramet"), ("Thiruvannamalai", "Vandavasi"), ("Thiruvannamalai", "Vembakkam"),
    ("Thiruvarur", "Thiruvarur"), ("Thiruvarur", "Kodavasal"), ("Thiruvarur", "Koothanallur"), ("Thiruvarur", "Mannargudi"),
    ("Thiruvarur", "Nannilam"), ("Thiruvarur", "Needamangalam"), ("Thiruvarur", "Thiruthuraipoondi"), ("Thiruvarur", "Valangaiman"),
    ("Thoothukudi", "Thoothukudi"), ("Thoothukudi", "Eral"), ("Thoothukudi", "Ettayapuram"), ("Thoothukudi", "Kayathar"),
    ("Thoothukudi", "Kovilpatti"), ("Thoothukudi", "Ottapidaram"), ("Thoothukudi", "Sattankulam"), ("Thoothukudi", "Srivaikundam"),
    ("Thoothukudi", "Tiruchendur"), ("Thoothukudi", "Vilathikulam"),
    ("Tiruchirappalli", "Lalgudi"), ("Tiruchirappalli", "Manachanallur"), ("Tiruchirappalli", "Manapparai"), ("Tiruchirappalli", "Marungapuri"),
    ("Tiruchirappalli", "Musiri"), ("Tiruchirappalli", "Srirangam"), ("Tiruchirappalli", "Thottiam"), ("Tiruchirappalli", "Thuraiyur"),
    ("Tiruchirappalli", "Tiruchirappalli_West"), ("Tiruchirappalli", "Tiruchirappalli_East"), ("Tiruchirappalli", "Tiruverumbur"),
    ("Tirunelveli", "Tirunelveli"), ("Tirunelveli", "Ambasamudram"), ("Tirunelveli", "Cheranmahadevi"), ("Tirunelveli", "Manur"),
    ("Tirunelveli", "Nanguneri"), ("Tirunelveli", "Palayamkottai"), ("Tirunelveli", "Radhapuram"), ("Tirunelveli", "Thisayanvilai"),
    ("Vellore", "Vellore"), ("Vellore", "Aanikattu"), ("Vellore", "Gudiyatham"), ("Vellore", "K_V_Kuppam"),
    ("Vellore", "Katpadi"), ("Vellore", "Pernambut"),
    ("Villupuram", "Villupuram"), ("Villupuram", "Gingee"), ("Villupuram", "Kandachipuram"), ("Villupuram", "Marakanam"),
    ("Villupuram", "Melmalaiyanur"), ("Villupuram", "Thiruvennainallur"), ("Villupuram", "Tindivanam"), ("Villupuram", "Vanur"), ("Villupuram", "Vikravandi"),
    ("Virudhunagar", "Virudhunagar"), ("Virudhunagar", "Aruppukottai"), ("Virudhunagar", "Kariyapatti"), ("Virudhunagar", "Rajapalayam"),
    ("Virudhunagar", "Sathur"), ("Virudhunagar", "Sivakasi"), ("Virudhunagar", "Srivilliputhur"), ("Virudhunagar", "Tiruchuli"),
    ("Virudhunagar", "Vembakottai"), ("Virudhunagar", "Watrap"),
    ("Ariyalur", "Ariyalur"), ("Ariyalur", "Andimadam"), ("Ariyalur", "Sendurai"), ("Ariyalur", "Udaiyarpalayam"),
    ("Krishnagiri", "Krishnagiri"), ("Krishnagiri", "Anjetty"), ("Krishnagiri", "Bargur"), ("Krishnagiri", "Hosur"),
    ("Krishnagiri", "Pochampalli"), ("Krishnagiri", "Sulagiri"), ("Krishnagiri", "Thenkanikottai"), ("Krishnagiri", "Uthangarai"),
    ("Tiruppur", "Avinashi"), ("Tiruppur", "Dharapuram"), ("Tiruppur", "Kangeyam"), ("Tiruppur", "Madathukkulam"),
    ("Tiruppur", "Oothukuli"), ("Tiruppur", "Palladam"), ("Tiruppur", "Tiruppur_North"), ("Tiruppur", "Tiruppur_South"), ("Tiruppur", "Udumalaipettai"),
    ("Chengalpattu", "Chengalpattu"), ("Chengalpattu", "Cheyyur"), ("Chengalpattu", "Maduranthakam"), ("Chengalpattu", "Pallavaram"),
    ("Chengalpattu", "Tambaram"), ("Chengalpattu", "Thirukalukundram"), ("Chengalpattu", "Tiruporur"), ("Chengalpattu", "Vandalur"),
    ("Kallakurichi", "Kallakurichi"), ("Kallakurichi", "Chinnaselam"), ("Kallakurichi", "Kalvarayan_Hills"), ("Kallakurichi", "Sankarapuram"),
    ("Kallakurichi", "Tirukoilur"), ("Kallakurichi", "Ulundurpet"),
    ("Ranipet", "Arakkonam"), ("Ranipet", "Arcot"), ("Ranipet", "Kalavai"), ("Ranipet", "Nemili"), ("Ranipet", "Sholingur"), ("Ranipet", "Walajah"),
    ("Tenkasi", "Tenkasi"), ("Tenkasi", "Alangulam"), ("Tenkasi", "Kadayanallur"), ("Tenkasi", "Sankarankovil"), ("Tenkasi", "Shenkottai"),
    ("Tenkasi", "Sivagiri"), ("Tenkasi", "Thiruvengadam"), ("Tenkasi", "Veerakeralampudur"),
    ("Tirupathur", "Tirupathur"), ("Tirupathur", "Ambur"), ("Tirupathur", "Natrampalli"), ("Tirupathur", "Vaniyambadi"),
    ("Mayiladuthurai", "Mayiladuthurai"), ("Mayiladuthurai", "Kuthalam"), ("Mayiladuthurai", "Sirkali"), ("Mayiladuthurai", "Tharangambadi")
];

// convert pairs to a mapping only once
const buildFallbackMeta = () => {
  const taluks_by_district = {};
  for (const [d, t] of district_taluk_pairs) {
    if (!taluks_by_district[d]) taluks_by_district[d] = [];
    taluks_by_district[d].push(t);
  }
  const districts = Object.keys(taluks_by_district).sort();
  return {
    districts,
    taluks_by_district,
    property_types: ["commercial", "flat", "house", "plot"],
    ownership_types: ["freehold", "leasehold"]
  };
};

function App() {
  const [meta, setMeta] = useState(null);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [form, setForm] = useState({
    district: "",
    taluk: "",
    property_type: "",
    ownership_type: "",
    built_area_sqft: "",
    bedrooms: 1,
    bathrooms: 1
  });
  const [taluks, setTaluks] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchMeta()
      .then(m => {
        if (!mounted) return;
        // if meta seems valid use it, otherwise fallback
        const isValid = m && Array.isArray(m.districts) && m.districts.length > 0 && m.taluks_by_district;
        if (isValid) {
          setMeta(m);
          // init defaults
          const d = m.districts[0];
          setForm(f => ({ 
            ...f,
            district: d,
            taluk: ((m.taluks_by_district[d] && m.taluks_by_district[d][0]) || ""),
            property_type: ((m.property_types && m.property_types[0]) || ""),
            ownership_type: ((m.ownership_types && m.ownership_types[0]) || "")
          }));
          setTaluks(m.taluks_by_district[d] || []);
        } else {
          const fallback = buildFallbackMeta();
          setMeta(fallback);
          const d = fallback.districts[0];
          setForm(f => ({ ...f,
            district: d,
            taluk: fallback.taluks_by_district[d][0] || "",
            property_type: fallback.property_types[0],
            ownership_type: fallback.ownership_types[0]
          }));
          setTaluks(fallback.taluks_by_district[d] || []);
        }
        setLoadingMeta(false);
      })
      .catch(err => {
        // fallback to local mapping
        const fallback = buildFallbackMeta();
        setMeta(fallback);
        const d = fallback.districts[0];
        setForm(f => ({ ...f,
          district: d,
          taluk: fallback.taluks_by_district[d][0] || "",
          property_type: fallback.property_types[0],
          ownership_type: fallback.ownership_types[0]
        }));
        setTaluks(fallback.taluks_by_district[d] || []);
        setLoadingMeta(false);
      });
    return () => { mounted = false; };
  }, []);

  function handleDistrictChange(e) {
    const district = e.target.value;
    const newTaluks = (meta && meta.taluks_by_district[district]) || [];
    setTaluks(newTaluks);
    setForm(f => ({ ...f, district, taluk: newTaluks[0] || "" }));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setPredicting(true);
    setError(null);
    setResult(null);

    const payload = {
      district: form.district,
      taluk: form.taluk,
      property_type: form.property_type,
      ownership_type: form.ownership_type,
      built_area_sqft: parseFloat(form.built_area_sqft || 0),
      bedrooms: parseInt(form.bedrooms || 0, 10),
      bathrooms: parseInt(form.bathrooms || 0, 10)
    };

    try {
      const data = await predictPrice(payload);
      if (data.predicted_price !== undefined) {
        setResult(data.predicted_price);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("Unknown response from server");
      }
    } catch (err) {
      setError(err.message || "Prediction failed");
    } finally {
      setPredicting(false);
    }
  }

  const formatRupee = (n) => `₹ ${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Tamil Nadu Property Price Predictor</h1>

        {loadingMeta ? (
          <div>Loading…</div>
        ) : error && !meta ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm">District</label>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleDistrictChange}
                  className="mt-1 block w-full rounded-md border p-2"
                >
                  {meta.districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm">Taluk</label>
                <select
                  name="taluk"
                  value={form.taluk}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border p-2"
                >
                  {taluks.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm">Property Type</label>
                <select
                  name="property_type"
                  value={form.property_type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border p-2"
                >
                  {meta.property_types.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm">Ownership Type</label>
                <select
                  name="ownership_type"
                  value={form.ownership_type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border p-2"
                >
                  {meta.ownership_types.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm">Built Area (sqft)</label>
                <input
                  name="built_area_sqft"
                  value={form.built_area_sqft}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm">Bedrooms</label>
                <input
                  name="bedrooms"
                  value={form.bedrooms}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  className="mt-1 block w-full rounded-md border p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm">Bathrooms</label>
                <input
                  name="bathrooms"
                  value={form.bathrooms}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  className="mt-1 block w-full rounded-md border p-2"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                disabled={predicting}
              >
                {predicting ? "Predicting…" : "Predict"}
              </button>
              <button
                type="button"
                onClick={() => { setResult(null); setError(null); }}
                className="px-3 py-2 border rounded-md"
              >
                Reset
              </button>
            </div>

            <AnimatePresence>
              {result !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 p-4 bg-green-50 rounded-md"
                >
                  <div className="text-sm text-gray-600">Predicted Price</div>
                  <div className="text-xl font-semibold">{
                    formatRupee(result)
                  }</div>

                  {/* extra small useful stat: price per sqft */}
                  <div className="mt-2 text-sm text-gray-700">
                    {form.built_area_sqft > 0 ? (
                      <>
                        <span className="font-medium">Per sqft: </span>
                        {formatRupee(Number(result) / Number(form.built_area_sqft))}
                      </>
                    ) : null}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
