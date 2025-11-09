from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import psycopg2  # <--- Added for database connection
import os
from urllib.parse import urlparse
import sqlite3
from datetime import datetime

# === Database Connection ===
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set")

url = urlparse(DATABASE_URL)
db_config = {
    "host": url.hostname,
    "database": url.path[1:],
    "user": url.username,
    "password": url.password
}

# === FastAPI App ===
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Load all trained artifacts ===
model = joblib.load("models/xgb_tn_property_model.pkl")
feature_scaler = joblib.load("models/feature_scaler.pkl")
label_encoders = joblib.load("models/label_encoders.pkl")  # expected dict: {col_name: LabelEncoder}

# === Database Connection ===
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

# === Build full District–Taluk Mapping ===
district_taluk_pairs = [
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
]

district_taluk_map = { (d, t): f"{d}_{t}".replace(" ", "_") for d, t in district_taluk_pairs }
district_taluk_map[("Unknown", "Unknown")] = "Unknown_Taluk"

# === Feature columns ===
feature_columns = [
    "district_taluk", "property_type", "ownership_type",
    "built_area_sqft", "bedrooms", "bathrooms"
]

class InputData(BaseModel):
    district: str
    taluk: str
    property_type: str
    ownership_type: str
    built_area_sqft: float
    bedrooms: int
    bathrooms: int

# === Helper: build /meta lists ===
def build_meta() -> Dict[str, Any]:
    districts = sorted(list({d for d, _ in district_taluk_pairs}))
    taluks_by_district: Dict[str, List[str]] = {}
    for d, t in district_taluk_pairs:
        taluks_by_district.setdefault(d, []).append(t)

    if isinstance(label_encoders, dict):
        prop_types = list(label_encoders.get("property_type").classes_) if label_encoders.get("property_type") is not None else ["Apartment", "Independent_House", "Villa", "Plot"]
        owner_types = list(label_encoders.get("ownership_type").classes_) if label_encoders.get("ownership_type") is not None else ["Freehold", "Leasehold", "Cooperative"]
    else:
        prop_types = ["Apartment", "Independent_House", "Villa", "Plot"]
        owner_types = ["Freehold", "Leasehold", "Cooperative"]

    return {
        "districts": districts,
        "taluks_by_district": taluks_by_district,
        "property_types": prop_types,
        "ownership_types": owner_types
    }

@app.get("/meta")
def meta():
    return build_meta()

@app.post("/predict")
def predict(data: InputData):
    try:
        district_taluk = district_taluk_map.get((data.district, data.taluk), "Unknown_Taluk")

        input_dict = {
            "district_taluk": district_taluk,
            "property_type": data.property_type,
            "ownership_type": data.ownership_type,
            "built_area_sqft": data.built_area_sqft,
            "bedrooms": data.bedrooms,
            "bathrooms": data.bathrooms,
        }

        df = pd.DataFrame([input_dict])

        for col, le in label_encoders.items():
            if col in df.columns:
                if df.at[0, col] not in le.classes_:
                    le.classes_ = np.append(le.classes_, df.at[0, col])
                df[col] = le.transform(df[col])

        num_cols = ["built_area_sqft", "bedrooms", "bathrooms"]
        df[num_cols] = feature_scaler.transform(df[num_cols])
        df = df[feature_columns]

        prediction = model.predict(df)[0]
        price_inr = np.expm1(prediction)
        return {"predicted_price": round(float(price_inr), 2)}

    except Exception as e:
        return {"error": str(e)}

# === New Endpoint to Store User Inputs ===
class FormData(BaseModel):
    district: str
    taluk: str
    property_type: str
    ownership_type: str
    built_area_sqft: float
    bedrooms: int
    bathrooms: int

@app.post("/store_form_data")
def store_form_data(data: FormData):
    try:
        
        with psycopg2.connect(DATABASE_URL) as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO user_inputs
                    (district, taluk, property_type, ownership_type, built_area_sqft, bedrooms, bathrooms) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    data.district, data.taluk, data.property_type, data.ownership_type,
                    data.built_area_sqft, data.bedrooms, data.bathrooms
                ))
        return {"message": "Form data stored successfully!"}
    except Exception as e:
        return {"error": str(e)}


@app.get("/analytics/property_distribution")
def get_property_distribution():
    try:
        with psycopg2.connect(DATABASE_URL) as conn:
            df = pd.read_sql_query("SELECT * FROM user_inputs", conn)

        if df.empty:
            return {"message": "No data yet"}

        grouped = (
            df.groupby(["district", "taluk", "property_type", "ownership_type"])
            .size()
            .reset_index(name="count")
        )
        return grouped.to_dict(orient="records")
    except Exception as e:
        return {"error": str(e)}


@app.get("/analytics/trends")
def get_trends():
    try:
        with psycopg2.connect(DATABASE_URL) as conn:
            df = pd.read_sql_query("SELECT * FROM user_inputs", conn)

        if df.empty or "created_at" not in df.columns:
            return {"message": "No data yet"}

        df["date"] = pd.to_datetime(df["created_at"]).dt.date
        trend = df.groupby("date").size().reset_index(name="count")
        return trend.to_dict(orient="records")
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
def root():
    return {"message": "Tamil Nadu Property Price Prediction API is running."}
