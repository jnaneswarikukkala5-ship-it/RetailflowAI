"""Inventory business logic for RetailFlow AI."""

from __future__ import annotations

from database.db import db
from models.Inventory import Inventory
from models.Product import Product
from utils.helper import calculate_inventory_status


def refresh_inventory_status(inventory_item: Inventory) -> Inventory:
    """Keep a stock record aligned with the business thresholds."""

    inventory_item.status = calculate_inventory_status(inventory_item.quantity, inventory_item.reorder_level)
    db.session.add(inventory_item)
    db.session.flush()
    return inventory_item


def update_inventory_after_sale(product_id: int, sold_quantity: int) -> Inventory:
    """Decrease inventory after a sale and update the stock status."""

    inventory_item = Inventory.query.filter_by(product_id=product_id).first()
    if not inventory_item:
        raise ValueError("Inventory record not found for product")

    if sold_quantity > inventory_item.quantity:
        raise ValueError("Insufficient stock for this sale")

    inventory_item.quantity -= sold_quantity
    refresh_inventory_status(inventory_item)
    db.session.commit()
    return inventory_item


def create_inventory_record(product_id: int, quantity: int, reorder_level: int, warehouse_location: str) -> Inventory:
    inventory_item = Inventory(
        product_id=product_id,
        quantity=quantity,
        reorder_level=reorder_level,
        warehouse_location=warehouse_location,
    )
    refresh_inventory_status(inventory_item)
    db.session.add(inventory_item)
    db.session.commit()
    return inventory_item


def restock_recommendations() -> list[dict]:
    """Return products that need restocking soon."""

    recommendations = []
    for item in Inventory.query.join(Product).all():
        if item.status in {"Low Stock", "Out of Stock"}:
            recommended = max(item.reorder_level * 2 - item.quantity, item.reorder_level)
            recommendations.append(
                {
                    "product_id": item.product_id,
                    "product_name": item.product.product_name if item.product else None,
                    "warehouse_location": item.warehouse_location,
                    "current_stock": item.quantity,
                    "reorder_level": item.reorder_level,
                    "recommended_restock": recommended,
                    "status": item.status,
                }
            )
    return recommendations


def inventory_summary() -> dict:
    total_products = Inventory.query.count()
    low_stock = Inventory.query.filter(Inventory.status == "Low Stock").count()
    out_stock = Inventory.query.filter(Inventory.status == "Out of Stock").count()
    healthy = Inventory.query.filter(Inventory.status == "In Stock").count()

    return {
        "total_inventory_records": total_products,
        "healthy_items": healthy,
        "low_stock_items": low_stock,
        "out_of_stock_items": out_stock,
    }