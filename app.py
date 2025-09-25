import streamlit as st
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

# --- Load dataset ---
dataset = pd.read_csv(r"C:\Users\asrar\OneDrive\Desktop\html code\website\water quality prediction\water_potability.csv")
dataset = dataset.fillna(dataset.mean())

X = dataset.drop("Potability", axis=1)
y = dataset["Potability"]

# --- Train/test split ---
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# --- Feature scaling ---
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# --- Train Random Forest (better for classification) ---
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

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
