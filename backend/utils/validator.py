"""Request validation helpers."""

from __future__ import annotations

import re


EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def is_valid_email(email: str) -> bool:
    return bool(email and EMAIL_PATTERN.match(email))


def require_fields(payload: dict, fields: list[str]) -> list[str]:
    """Return a list of missing fields for a request payload."""

    missing = [field for field in fields if field not in payload or payload[field] in (None, "")]
    return missing


def positive_int(value, minimum: int = 0) -> bool:
    try:
        return int(value) >= minimum
    except (TypeError, ValueError):
        return False


def positive_number(value, minimum: float = 0.0) -> bool:
    try:
        return float(value) >= minimum
    except (TypeError, ValueError):
        return False


def normalize_text(value: str) -> str:
    return value.strip() if isinstance(value, str) else value