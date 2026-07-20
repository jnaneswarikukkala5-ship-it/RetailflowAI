"""RetailFlow AI backend entry point.

This module creates the Flask app, registers blueprints, initializes the
database, and seeds realistic demo data for a hackathon presentation.
"""

from __future__ import annotations

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.security import generate_password_hash

from config import Config
from database.db import db
from models.Inventory import Inventory
from models.Prediction import Prediction
from models.Product import Product
from models.Sales import Sales
from models.User import User
from routes.ai_routes import ai_bp
from routes.analytics_routes import analytics_bp
from routes.auth_routes import auth_bp
from routes.inventory_routes import inventory_bp
from routes.product_routes import product_bp
from routes.sales_routes import sales_bp
from utils.helper import calculate_inventory_status, now_utc


def seed_demo_data() -> None:
    """Insert realistic sample data when the database is empty."""

    if Product.query.first():
        return

    admin = User(
        name="Retail Admin",
        email="admin@retailflow.ai",
        password_hash=generate_password_hash("Admin@123"),
        role="admin",
    )

    products = [
        Product(product_name="Premium Headphones", category="Electronics", description="Noise-cancelling over-ear headphones.", price=129.99, supplier="SoundWave Inc.", barcode="RF-1001"),
        Product(product_name="Office Chair", category="Furniture", description="Ergonomic chair with lumbar support.", price=249.00, supplier="ComfortWorks", barcode="RF-1002"),
        Product(product_name="Smart Speaker", category="Electronics", description="Voice-enabled smart speaker for home and retail use.", price=89.50, supplier="NextGen Audio", barcode="RF-1003"),
        Product(product_name="Travel Backpack", category="Accessories", description="Water-resistant backpack with laptop compartment.", price=59.00, supplier="UrbanCarry", barcode="RF-1004"),
        Product(product_name="Desk Lamp", category="Home", description="LED desk lamp with adjustable brightness.", price=39.00, supplier="BrightLine", barcode="RF-1005"),
    ]

    db.session.add(admin)
    db.session.add_all(products)
    db.session.flush()

    inventory_rows = [
        Inventory(product_id=products[0].id, quantity=74, reorder_level=40, warehouse_location="North Hub"),
        Inventory(product_id=products[1].id, quantity=21, reorder_level=25, warehouse_location="West Hub"),
        Inventory(product_id=products[2].id, quantity=46, reorder_level=30, warehouse_location="South Hub"),
        Inventory(product_id=products[3].id, quantity=18, reorder_level=24, warehouse_location="East Hub"),
        Inventory(product_id=products[4].id, quantity=62, reorder_level=35, warehouse_location="Central Hub"),
    ]

    sales_rows = [
        Sales(product_id=products[0].id, quantity=8, total_amount=1039.92, customer_name="Ava Martinez", payment_method="Card", sale_date=now_utc()),
        Sales(product_id=products[2].id, quantity=10, total_amount=895.00, customer_name="Noah Lee", payment_method="UPI", sale_date=now_utc()),
        Sales(product_id=products[4].id, quantity=12, total_amount=468.00, customer_name="Olivia Chen", payment_method="Cash", sale_date=now_utc()),
    ]

    predictions = [
        Prediction(product_id=products[0].id, predicted_demand=92, recommendation="Order 28 units within 5 days", confidence_score=0.94),
        Prediction(product_id=products[3].id, predicted_demand=44, recommendation="Raise stock by 18 units", confidence_score=0.89),
    ]

    for item in inventory_rows:
        item.status = calculate_inventory_status(item.quantity, item.reorder_level)

    db.session.add_all(inventory_rows + sales_rows + predictions)
    db.session.commit()


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS", "*")}})
    JWTManager(app)
    db.init_app(app)

    # Register every API surface as a blueprint.
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(product_bp, url_prefix="/api/products")
    app.register_blueprint(inventory_bp, url_prefix="/api/inventory")
    app.register_blueprint(sales_bp, url_prefix="/api/sales")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")

    @app.get("/api/health")
    def health_check():
        return jsonify({"status": "ok", "service": "RetailFlow AI API"})

    with app.app_context():
        db.create_all()
        seed_demo_data()

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)