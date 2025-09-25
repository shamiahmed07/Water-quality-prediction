import streamlit as st
import pandas as pd
import numpy as np
import joblib
import os

# --- Load pre-trained model and scaler ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "water_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# --- Streamlit UI ---
st.title("💧 Water Quality Prediction App")
st.write("Enter the water chemical properties below and check if the water is **safe to drink** or not.")

# Input fields for all features
pH = st.number_input("pH", min_value=0.0, max_value=14.0, step=0.1)
hardness = st.number_input("Hardness", min_value=0.0, step=1.0)
solids = st.number_input("Solids (ppm)", min_value=0.0, step=10.0)
chloramines = st.number_input("Chloramines", min_value=0.0, step=0.1)
sulfate = st.number_input("Sulfate", min_value=0.0, step=1.0)
conductivity = st.number_input("Conductivity", min_value=0.0, step=1.0)
organic_carbon = st.number_input("Organic Carbon", min_value=0.0, step=0.1)
trihalomethanes = st.number_input("Trihalomethanes", min_value=0.0, step=0.1)
turbidity = st.number_input("Turbidity", min_value=0.0, step=0.1)

# Prediction button
if st.button("Predict Water Quality"):
    input_data = np.array([[pH, hardness, solids, chloramines, sulfate, conductivity,
                            organic_carbon, trihalomethanes, turbidity]])
    input_data = scaler.transform(input_data)
    prediction = model.predict(input_data)[0]

    if prediction == 1:
        st.success("✅ The water is SAFE to drink.")
    else:
        st.error("⚠️ The water is NOT SAFE to drink.")
