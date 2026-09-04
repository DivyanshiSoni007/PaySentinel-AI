from risk_engine import calculate_risk


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


result = calculate_risk(transaction)


print("\nPaySentinel AI Risk Assessment")
print("-" * 40)

print(f"Risk Score : {result['risk_score']}/100")
print(f"Probability: {result['probability']}")
print(f"Risk Level : {result['risk_level']}")
print(f"Decision   : {result['decision']}")