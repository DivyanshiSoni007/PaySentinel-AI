import pandas as pd

df = pd.read_csv("dataset.csv")

print("\nFirst 5 Transactions:")
print(df.head())

print("\nDataset Information:")
print(df.info())

print("\nDataset Shape:")
print(df.shape)

print("\nMissing Values:")
print(df.isnull().sum())

print("\nChargeback Distribution:")
print(df["chargeback"].value_counts())