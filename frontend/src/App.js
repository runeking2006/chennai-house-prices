import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { predictPrice } from "./api"; // <--- Your API helper

// === Manually insert your district-taluk pairs here ===
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
["Thiruvallur", "Ponneri"], ["Thiruvallur", "Poonamallee"], ["Thiruvallur", "RK_Pet"], ["Thiruvallur", "Tiruthani"], ["Thiruvallur", "Uthukottai"],
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
["Chengalpattu", "Tambaram"], ["Chengalpattu", "Thirukalukundram"], ["Chengalpattu", "Tiruporur"], ["Chengalpattu", "Vandalur"],
["Kallakurichi", "Kallakurichi"], ["Kallakurichi", "Chinnaselam"], ["Kallakurichi", "Kalvarayan_Hills"], ["Kallakurichi", "Sankarapuram"],
["Kallakurichi", "Tirukoilur"], ["Kallakurichi", "Ulundurpet"],
["Ranipet", "Arakkonam"], ["Ranipet", "Arcot"], ["Ranipet", "Kalavai"], ["Ranipet", "Nemili"], ["Ranipet", "Sholingur"], ["Ranipet", "Walajah"],
["Tenkasi", "Tenkasi"], ["Tenkasi", "Alangulam"], ["Tenkasi", "Kadayanallur"], ["Tenkasi", "Sankarankovil"], ["Tenkasi", "Shenkottai"],
["Tenkasi", "Sivagiri"], ["Tenkasi", "Thiruvengadam"], ["Tenkasi", "Veerakeralampudur"],
["Tirupathur", "Tirupathur"], ["Tirupathur", "Ambur"], ["Tirupathur", "Natrampalli"], ["Tirupathur", "Vaniyambadi"],
["Mayiladuthurai", "Mayiladuthurai"], ["Mayiladuthurai", "Kuthalam"], ["Mayiladuthurai", "Sirkali"], ["Mayiladuthurai", "Tharangambadi"]

];

export default function App() {
  const [form, setForm] = useState({
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // === Build meta from district_taluk_pairs manually ===
  const districts = [...new Set(district_taluk_pairs.map(([d]) => d))];
  const taluks_by_district = districts.reduce((acc, d) => {
    acc[d] = district_taluk_pairs
      .filter(([district]) => district === d)
      .map(([, taluk]) => taluk);
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

  const handlePredict = async () => {
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
        setPrediction(res.predicted_price);
      } else if (res.error) {
        setMessage(res.error);
      }
    } catch (err) {
      console.error("Prediction error:", err);
      setMessage("Prediction failed. Check console.");
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="app-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Property Price Predictor</h2>

      <select name="district" value={form.district} onChange={handleChange}>
        <option value="">Select District</option>
        {districts.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <select
        name="taluk"
        value={form.taluk}
        onChange={handleChange}
        disabled={!form.district}
      >
        <option value="">Select Taluk</option>
        {taluks.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select
        name="property_type"
        value={form.property_type}
        onChange={handleChange}
      >
        <option value="">Select Property Type</option>
        <option value="Flat">Flat</option>
        <option value="Commercial">Commercial</option>
        <option value="Plot">Plot</option>
        <option value="Apartment">Apartment</option>
      </select>

      <select
        name="ownership_type"
        value={form.ownership_type}
        onChange={handleChange}
      >
        <option value="">Select Ownership Type</option>
        <option value="Freehold">Freehold</option>
        <option value="Leasehold">Leasehold</option>
      </select>

      <input
        type="number"
        name="built_area_sqft"
        placeholder="Built Area (sqft)"
        value={form.built_area_sqft}
        onChange={handleChange}
      />
      <input
        type="number"
        name="bedrooms"
        placeholder="Bedrooms"
        value={form.bedrooms}
        onChange={handleChange}
      />
      <input
        type="number"
        name="bathrooms"
        placeholder="Bathrooms"
        value={form.bathrooms}
        onChange={handleChange}
      />

      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Predicting..." : "Predict"}
      </button>

      <p style={{ fontSize: "0.8rem", marginTop: "5px" }}>
        Note: These predictions are for understanding user preferences for buying
        property.
      </p>

      {prediction && <p>Predicted Price: ₹{prediction}</p>}
      {message && <p style={{ color: "red" }}>{message}</p>}
    </motion.div>
  );
}
