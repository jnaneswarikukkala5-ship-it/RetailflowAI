"""Analytics calculations for RetailFlow AI."""

from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timezone

from sqlalchemy import func

from database.db import db
from models.Inventory import Inventory
from models.Product import Product
from models.Sales import Sales
from utils.helper import money_to_float


def _sales_totals() -> dict:
    total_sales = Sales.query.count()
    revenue = db.session.query(func.coalesce(func.sum(Sales.total_amount), 0)).scalar() or 0
    return {"total_sales": total_sales, "revenue": money_to_float(revenue)}


def dashboard_stats() -> dict:
    totals = _sales_totals()
    product_count = Product.query.count()
    inventory_count = Inventory.query.count()
    low_stock_alerts = Inventory.query.filter(Inventory.status.in_(["Low Stock", "Out of Stock"])).count()
    estimated_profit = round(totals["revenue"] * 0.3, 2)

    return {
        "total_products": product_count,
        "total_inventory_records": inventory_count,
        "total_sales": totals["total_sales"],
        "revenue": round(totals["revenue"], 2),
        "estimated_profit": estimated_profit,
        "low_stock_alerts": low_stock_alerts,
        "average_order_value": round(totals["revenue"] / totals["total_sales"], 2) if totals["total_sales"] else 0,
    }


def revenue_summary() -> dict:
    totals = _sales_totals()
    estimated_profit = round(totals["revenue"] * 0.3, 2)
    return {
        "revenue": round(totals["revenue"], 2),
        "estimated_profit": estimated_profit,
        "profit_margin": 30.0,
    }


def top_products(limit: int = 5) -> list[dict]:
    rows = (
        db.session.query(
            Product.id.label("product_id"),
            Product.product_name.label("product_name"),
            func.coalesce(func.sum(Sales.quantity), 0).label("units_sold"),
            func.coalesce(func.sum(Sales.total_amount), 0).label("revenue"),
        )
        .outerjoin(Sales, Sales.product_id == Product.id)
        .group_by(Product.id)
        .order_by(func.coalesce(func.sum(Sales.quantity), 0).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "product_id": row.product_id,
            "product_name": row.product_name,
            "units_sold": int(row.units_sold or 0),
            "revenue": round(money_to_float(row.revenue), 2),
        }
        for row in rows
    ]


def monthly_sales() -> list[dict]:
    grouped: dict[str, dict] = defaultdict(lambda: {"month": "", "sales": 0, "revenue": 0.0})

    for sale in Sales.query.order_by(Sales.sale_date.asc()).all():
        month_key = sale.sale_date.astimezone(timezone.utc).strftime("%Y-%m")
        grouped[month_key]["month"] = month_key
        grouped[month_key]["sales"] += sale.quantity
        grouped[month_key]["revenue"] += money_to_float(sale.total_amount)

    return [
        {"month": value["month"], "sales": value["sales"], "revenue": round(value["revenue"], 2)}
        for value in grouped.values()
    ]


def sales_report() -> dict:
    sales = Sales.query.order_by(Sales.sale_date.desc()).all()
    revenue = sum(money_to_float(item.total_amount) for item in sales)
    
    now = datetime.now(timezone.utc)
    daily_count = 0
    weekly_count = 0
    monthly_count = 0
    
    for sale in sales:
        s_date = sale.sale_date
        if s_date.tzinfo is None:
            s_date = s_date.replace(tzinfo=timezone.utc)
        else:
            s_date = s_date.astimezone(timezone.utc)
            
        days_diff = (now - s_date).days
        if s_date.date() == now.date():
            daily_count += 1
        if days_diff <= 7:
            weekly_count += 1
        if days_diff <= 30:
            monthly_count += 1

    return {
        "daily_sales": daily_count,
        "weekly_sales": weekly_count,
        "monthly_sales": monthly_count,
        "total_revenue": round(revenue, 2),
        "total_orders": len(sales),
    }