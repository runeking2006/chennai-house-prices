import React, { useState, useEffect } from "react";
import { predictPrice } from "./api"; // your API call
import { motion, AnimatePresence } from "framer-motion";

// Full district-taluk pairs array
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

const districts = [...new Set(district_taluk_pairs.map(pair => pair[0]))];

export default function App() {
  const [form, setForm] = useState({
    district: "",
    taluk: "",
    property_type: "",
    ownership_type: "",
    built_area_sqft: "",
    bedrooms: ""
  });

  const [taluks, setTaluks] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (form.district) {
      const filteredTaluks = district_taluk_pairs
        .filter(pair => pair[0] === form.district)
        .map(pair => pair[1]);
      setTaluks(filteredTaluks);
      setForm(prev => ({ ...prev, taluk: "" })); // reset taluk when district changes
    } else {
      setTaluks([]);
      setForm(prev => ({ ...prev, taluk: "" }));
    }
  }, [form.district]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await predictPrice(form);
      setPrediction(res.predicted_price);
    } catch (err) {
      console.error(err);
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="app-container" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", margin: "0 auto", padding: "20px" }}
    >
      <h2>Property Price Predictor</h2>

      <motion.select 
        name="district" 
        value={form.district} 
        onChange={handleChange}
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.1 }}
      >
        <option value="">Select District</option>
        {districts.map(d => <option key={d} value={d}>{d}</option>)}
      </motion.select>

      <motion.select 
        name="taluk" 
        value={form.taluk} 
        onChange={handleChange} 
        disabled={!form.district}
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.2 }}
      >
        <option value="">Select Taluk</option>
        {taluks.map(t => <option key={t} value={t}>{t}</option>)}
      </motion.select>

      <motion.select 
        name="property_type" 
        value={form.property_type} 
        onChange={handleChange}
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.3 }}
      >
        <option value="">Select Property Type</option>
        <option value="Flat">Flat</option>
        <option value="Commercial">Commercial</option>
        <option value="Plot">Plot</option>
        <option value="Apartment">Apartment</option>
      </motion.select>

      <motion.select 
        name="ownership_type" 
        value={form.ownership_type} 
        onChange={handleChange}
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.4 }}
      >
        <option value="">Select Ownership Type</option>
        <option value="Freehold">Freehold</option>
        <option value="Leasehold">Leasehold</option>
      </motion.select>

      <motion.input 
        type="number" 
        name="built_area_sqft" 
        placeholder="Built Area (sqft)" 
        value={form.built_area_sqft} 
        onChange={handleChange} 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.5 }}
      />
      <motion.input 
        type="number" 
        name="bedrooms" 
        placeholder="Bedrooms" 
        value={form.bedrooms} 
        onChange={handleChange} 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.6 }}
      />

      <motion.button 
        onClick={handlePredict}
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ padding: "10px", marginTop: "10px" }}
      >
        {loading ? "Predicting..." : "Predict"}
      </motion.button>

      <p style={{ fontSize: "0.8rem", marginTop: "5px" }}>
        Note: These predictions are for understanding user preferences for buying property.
      </p>

      <AnimatePresence>
        {prediction && !loading && (
          <motion.p
            key="prediction"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ fontWeight: "bold", marginTop: "10px" }}
          >
            Predicted Price: ₹{prediction}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
