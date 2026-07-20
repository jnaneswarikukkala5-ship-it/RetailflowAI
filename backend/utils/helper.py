"""General helpers used across the RetailFlow AI backend."""

from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def calculate_inventory_status(quantity: int, reorder_level: int) -> str:
    """Translate quantity/reorder level into a human-readable stock status."""

    if quantity <= 0:
        return "Out of Stock"
    if quantity <= reorder_level:
        return "Low Stock"
    return "In Stock"


def money_to_float(value) -> float:
    if isinstance(value, Decimal):
        return float(value)
    return float(value or 0)


def percent(value: float, total: float) -> float:
    if not total:
        return 0.0
    return round((value / total) * 100, 2)