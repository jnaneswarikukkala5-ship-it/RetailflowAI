"""AI recommendation logic for RetailFlow AI."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from pathlib import Path

from database.db import db
from models.Inventory import Inventory
from models.Prediction import Prediction
from models.Product import Product
from models.Sales import Sales
from ml.predict import load_model_artifact, predict_demand
from utils.helper import money_to_float


MODEL_PATH = Path(__file__).resolve().parents[1] / "ml" / "inventory_model.pkl"


def _feature_vector(product: Product, inventory_item: Inventory, avg_daily_sales: float) -> list[float]:
    artifact = load_model_artifact(str(MODEL_PATH))
    category_map = artifact.get("category_map", {})
    category_code = category_map.get(product.category, 0)
    return [
        float(category_code),
        float(product.price),
        float(inventory_item.quantity if inventory_item else 0),
        float(inventory_item.reorder_level if inventory_item else 0),
        float(avg_daily_sales),
        1.0,
    ]


def average_daily_sales(product_id: int, lookback_days: int = 90) -> float:
    start = datetime.now(timezone.utc) - timedelta(days=lookback_days)
    sales = Sales.query.filter(Sales.product_id == product_id, Sales.sale_date >= start).all()
    total_quantity = sum(sale.quantity for sale in sales)
    return round(total_quantity / lookback_days, 2) if lookback_days else 0.0


def predict_for_product(product_id: int) -> dict:
    product = Product.query.get(product_id)
    if not product:
        raise ValueError("Product not found")

    inventory_item = Inventory.query.filter_by(product_id=product_id).first()
    avg_sales = average_daily_sales(product_id)
    feature_vector = _feature_vector(product, inventory_item, avg_sales)
    result = predict_demand(feature_vector, str(MODEL_PATH))

    recommendation = "Hold stock"
    if result["restock_quantity"] > 0 or (inventory_item and inventory_item.status != "In Stock"):
        recommendation = f"Restock {max(result['restock_quantity'], inventory_item.reorder_level if inventory_item else 0)} units"

    prediction_row = Prediction(
        product_id=product_id,
        predicted_demand=result["predicted_demand"],
        recommendation=recommendation,
        confidence_score=result["confidence_score"],
    )
    db.session.add(prediction_row)
    db.session.commit()

    return {
        "product_id": product_id,
        "product_name": product.product_name,
        "predicted_demand": result["predicted_demand"],
        "restock_quantity": result["restock_quantity"],
        "confidence_score": result["confidence_score"],
        "recommendation": recommendation,
        "current_stock": inventory_item.quantity if inventory_item else 0,
        "reorder_level": inventory_item.reorder_level if inventory_item else 0,
    }


def restock_forecast() -> list[dict]:
    insights = []
    for product in Product.query.all():
        insights.append(predict_for_product(product.id))
    return insights


def recommendation_summary() -> list[dict]:
    rows = Prediction.query.order_by(Prediction.created_at.desc()).limit(10).all()
    return [row.to_dict() for row in rows]