"""AI routes for RetailFlow AI."""

from __future__ import annotations

from flask import Blueprint, jsonify, request

from models.Product import Product
from services.ai_service import predict_for_product, recommendation_summary, restock_forecast
from services.inventory_service import restock_recommendations
from utils.validator import positive_int, require_fields


ai_bp = Blueprint("ai_bp", __name__)


@ai_bp.post("/predict-demand")
def predict_demand():
    payload = request.get_json(silent=True) or {}
    missing = require_fields(payload, ["product_id"])
    if missing:
        return jsonify({"message": "Missing required fields", "missing_fields": missing}), 400

    if not positive_int(payload["product_id"], 1):
        return jsonify({"message": "Product ID must be a positive integer"}), 400

    try:
        prediction = predict_for_product(int(payload["product_id"]))
        return jsonify({"message": "Demand prediction created", "prediction": prediction}), 201
    except ValueError as exc:
        return jsonify({"message": str(exc)}), 404


@ai_bp.get("/restock")
def get_restock_recommendations():
    return jsonify({"items": restock_recommendations()}), 200


@ai_bp.get("/recommendations")
def get_recommendations():
    return jsonify(
        {
            "restock": restock_recommendations(),
            "predictions": recommendation_summary(),
            "forecast": restock_forecast(),
        }
    ), 200