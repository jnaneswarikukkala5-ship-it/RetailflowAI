"""Authentication routes."""

from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash, generate_password_hash

from database.db import db
from models.User import User
from utils.validator import is_valid_email, require_fields


auth_bp = Blueprint("auth_bp", __name__)


@auth_bp.post("/register")
def register():
    payload = request.get_json(silent=True) or {}
    missing = require_fields(payload, ["name", "email", "password"])
    if missing:
        return jsonify({"message": "Missing required fields", "missing_fields": missing}), 400

    if not is_valid_email(payload["email"]):
        return jsonify({"message": "Please provide a valid email address"}), 400

    if User.query.filter_by(email=payload["email"]).first():
        return jsonify({"message": "Email already registered"}), 409

    user = User(
        name=payload["name"].strip(),
        email=payload["email"].strip().lower(),
        password_hash=generate_password_hash(payload["password"]),
        role=payload.get("role", "staff"),
    )
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id), additional_claims={"role": user.role, "email": user.email})
    return jsonify({"message": "Registration successful", "user": user.to_dict(), "access_token": token}), 201


@auth_bp.post("/login")
def login():
    payload = request.get_json(silent=True) or {}
    missing = require_fields(payload, ["email", "password"])
    if missing:
        return jsonify({"message": "Missing required fields", "missing_fields": missing}), 400

    user = User.query.filter_by(email=payload["email"].strip().lower()).first()
    if not user or not check_password_hash(user.password_hash, payload["password"]):
        return jsonify({"message": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user.id), additional_claims={"role": user.role, "email": user.email})
    return jsonify({"message": "Login successful", "user": user.to_dict(), "access_token": token}), 200