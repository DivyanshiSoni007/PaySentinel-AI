import pandas as pd
import joblib
import os


# --------------------------------------------------
# 1. Find the project folder
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# --------------------------------------------------
# 2. Locate the trained ML model
# --------------------------------------------------

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "risk_model.pkl"
)


# --------------------------------------------------
# 3. Load the trained model
# --------------------------------------------------

model = joblib.load(MODEL_PATH)


# --------------------------------------------------
# 4. Risk calculation function
# --------------------------------------------------

def calculate_risk(transaction):

    # Convert transaction dictionary into DataFrame
    data = pd.DataFrame([transaction])


    # Make sure features are in the same order
    # as they were during model training
    feature_order = [
        "amount",
        "account_age_days",
        "previous_orders",
        "failed_payments",
        "new_device",
        "transactions_last_hour",
        "location_changed",
        "delivery_completed"
    ]

    data = data[feature_order]


    # --------------------------------------------------
    # 5. Get chargeback probability
    # --------------------------------------------------

    probability = model.predict_proba(data)[0][1]


    # --------------------------------------------------
    # 6. Convert probability into Risk Score
    # --------------------------------------------------

    risk_score = round(probability * 100)


    # --------------------------------------------------
    # 7. Determine Risk Level and Decision
    # --------------------------------------------------

    if risk_score < 30:

        risk_level = "LOW"
        decision = "APPROVE"

    elif risk_score < 70:

        risk_level = "MEDIUM"
        decision = "REVIEW"

    else:

        risk_level = "HIGH"
        decision = "FLAG"


    # --------------------------------------------------
    # 8. Return Risk Assessment
    # --------------------------------------------------

    return {
        "risk_score": risk_score,
        "probability": round(float(probability), 4),
        "risk_level": risk_level,
        "decision": decision
    }