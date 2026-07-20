"""Prediction helper for the trained inventory model."""

from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np


MODEL_PATH = Path(__file__).resolve().parent / "inventory_model.pkl"


def load_model_artifact(path: str | None = None) -> dict:
    model_path = Path(path or MODEL_PATH)
    if not model_path.exists():
        from ml.train_model import train_and_save_model

        return train_and_save_model(str(model_path))
    return joblib.load(model_path)


def predict_demand(feature_vector, path: str | None = None) -> dict:
    artifact = load_model_artifact(path)
    model = artifact["model"]
    confidence = artifact.get("confidence", 0.85)

    prediction = model.predict(np.array([feature_vector], dtype=float))[0]
    expected_demand = int(max(1, round(prediction[0])))
    restock_quantity = int(max(0, round(prediction[1])))

    return {
        "predicted_demand": expected_demand,
        "restock_quantity": restock_quantity,
        "confidence_score": float(confidence),
    }