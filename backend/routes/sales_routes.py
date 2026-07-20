"""Sales routes."""

from __future__ import annotations

from datetime import datetime, timezone

from flask import Blueprint, jsonify, request

from database.db import db
from models.Inventory import Inventory
from models.Product import Product
from models.Sales import Sales
from services.inventory_service import update_inventory_after_sale
from services.analytics_service import sales_report
from utils.helper import money_to_float, now_utc
from utils.validator import positive_int, positive_number, require_fields


sales_bp = Blueprint("sales_bp", __name__)


@sales_bp.get("")
def list_sales():
    sales = Sales.query.order_by(Sales.sale_date.desc()).all()
    return jsonify({"items": [sale.to_dict() for sale in sales]}), 200


@sales_bp.post("")
def create_sale():
    payload = request.get_json(silent=True) or {}
    missing = require_fields(payload, ["product_id", "quantity"])
    if missing:
        return jsonify({"message": "Missing required fields", "missing_fields": missing}), 400

    if not positive_int(payload["quantity"], 1):
        return jsonify({"message": "Quantity must be a positive integer"}), 400

    product = Product.query.get(payload["product_id"])
    if not product:
        return jsonify({"message": "Product not found"}), 404

    inventory_item = Inventory.query.filter_by(product_id=product.id).first()
    if not inventory_item:
        return jsonify({"message": "Inventory record not found for this product"}), 404

    quantity = int(payload["quantity"])
    if quantity > inventory_item.quantity:
        return jsonify({"message": "Insufficient inventory for this sale"}), 400

    total_amount = payload.get("total_amount")
    if total_amount is None:
        total_amount = float(product.price) * quantity
    elif not positive_number(total_amount):
        return jsonify({"message": "Total amount must be a positive number"}), 400

    sale = Sales(
        product_id=product.id,
        quantity=quantity,
        total_amount=float(total_amount),
        customer_name=payload.get("customer_name"),
        payment_method=payload.get("payment_method"),
        sale_date=now_utc(),
    )

    db.session.add(sale)
    db.session.flush()

    updated_inventory = update_inventory_after_sale(product.id, quantity)

    db.session.commit()
    return jsonify(
        {
            "message": "Sale recorded",
            "item": sale.to_dict(),
            "inventory": updated_inventory.to_dict(),
        }
    ), 201


@sales_bp.get("/report")
def get_sales_report():
    return jsonify({"report": sales_report()}), 200