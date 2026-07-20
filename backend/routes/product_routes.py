"""Product CRUD routes."""

from __future__ import annotations

from flask import Blueprint, jsonify, request

from database.db import db
from models.Product import Product
from utils.validator import positive_number, require_fields


product_bp = Blueprint("product_bp", __name__)


@product_bp.get("")
def list_products():
    products = Product.query.order_by(Product.created_at.desc()).all()
    return jsonify({"items": [item.to_dict() for item in products]}), 200


@product_bp.get("/<int:product_id>")
def get_product(product_id: int):
    product = Product.query.get_or_404(product_id)
    return jsonify({"item": product.to_dict()}), 200


@product_bp.post("")
def create_product():
    payload = request.get_json(silent=True) or {}
    missing = require_fields(payload, ["product_name", "category", "price", "barcode"])
    if missing:
        return jsonify({"message": "Missing required fields", "missing_fields": missing}), 400

    if not positive_number(payload.get("price")):
        return jsonify({"message": "Price must be a positive number"}), 400

    product = Product(
        product_name=payload["product_name"].strip(),
        category=payload["category"].strip(),
        description=payload.get("description", ""),
        price=float(payload["price"]),
        supplier=payload.get("supplier"),
        barcode=payload["barcode"].strip(),
    )

    db.session.add(product)
    db.session.commit()
    return jsonify({"message": "Product created", "item": product.to_dict()}), 201


@product_bp.put("/<int:product_id>")
def update_product(product_id: int):
    payload = request.get_json(silent=True) or {}
    product = Product.query.get_or_404(product_id)

    if "product_name" in payload:
        product.product_name = payload["product_name"].strip()
    if "category" in payload:
        product.category = payload["category"].strip()
    if "description" in payload:
        product.description = payload["description"]
    if "price" in payload and positive_number(payload["price"]):
        product.price = float(payload["price"])
    if "supplier" in payload:
        product.supplier = payload["supplier"]
    if "barcode" in payload:
        product.barcode = payload["barcode"].strip()

    db.session.commit()
    return jsonify({"message": "Product updated", "item": product.to_dict()}), 200


@product_bp.delete("/<int:product_id>")
def delete_product(product_id: int):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted"}), 200