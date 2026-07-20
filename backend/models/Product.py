"""Product model."""

from __future__ import annotations

from datetime import datetime, timezone

from database.db import db


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(150), nullable=False, index=True)
    category = db.Column(db.String(100), nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    supplier = db.Column(db.String(150), nullable=True)
    barcode = db.Column(db.String(100), unique=True, nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    inventory = db.relationship("Inventory", back_populates="product", cascade="all, delete-orphan", uselist=False)
    sales = db.relationship("Sales", back_populates="product", cascade="all, delete-orphan")
    predictions = db.relationship("Prediction", back_populates="product", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "product_name": self.product_name,
            "category": self.category,
            "description": self.description,
            "price": float(self.price),
            "supplier": self.supplier,
            "barcode": self.barcode,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }