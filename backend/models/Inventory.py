"""Inventory model."""

from __future__ import annotations

from datetime import datetime, timezone

from database.db import db


class Inventory(db.Model):
    __tablename__ = "inventory"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id", ondelete="CASCADE"), nullable=False, unique=True)
    quantity = db.Column(db.Integer, nullable=False, default=0)
    reorder_level = db.Column(db.Integer, nullable=False, default=0)
    warehouse_location = db.Column(db.String(150), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="In Stock")
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    product = db.relationship("Product", back_populates="inventory")

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "product_name": self.product.product_name if self.product else None,
            "quantity": self.quantity,
            "reorder_level": self.reorder_level,
            "warehouse_location": self.warehouse_location,
            "status": self.status,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }