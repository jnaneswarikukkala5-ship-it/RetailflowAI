"""Prediction model."""

from __future__ import annotations

from datetime import datetime, timezone

from database.db import db


class Prediction(db.Model):
    __tablename__ = "predictions"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    predicted_demand = db.Column(db.Integer, nullable=False)
    recommendation = db.Column(db.String(255), nullable=False)
    confidence_score = db.Column(db.Float, nullable=False, default=0.0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    product = db.relationship("Product", back_populates="predictions")

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "product_name": self.product.product_name if self.product else None,
            "predicted_demand": self.predicted_demand,
            "recommendation": self.recommendation,
            "confidence_score": self.confidence_score,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }