"""Inventory routes."""

from __future__ import annotations

from flask import Blueprint, jsonify, request

from database.db import db
from models.Inventory import Inventory
from models.Product import Product
from services.inventory_service import create_inventory_record, inventory_summary, refresh_inventory_status, restock_recommendations
from utils.validator import positive_int, require_fields


inventory_bp = Blueprint("inventory_bp", __name__)


@inventory_bp.get("")
def list_inventory():
    rows = Inventory.query.order_by(Inventory.updated_at.desc()).all()
    return jsonify({"items": [row.to_dict() for row in rows], "summary": inventory_summary(), "restock": restock_recommendations()}), 200


@inventory_bp.post("")
def create_inventory():
    payload = request.get_json(silent=True) or {}
    missing = require_fields(payload, ["product_id", "quantity", "reorder_level", "warehouse_location"])
    if missing:
        return jsonify({"message": "Missing required fields", "missing_fields": missing}), 400

    if not positive_int(payload["quantity"], 0) or not positive_int(payload["reorder_level"], 0):
        return jsonify({"message": "Quantity and reorder level must be non-negative integers"}), 400

    if not Product.query.get(payload["product_id"]):
        return jsonify({"message": "Product not found"}), 404

    if Inventory.query.filter_by(product_id=payload["product_id"]).first():
        return jsonify({"message": "Inventory already exists for this product"}), 409

    item = create_inventory_record(
        product_id=int(payload["product_id"]),
        quantity=int(payload["quantity"]),
        reorder_level=int(payload["reorder_level"]),
        warehouse_location=payload["warehouse_location"].strip(),
    )
    return jsonify({"message": "Inventory created", "item": item.to_dict()}), 201


@inventory_bp.put("/<int:inventory_id>")
def update_inventory(inventory_id: int):
    payload = request.get_json(silent=True) or {}
    item = Inventory.query.get_or_404(inventory_id)

    if "quantity" in payload and positive_int(payload["quantity"], 0):
        item.quantity = int(payload["quantity"])
    if "reorder_level" in payload and positive_int(payload["reorder_level"], 0):
        item.reorder_level = int(payload["reorder_level"])
    if "warehouse_location" in payload:
        item.warehouse_location = payload["warehouse_location"].strip()

    refresh_inventory_status(item)
    db.session.commit()
    return jsonify({"message": "Inventory updated", "item": item.to_dict()}), 200


@inventory_bp.delete("/<int:inventory_id>")
def delete_inventory(inventory_id: int):
    item = Inventory.query.get_or_404(inventory_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Inventory deleted"}), 200