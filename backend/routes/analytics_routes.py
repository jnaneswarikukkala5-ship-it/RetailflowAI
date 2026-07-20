"""Analytics routes."""

from __future__ import annotations

from flask import Blueprint, jsonify

from services.analytics_service import dashboard_stats, monthly_sales, revenue_summary, top_products


analytics_bp = Blueprint("analytics_bp", __name__)


@analytics_bp.get("/dashboard")
def get_dashboard():
    return jsonify({"dashboard": dashboard_stats()}), 200


@analytics_bp.get("/revenue")
def get_revenue():
    return jsonify({"revenue": revenue_summary()}), 200


@analytics_bp.get("/top-products")
def get_top_products():
    return jsonify({"items": top_products()}), 200


@analytics_bp.get("/monthly-sales")
def get_monthly_sales():
    return jsonify({"items": monthly_sales()}), 200