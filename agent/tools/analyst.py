import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os
from langchain.tools import tool

@tool
def analyse_data(filename: str) -> str:
    """Automatically analyse a CSV file and return insights including stats and charts."""
    filepath = os.path.join("uploads", filename)

    if not os.path.exists(filepath):
        return f"File '{filename}' not found in the uploads folder."

    df = pd.read_csv(filepath)
    summary = []

    summary.append(f"Shape: {df.shape[0]} rows x {df.shape[1]} columns")
    summary.append(f"Columns: {', '.join(df.columns.tolist())}")
    summary.append(f"\nMissing Values:\n{df.isnull().sum().to_string()}")
    summary.append(f"\nBasic Statistics:\n{df.describe().to_string()}")

    numeric_cols = df.select_dtypes(include='number').columns
    if len(numeric_cols) > 1:
        corr = df[numeric_cols].corr()
        summary.append(f"\nCorrelation Matrix:\n{corr.to_string()}")

        plt.figure(figsize=(10, 8))
        sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
        plt.title("Correlation Heatmap")
        plt.tight_layout()
        plt.savefig("uploads/correlation_heatmap.png")
        plt.close()
        summary.append("\n✅ Heatmap saved → uploads/correlation_heatmap.png")

    return "\n".join(summary)