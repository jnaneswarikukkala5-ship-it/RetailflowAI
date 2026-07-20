# RetailFlow AI Backend

Production-ready Flask backend for the RetailFlow AI hackathon project.

## Stack

- Python 3.12
- Flask
- Flask-CORS
- Flask-SQLAlchemy
- MySQL
- JWT authentication
- Scikit-learn, Pandas, NumPy, Joblib

## Setup

1. Create and activate a Python virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and fill in MySQL credentials.
4. Create the database and tables:

```bash
mysql -u root -p < database/retailflow.sql
```

5. Train the ML model once so `ml/inventory_model.pkl` is generated:

```bash
python ml/train_model.py
```

6. Start the API:

```bash
python app.py
```

## Default Demo Credentials

- Email: `admin@retailflow.ai`
- Password: `Admin@123`

## API Overview

Base URL: `/api`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Products

- `GET /api/products`
- `GET /api/products/<id>`
- `POST /api/products`
- `PUT /api/products/<id>`
- `DELETE /api/products/<id>`

### Inventory

- `GET /api/inventory`
- `POST /api/inventory`
- `PUT /api/inventory/<id>`
- `DELETE /api/inventory/<id>`

### Sales

- `GET /api/sales`
- `POST /api/sales`
- `GET /api/sales/report`

### Analytics

- `GET /api/analytics/dashboard`
- `GET /api/analytics/revenue`
- `GET /api/analytics/top-products`
- `GET /api/analytics/monthly-sales`

### AI

- `POST /api/ai/predict-demand`
- `GET /api/ai/restock`
- `GET /api/ai/recommendations`

## Sample Requests

### Register

```json
{
  "name": "Admin User",
  "email": "admin2@retailflow.ai",
  "password": "Admin@123",
  "role": "admin"
}
```

### Create sale

```json
{
  "product_id": 1,
  "quantity": 2,
  "customer_name": "Ava Martinez",
  "payment_method": "Card"
}
```

### Predict demand

```json
{
  "product_id": 1
}
```

## Notes

- The app supports MySQL through `DATABASE_URL` or the `MYSQL_*` environment variables.
- If MySQL is not configured, it falls back to SQLite for demo convenience.
- Sales automatically reduce inventory and update stock status.