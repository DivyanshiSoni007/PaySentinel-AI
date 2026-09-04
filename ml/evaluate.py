import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import precision_score, recall_score, f1_score


# Load dataset
df = pd.read_csv("dataset.csv")


# Separate features and target
X = df.drop("chargeback", axis=1)
y = df["chargeback"]


# Same train/test split used during training
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# Load trained model
model = joblib.load("models/risk_model.pkl")


# Get chargeback probabilities
probabilities = model.predict_proba(X_test)[:, 1]


# Business costs
FALSE_NEGATIVE_COST = 2500
FALSE_POSITIVE_COST = 100


print("\nCost-Based Threshold Analysis")
print("-" * 90)

best_threshold = None
lowest_cost = float("inf")


for threshold in [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80]:

    predictions = (probabilities >= threshold).astype(int)

    precision = precision_score(
        y_test,
        predictions,
        zero_division=0
    )

    recall = recall_score(
        y_test,
        predictions,
        zero_division=0
    )

    f1 = f1_score(
        y_test,
        predictions,
        zero_division=0
    )

    false_negatives = (
        (y_test == 1) & (predictions == 0)
    ).sum()

    false_positives = (
        (y_test == 0) & (predictions == 1)
    ).sum()

    total_cost = (
        false_negatives * FALSE_NEGATIVE_COST
        + false_positives * FALSE_POSITIVE_COST
    )

    print(
        f"Threshold: {threshold:.2f} | "
        f"Precision: {precision:.2f} | "
        f"Recall: {recall:.2f} | "
        f"F1: {f1:.2f} | "
        f"FN: {false_negatives} | "
        f"FP: {false_positives} | "
        f"Cost: ₹{total_cost:,.0f}"
    )

    if total_cost < lowest_cost:
        lowest_cost = total_cost
        best_threshold = threshold


print("\nBest Threshold:")
print(f"Threshold = {best_threshold:.2f}")
print(f"Minimum Estimated Cost = ₹{lowest_cost:,.0f}")