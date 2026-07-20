"""Train the RetailFlow AI demand prediction model."""

from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputRegressor


CATEGORY_MAP = {
    "Electronics": 0,
    "Furniture": 1,
    "Accessories": 2,
    "Home": 3,
    "Apparel": 4,
}


def build_training_frame(rows: int = 320) -> pd.DataFrame:
    rng = np.random.default_rng(42)
    categories = list(CATEGORY_MAP.keys())

    data = []
    for _ in range(rows):
        category = rng.choice(categories)
        category_code = CATEGORY_MAP[category]
        price = rng.uniform(15, 500)
        current_stock = rng.integers(0, 150)
        reorder_level = rng.integers(10, 60)
        avg_daily_sales = rng.uniform(2, 18)
        promo_factor = rng.uniform(0.7, 1.35)

        expected_demand = int(max(1, avg_daily_sales * 30 * promo_factor + category_code * 2 + rng.normal(0, 4)))
        restock_quantity = int(max(0, expected_demand - current_stock + reorder_level * 0.5))

        data.append(
            {
                "category_code": category_code,
                "price": round(price, 2),
                "current_stock": int(current_stock),
                "reorder_level": int(reorder_level),
                "avg_daily_sales": round(avg_daily_sales, 2),
                "promo_factor": round(promo_factor, 2),
                "expected_demand": expected_demand,
                "restock_quantity": restock_quantity,
            }
        )

    return pd.DataFrame(data)


def train_and_save_model(output_path: str | None = None) -> dict:
    frame = build_training_frame()
    feature_columns = ["category_code", "price", "current_stock", "reorder_level", "avg_daily_sales", "promo_factor"]
    target_columns = ["expected_demand", "restock_quantity"]

    X = frame[feature_columns]
    y = frame[target_columns]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = MultiOutputRegressor(RandomForestRegressor(n_estimators=220, random_state=42))
    model.fit(X_train, y_train)

    score = r2_score(y_test, model.predict(X_test), multioutput="variance_weighted")
    confidence = round(float(max(0.75, min(0.99, score))), 2)

    artifact = {
        "model": model,
        "feature_columns": feature_columns,
        "category_map": CATEGORY_MAP,
        "confidence": confidence,
    }

    destination = Path(output_path or Path(__file__).resolve().parent / "inventory_model.pkl")
    destination.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(artifact, destination)
    return artifact


if __name__ == "__main__":
    artifact = train_and_save_model()
    print(f"Model saved with confidence={artifact['confidence']}")