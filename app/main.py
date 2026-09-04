from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ml.risk_engine import calculate_risk
from ml.explanation_engine import explain_transaction


# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(
    title="PaySentinel AI",
    description="AI-powered payment risk assessment system",
    version="2.0"
)


# ============================================================
# CORS
# Allows frontend running on port 5500
# to communicate with backend running on port 8000
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Transaction Input Model
# ============================================================

class Transaction(BaseModel):

    amount: float

    account_age_days: int

    previous_orders: int

    failed_payments: int

    new_device: int

    transactions_last_hour: int

    location_changed: int

    delivery_completed: int


# ============================================================
# Home Endpoint
# ============================================================

@app.get("/")
def home():

    return {
        "message": "PaySentinel AI Risk Manager is running",
        "status": "online",
        "version": "2.0"
    }


# ============================================================
# Health Check
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "service": "PaySentinel AI",
        "api_version": "2.0"
    }


# ============================================================
# Risk Assessment
# ============================================================

@app.post("/risk/check")
def check_risk(transaction: Transaction):

    # Convert Pydantic object to dictionary
    transaction_data = transaction.model_dump()

    # Calculate ML risk
    result = calculate_risk(transaction_data)

    # Generate explanation
    explanation = explain_transaction(transaction_data)

    # Return complete response
    return {

        "risk_score": result["risk_score"],

        "probability": result["probability"],

        "risk_level": result["risk_level"],

        "decision": result["decision"],

        "risk_factors": explanation["risk_factors"],

        "protective_factors": explanation["protective_factors"],

        "api_version": "2.0"
    }