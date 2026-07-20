"""Application configuration for RetailFlow AI."""

from __future__ import annotations

import os
from datetime import timedelta


def build_database_uri() -> str:
    """Build a MySQL URI from environment variables with a SQLite fallback."""

    explicit_uri = os.getenv("DATABASE_URL")
    if explicit_uri:
        return explicit_uri

    mysql_host = os.getenv("MYSQL_HOST")
    mysql_user = os.getenv("MYSQL_USER")
    mysql_password = os.getenv("MYSQL_PASSWORD")
    mysql_db = os.getenv("MYSQL_DATABASE")
    mysql_port = os.getenv("MYSQL_PORT", "3306")

    if all([mysql_host, mysql_user, mysql_password, mysql_db]):
        return f"mysql+pymysql://{mysql_user}:{mysql_password}@{mysql_host}:{mysql_port}/{mysql_db}?charset=utf8mb4"

    # This fallback keeps the app runnable for a hackathon demo even without MySQL.
    return os.getenv("SQLITE_DATABASE_URL", "sqlite:///retailflow.db")


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "retailflow-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "retailflow-jwt-secret")
    SQLALCHEMY_DATABASE_URI = build_database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")