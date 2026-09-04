import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

from xgboost import XGBClassifier

import joblib


# 1. Load dataset
df = pd.read_csv("dataset.csv")


# 2. Separate features and target
X = df.drop("chargeback", axis=1)
y = df["chargeback"]


# 3. Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# 4. Create XGBoost model
model = XGBClassifier(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    scale_pos_weight=24.67,
    eval_metric="logloss",
    random_state=42
)


# 5. Train the model
model.fit(X_train, y_train)


# 6. Make predictions
y_pred = model.predict(X_test)

y_probability = model.predict_proba(X_test)[:, 1]


# 7. Evaluate the model
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nROC-AUC Score:")
print(roc_auc_score(y_test, y_probability))


# 8. Save the trained model
joblib.dump(model, "models/risk_model.pkl")

print("\nModel saved successfully!")