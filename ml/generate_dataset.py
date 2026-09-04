import pandas as pd
import numpy as np

np.random.seed(42)

n = 20000

amount = np.random.lognormal(mean=7, sigma=1, size=n)
amount = np.round(amount, 2)

account_age_days = np.random.exponential(scale=180, size=n)
account_age_days = np.clip(account_age_days, 1, 2000).astype(int)

previous_orders = np.random.poisson(lam=5, size=n)

failed_payments = np.random.poisson(lam=1, size=n)

new_device = np.random.binomial(1, 0.20, size=n)

transactions_last_hour = np.random.poisson(lam=2, size=n)

location_changed = np.random.binomial(1, 0.15, size=n)

delivery_completed = np.random.binomial(1, 0.90, size=n)

risk_score = (
    (amount > 30000) * 1.5
    + (account_age_days < 7) * 2
    + (previous_orders < 2) * 1
    + (failed_payments >= 3) * 2
    + new_device * 2
    + (transactions_last_hour >= 8) * 2
    + location_changed * 1.5
    + (delivery_completed == 0) * 1.5
)

probability = 1 / (1 + np.exp(-risk_score + 5))

chargeback = np.random.binomial(1, probability)

df = pd.DataFrame({
    "amount": amount,
    "account_age_days": account_age_days,
    "previous_orders": previous_orders,
    "failed_payments": failed_payments,
    "new_device": new_device,
    "transactions_last_hour": transactions_last_hour,
    "location_changed": location_changed,
    "delivery_completed": delivery_completed,
    "chargeback": chargeback
})

df.to_csv("dataset.csv", index=False)

print("Dataset created successfully!")
print(f"Total transactions: {len(df)}")
print(f"Chargebacks: {df['chargeback'].sum()}")
print(f"Normal transactions: {(df['chargeback'] == 0).sum()}")