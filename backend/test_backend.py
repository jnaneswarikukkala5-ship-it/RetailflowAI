"""Automated REST API verification script for RetailFlow AI backend."""

from __future__ import annotations

import sys
import unittest
import json
from decimal import Decimal

from app import app
from database.db import db
from models.Product import Product
from models.Inventory import Inventory
from models.Sales import Sales
from models.Prediction import Prediction
from models.User import User


class RetailFlowAPITestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

        # Re-create database schemas for test runs
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_complete_backend_flow(self):
        print("\n--- Executing Test Step 1: Health Check ---")
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        print("Health check response:", data)
        self.assertEqual(data["status"], "ok")

        print("\n--- Executing Test Step 2: User Registration ---")
        reg_payload = {
            "name": "Jane Staff",
            "email": "jane@retailflow.ai",
            "password": "Password@123",
            "role": "staff"
        }
        res = self.client.post("/api/auth/register", json=reg_payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        print("Register response:", data)
        self.assertIn("access_token", data)
        self.assertEqual(data["user"]["email"], "jane@retailflow.ai")

        # Capture register token for authenticated requests (if needed by auth filters,
        # currently routes do not strictly enforce JWT for CRUD to ease hackathon frontend integration,
        # but auth endpoint returns it correctly as verified below)
        token = data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        print("\n--- Executing Test Step 3: User Login ---")
        login_payload = {
            "email": "jane@retailflow.ai",
            "password": "Password@123"
        }
        res = self.client.post("/api/auth/login", json=login_payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        print("Login response:", data)
        self.assertIn("access_token", data)

        print("\n--- Executing Test Step 4: Product CRUD Operations ---")
        # List products - should include default seed database products from seed_demo_data
        res = self.client.get("/api/products")
        self.assertEqual(res.status_code, 200)
        initial_products = res.get_json()["items"]
        print(f"Initially seeded products count: {len(initial_products)}")
        self.assertTrue(len(initial_products) >= 5)

        # Create new product
        new_prod = {
            "product_name": "Test Wireless Mouse",
            "category": "Electronics",
            "description": "Ergonomic 2.4Ghz wireless mouse",
            "price": 25.50,
            "supplier": "LogiTech Solutions",
            "barcode": "RF-TEST-MOUSE"
        }
        res = self.client.post("/api/products", json=new_prod)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        print("Create product response:", data)
        self.assertEqual(data["item"]["product_name"], "Test Wireless Mouse")
        new_product_id = data["item"]["id"]

        # View specific product
        res = self.client.get(f"/api/products/{new_product_id}")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json()["item"]["barcode"], "RF-TEST-MOUSE")

        # Update product
        up_prod = {
            "price": 29.99,
            "description": "Premium ergonomic 2.4Ghz wireless mouse"
        }
        res = self.client.put(f"/api/products/{new_product_id}", json=up_prod)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json()["item"]["price"], 29.99)
        self.assertEqual(res.get_json()["item"]["description"], "Premium ergonomic 2.4Ghz wireless mouse")

        print("\n--- Executing Test Step 5: Inventory Creation & Update ---")
        # List inventory
        res = self.client.get("/api/inventory")
        self.assertEqual(res.status_code, 200)
        inv_data = res.get_json()
        print("Initial inventory list summary:", inv_data["summary"])

        # Create Inventory for new product
        new_inv = {
            "product_id": new_product_id,
            "quantity": 10,
            "reorder_level": 5,
            "warehouse_location": "East Hub"
        }
        res = self.client.post("/api/inventory", json=new_inv)
        self.assertEqual(res.status_code, 201)
        inv_item = res.get_json()["item"]
        print("Create inventory response:", inv_item)
        self.assertEqual(inv_item["quantity"], 10)
        self.assertEqual(inv_item["status"], "In Stock")
        inventory_id = inv_item["id"]

        # Update inventory to trigger status threshold (Low Stock)
        up_inv = {
            "quantity": 4
        }
        res = self.client.put(f"/api/inventory/{inventory_id}", json=up_inv)
        self.assertEqual(res.status_code, 200)
        inv_item_updated = res.get_json()["item"]
        print("Update inventory response (trigger Low Stock):", inv_item_updated)
        self.assertEqual(inv_item_updated["quantity"], 4)
        self.assertEqual(inv_item_updated["status"], "Low Stock")

        print("\n--- Executing Test Step 6: Sales Operations (Deduct Stock & Low Stock triggers) ---")
        # Restore stock first to make sale
        self.client.put(f"/api/inventory/{inventory_id}", json={"quantity": 12})

        # List sales
        res = self.client.get("/api/sales")
        self.assertEqual(res.status_code, 200)
        initial_sales_count = len(res.get_json()["items"])
        print(f"Initially seeded sales count: {initial_sales_count}")

        # Post sale - 8 units (reorder level is 5, quantity drops from 12 to 4, which should trigger Low Stock)
        sale_payload = {
            "product_id": new_product_id,
            "quantity": 8,
            "customer_name": "Test Customer",
            "payment_method": "Card"
        }
        res = self.client.post("/api/sales", json=sale_payload)
        self.assertEqual(res.status_code, 201)
        sale_data = res.get_json()
        print("Post sale response:", sale_data)
        self.assertEqual(sale_data["inventory"]["quantity"], 4)
        self.assertEqual(sale_data["inventory"]["status"], "Low Stock")

        # Fetch sales report
        res = self.client.get("/api/sales/report")
        self.assertEqual(res.status_code, 200)
        report = res.get_json()["report"]
        print("Sales report:", report)
        self.assertTrue(report["total_orders"] > 0)

        print("\n--- Executing Test Step 7: Analytics API Dashboard Calculations ---")
        # Dashboard stats
        res = self.client.get("/api/analytics/dashboard")
        self.assertEqual(res.status_code, 200)
        print("Dashboard Analytics:", res.get_json()["dashboard"])

        # Revenue
        res = self.client.get("/api/analytics/revenue")
        self.assertEqual(res.status_code, 200)
        print("Revenue Summary:", res.get_json()["revenue"])

        # Top products
        res = self.client.get("/api/analytics/top-products")
        self.assertEqual(res.status_code, 200)
        print("Top Products:", res.get_json()["items"])

        # Monthly sales
        res = self.client.get("/api/analytics/monthly-sales")
        self.assertEqual(res.status_code, 200)
        print("Monthly Sales:", res.get_json()["items"])

        print("\n--- Executing Test Step 8: AI Analytics (ML predicting demand & restock levels) ---")
        # Predict Demand
        predict_payload = {
            "product_id": new_product_id
        }
        res = self.client.post("/api/ai/predict-demand", json=predict_payload)
        self.assertEqual(res.status_code, 201)
        pred_data = res.get_json()
        print("Demand prediction response:", pred_data)
        self.assertIn("predicted_demand", pred_data["prediction"])
        self.assertIn("restock_quantity", pred_data["prediction"])

        # AI Recommendations
        res = self.client.get("/api/ai/recommendations")
        self.assertEqual(res.status_code, 200)
        recs = res.get_json()
        print("AI Recommendations Keys found:", recs.keys())
        self.assertTrue(len(recs["forecast"]) > 0)

        # AI Restock
        res = self.client.get("/api/ai/restock")
        self.assertEqual(res.status_code, 200)
        restock_list = res.get_json()["items"]
        print("AI Restock Items count:", len(restock_list))

        print("\n--- Executing Test Step 9: Cleanup & Deletion Verification ---")
        # Deleted inventory
        res = self.client.delete(f"/api/inventory/{inventory_id}")
        self.assertEqual(res.status_code, 200)

        # Deleted product
        res = self.client.delete(f"/api/products/{new_product_id}")
        self.assertEqual(res.status_code, 200)

        print("\nAPI Testing Completed successfully!")


if __name__ == "__main__":
    unittest.main()
