import pandas as pd
import joblib
import shap


# Load trained model
model = joblib.load("models/risk_model.pkl")


# Example transaction
transaction = {
    "amount": 50000,
    "account_age_days": 2,
    "previous_orders": 0,
    "failed_payments": 4,
    "new_device": 1,
    "transactions_last_hour": 10,
    "location_changed": 1,
    "delivery_completed": 0
}


# Convert transaction to DataFrame
data = pd.DataFrame([transaction])


# Create SHAP explainer
explainer = shap.TreeExplainer(model)


# Calculate SHAP values
shap_values = explainer.shap_values(data)


# Get feature contributions
contributions = shap_values[0]


# Create a table of feature contributions
explanation = pd.DataFrame({
    "feature": data.columns,
    "contribution": contributions
})


# Sort by strongest contribution
explanation["absolute_contribution"] = explanation["contribution"].abs()

explanation = explanation.sort_values(
    by="absolute_contribution",
    ascending=False
)


print("\nPaySentinel AI - Risk Explanation")
print("-" * 50)

feature_descriptions = {
    "failed_payments": "Multiple failed payments detected",
    "location_changed": "Customer location changed",
    "new_device": "New device detected",
    "account_age_days": "Account age is a risk factor",
    "delivery_completed": "Delivery status affected the risk score",
    "amount": "Transaction amount affected the risk score",
    "previous_orders": "Previous order history affected the risk score",
    "transactions_last_hour": "High transaction activity affected the risk score"
}


print("\nHuman-Readable Risk Factors")
print("-" * 50)

for _, row in explanation.iterrows():

    feature = row["feature"]
    contribution = row["contribution"]

    description = feature_descriptions.get(
        feature,
        feature
    )

    if contribution > 0:
        print(f"🔴 {description} → Increased Risk")
    else:
        print(f"🟢 {description} → Reduced Risk")