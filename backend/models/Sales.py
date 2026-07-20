"""Sales model."""

from __future__ import annotations

from datetime import datetime, timezone

from database.db import db


class Sales(db.Model):
    __tablename__ = "sales"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    customer_name = db.Column(db.String(150), nullable=True)
    payment_method = db.Column(db.String(50), nullable=True)
    sale_date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    product = db.relationship("Product", back_populates="sales")

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "product_name": self.product.product_name if self.product else None,
            "quantity": self.quantity,
            "total_amount": float(self.total_amount),
            "customer_name": self.customer_name,
            "payment_method": self.payment_method,
            "sale_date": self.sale_date.isoformat() if self.sale_date else None,
        }