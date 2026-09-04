import pandas as pd
import joblib
import shap
import os


# --------------------------------------------------
# 1. Locate the trained model
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "risk_model.pkl"
)


# --------------------------------------------------
# 2. Load the trained model
# --------------------------------------------------

model = joblib.load(MODEL_PATH)


# --------------------------------------------------
# 3. Feature descriptions
# --------------------------------------------------

FEATURE_DESCRIPTIONS = {

    "failed_payments":
        "Multiple failed payments detected",

    "location_changed":
        "Customer location changed",

    "new_device":
        "New device detected",

    "account_age_days":
        "Account age contributed to the risk",

    "delivery_completed":
        "Delivery status affected the risk score",

    "amount":
        "Transaction amount affected the risk score",

    "previous_orders":
        "Previous order history affected the risk score",

    "transactions_last_hour":
        "Transaction activity affected the risk score"
}


# --------------------------------------------------
# 4. Generate risk explanation
# --------------------------------------------------

def explain_transaction(transaction):

    # Convert transaction into DataFrame
    data = pd.DataFrame([transaction])

    # Keep the same feature order as training
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
    # 5. Create SHAP explainer
    # --------------------------------------------------

    explainer = shap.TreeExplainer(model)

    shap_values = explainer.shap_values(data)


    # --------------------------------------------------
    # 6. Handle SHAP output
    # --------------------------------------------------

    if isinstance(shap_values, list):

        contributions = shap_values[0]

    else:

        contributions = shap_values


    # Convert to simple array
    contributions = contributions[0]


    # --------------------------------------------------
    # 7. Create explanation table
    # --------------------------------------------------

    explanation = pd.DataFrame({
        "feature": feature_order,
        "contribution": contributions
    })


    # --------------------------------------------------
    # 8. Sort by strongest contribution
    # --------------------------------------------------

    explanation["absolute_contribution"] = (
        explanation["contribution"].abs()
    )

    explanation = explanation.sort_values(
        by="absolute_contribution",
        ascending=False
    )


    # --------------------------------------------------
    # 9. Generate human-readable factors
    # --------------------------------------------------

    risk_factors = []
    protective_factors = []


    for _, row in explanation.iterrows():

        feature = row["feature"]
        contribution = row["contribution"]

        description = FEATURE_DESCRIPTIONS.get(
            feature,
            feature
        )


        if contribution > 0:

            risk_factors.append({
                "feature": feature,
                "reason": description,
                "contribution": round(
                    float(contribution), 4
                )
            })

        else:

            protective_factors.append({
                "feature": feature,
                "reason": description,
                "contribution": round(
                    float(contribution), 4
                )
            })


    # --------------------------------------------------
    # 10. Return explanation
    # --------------------------------------------------

    return {
        "risk_factors": risk_factors[:5],
        "protective_factors": protective_factors[:3]
    }