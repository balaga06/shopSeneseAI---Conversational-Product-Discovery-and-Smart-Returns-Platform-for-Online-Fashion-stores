# 🛍️ ShopSense AI

### Conversational Product Discovery and Smart Returns Platform for Online Fashion Stores

ShopSense AI is a full-stack AI-powered fashion e-commerce platform designed to improve the complete customer journey — from **product discovery and size selection to ordering, reviews, and returns**.

The platform combines **React, FastAPI, MySQL, Machine Learning, and Generative AI** to provide intelligent shopping experiences while helping sellers and administrators reduce avoidable returns and identify risky orders before dispatch.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [User Roles](#-user-roles)
- [AI Features](#-ai-features)
- [GenAI Features](#-genai-features)
- [Application Workflow](#-application-workflow)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Database](#-database)
- [Authentication & Security](#-authentication--security)
- [Setup](#-setup)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [API Documentation](#-api-documentation)
- [Future Enhancements](#-future-enhancements)

---

# 🎯 Overview

ShopSense AI is an intelligent fashion e-commerce platform that combines traditional online shopping with AI and Generative AI capabilities.

The platform provides separate experiences for:

| Role | Purpose |
|---|---|
| 👤 Customer | Discover, purchase, track and return products |
| 🏪 Seller | Manage products, inventory, orders and risky orders |
| 🎧 Support Agent | Handle customer queries and returns |
| 👑 Admin | Manage users, products, categories and analytics |

---

# ❗ Problem Statement

Online fashion stores commonly face:

- Difficulty finding relevant products through keyword search.
- Customers struggling to understand size charts.
- High returns caused by incorrect size or fit.
- Repeated pre-purchase questions for support teams.
- Manual return processing.
- Limited visibility into risky orders.
- Difficulty identifying products with high return rates.

ShopSense AI addresses these problems by combining e-commerce functionality with AI-assisted product discovery, size recommendation, return-risk prediction, review summarization, and support assistance.

---

# 💡 Solution

The platform provides:

### 🛒 E-Commerce

- Product catalogue
- Categories
- Product sizes
- Inventory
- Shopping cart
- Wishlist
- Recently viewed products
- Checkout
- Simulated payment
- Order tracking
- Returns
- Reviews
- Customer profiles

### 🤖 AI

- Smart size recommendation
- Return risk prediction
- Product recommendations

### ✨ Generative AI

- Conversational product search
- Review summarization
- Support reply suggestions

### 📊 Management

- Seller dashboard
- Support dashboard
- Admin dashboard
- Product management
- Order management
- Return management
- Analytics

---

# 🚀 Key Features

## 👤 Customer

### Authentication

- Registration
- Login
- JWT authentication
- Secure password hashing
- Role-based access

### Product Discovery

- Browse products
- Browse categories
- Search products
- Filter by category
- Filter by gender
- Filter by fit
- Filter by price

### Shopping

- Product details
- Size selection
- Smart size recommendation
- Cart
- Wishlist
- Recently viewed
- Checkout
- Simulated payment
- Order tracking
- Reviews
- Returns

### Profile

- Personal information
- Addresses
- Size preferences
- Order history
- Reviews
- Return requests

---

# 🏪 Seller

### Product Management

- Add products
- Product descriptions
- Brand
- Category
- Gender
- Color
- Material
- Fit type
- Occasion
- Price
- Discount price
- Product images
- Product status

### Inventory

Size-level inventory management including:

- Size code
- Stock
- Chest range
- Waist range
- Hip range
- Height range

### Seller Operations

- Seller dashboard
- Product management
- Order management
- Return management
- Analytics
- Risky-order identification

---

# 🎧 Support Agent

Support agents can:

- View customer queries
- View query details
- View customer information
- Manage returns
- View return details
- Access order/customer context
- Generate AI-assisted response suggestions

Support agents can review and edit AI-generated responses before responding to customers.

---

# 👑 Admin

The admin dashboard provides centralized platform management.

### Management

- Users
- Customers
- Sellers
- Products
- Categories
- Orders
- Returns

### Analytics

- User statistics
- Product statistics
- Category statistics
- Order information
- Return information

---

# 🤖 AI Features

## 1. 📏 Smart Size Recommendation

Recommends a suitable product size using customer measurements and product size ranges.

### Customer Data

- Height
- Weight
- Chest
- Waist
- Hip
- Preferred fit

### Product Data

- Available sizes
- Chest range
- Waist range
- Hip range
- Height range

### Example

```text
Height: 175 cm
Chest: 40 in
Waist: 34 in
Hip: 40 in
Preferred Fit: Regular

Recommended Size: M
Confidence: 92%
```

The objective is to reduce incorrect-size purchases and size-related returns.

---

# 2. ⚠️ Return Risk Prediction

Predicts the probability that an order may be returned.

Potential factors include:

- Customer return history
- Previous size-related returns
- Product return history
- Category return rate
- Selected size
- Customer size preferences
- Product characteristics

### Example

```text
Order #1052
Product: Black Shirt
Size: M

Return Risk: HIGH
Probability: 87%

Reasons:
• Previous size-related returns
• Possible size mismatch
• Product has a high historical return rate
```

### Workflow

```text
Customer places order
        ↓
Order created
        ↓
Return Risk Prediction
        ↓
LOW → Normal Processing
        ↓
MEDIUM/HIGH → Seller Review
        ↓
Dispatch
```

The system flags risky orders for review rather than automatically cancelling them.

---

# 3. 🛍️ Product Recommendation

Product recommendations can use:

- Product characteristics
- Customer preferences
- Categories
- Fit
- Price
- Recently viewed products
- Wishlist
- Previous interactions

---

# ✨ GenAI Features

## 1. 💬 Conversational Product Search

Customers can search using natural language.

Example:

> "I want a relaxed party outfit under ₹2000."

The system can extract:

```text
Occasion: Party
Fit: Relaxed
Maximum Price: ₹2000
```

These filters are then used to search the actual MySQL product catalogue.

The AI should not invent products that are not present in the database.

### Workflow

```text
Customer Query
      ↓
Generative AI
      ↓
Intent + Filters
      ↓
FastAPI
      ↓
MySQL
      ↓
Matching Products
      ↓
React UI
```

---

# 2. 📝 Review Summary

Product reviews can be summarized using Generative AI.

Example:

```text
Review Summary

Pros:
✓ Comfortable fabric
✓ Good appearance
✓ Suitable for casual wear

Cons:
✗ Some customers reported smaller sizing
✗ Occasional fitting issues
```

---

# 3. 🎧 Support Suggested Reply

Generative AI can generate response suggestions using customer, order, and return context.

Example:

```text
Customer:
"My order hasn't arrived yet."

Suggested Reply:
"We apologize for the delay. Your order is currently in transit.
Our team is checking the latest delivery status and will provide
you with an update shortly."
```

The support agent can review and modify the response before sending it.

---

# 🔄 Application Workflow

```text
                    SHOP SENSE AI
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    Customer           Seller          Support
        │                │                │
        └────────────────┼────────────────┘
                         │
                       Admin
                         │
                         ▼
                  React Frontend
                         │
                         ▼
                  FastAPI Backend
                         │
             ┌───────────┼───────────┐
             │           │           │
           MySQL        AI         GenAI
             │           │           │
             └───────────┼───────────┘
                         │
                         ▼
                   API Response
```

---

# 🏗️ System Architecture

```text
┌───────────────────────────────────────────────┐
│                 React Frontend               │
│                                               │
│ Customer │ Seller │ Support │ Admin           │
└──────────────────────┬────────────────────────┘
                       │
                       │ REST API / JSON
                       ▼
┌───────────────────────────────────────────────┐
│                FastAPI Backend                │
│                                               │
│ Authentication │ Products │ Orders            │
│ Cart │ Returns │ Reviews │ Admin │ Support    │
└──────────────────┬──────────────────┬─────────┘
                   │                  │
                   ▼                  ▼
          ┌────────────────┐  ┌────────────────┐
          │     MySQL      │  │   AI / GenAI   │
          │                │  │                │
          │ Users          │  │ Size AI        │
          │ Products       │  │ Return Risk    │
          │ Orders         │  │ Recommendations│
          │ Returns        │  │ Search         │
          │ Reviews        │  │ Summaries      │
          └────────────────┘  └────────────────┘
```

---

# 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios |
| Backend | Python, FastAPI, Uvicorn |
| Database | MySQL |
| Authentication | JWT, bcrypt |
| Validation | Pydantic |
| AI/ML | Python, pandas, scikit-learn |
| API Format | REST / JSON |
| Development | VS Code, MySQL Workbench |

---

# 📁 Project Structure

```text
shopsense-ai/
│
├── backend/
│   ├── dependencies/
│   │   ├── __init__.py
│   │   └── auth.py
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── categories.py
│   │   ├── media.py
│   │   ├── product.py
│   │   ├── admin.py
│   │   ├── cart.py
│   │   ├── wishlist.py
│   │   ├── recently_viewed.py
│   │   ├── profile.py
│   │   ├── addresses.py
│   │   ├── orders.py
│   │   ├── returns.py
│   │   ├── reviews.py
│   │   ├── ai.py
│   │   ├── genai.py
│   │   ├── support.py
│   │   └── seller.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── auth.py
│   │
│   ├── services/
│   │   └── auth_service.py
│   │
│   ├── uploads/
│   │   └── products/
│   │
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── customer/
│   │   │   ├── seller/
│   │   │   ├── support/
│   │   │   └── admin/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# 🗄️ Database

Core MySQL tables:

```text
users
categories
products
product_sizes
customer_profiles
addresses
carts
wishlist
recently_viewed
orders
order_items
returns
reviews
support_queries
ai_predictions
notifications
```

### Main Relationships

```text
users
 │
 ├── customer_profiles
 ├── addresses
 ├── carts
 ├── wishlist
 ├── recently_viewed
 ├── orders
 ├── reviews
 └── support_queries

categories
 │
 └── products
       │
       └── product_sizes

orders
 │
 ├── order_items
 └── returns

products
 │
 ├── reviews
 ├── order_items
 └── ai_predictions
```

---

# 🔐 Authentication & Security

ShopSense AI uses a single login system for all roles.

```text
Email + Password
       ↓
FastAPI
       ↓
MySQL User Lookup
       ↓
bcrypt Verification
       ↓
Account Status Check
       ↓
Database Role
       ↓
JWT Generation
       ↓
React AuthContext
       ↓
Role-Based Redirect
```

Supported roles:

```text
CUSTOMER
SELLER
SUPPORT_AGENT
ADMIN
```

Security mechanisms include:

- bcrypt password hashing
- JWT authentication
- Role-based authorization
- Account status validation
- Pydantic validation
- Protected API routes
- CORS configuration
- Environment variables for secrets

---

# ⚙️ Setup

## 1. Clone Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd shopsense-ai
```

## 2. Backend

```powershell
cd backend

python -m venv venv

.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

## 3. Database

Create the database:

```sql
CREATE DATABASE shopsense_ai;
```

Import the project database schema.

---

# 🔑 Environment Variables

Create:

```text
backend/.env
```

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=shopsense_ai

JWT_SECRET_KEY=your_secure_secret_key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
```

**Do not commit `.env` to Git.**

---

# ▶️ Run Backend

```powershell
cd backend

.\venv\Scripts\python.exe -m uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

---

# ▶️ Run Frontend

Open another terminal:

```powershell
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 📚 API Documentation

FastAPI provides interactive API documentation.

### Swagger

```text
http://127.0.0.1:8000/docs
```

### ReDoc

```text
http://127.0.0.1:8000/redoc
```

### Health Check

```text
http://127.0.0.1:8000/api/health
```

---

# 📡 Main API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Categories

```text
GET /api/categories
```

### Products

```text
GET  /api/products
POST /api/products
```

### Media

```text
POST /api/media/upload
```

### Admin

```text
GET /api/admin/dashboard
GET /api/admin/users
GET /api/admin/customers
GET /api/admin/sellers
GET /api/admin/products
GET /api/admin/categories
```

---

# 🔮 Future Enhancements

- Real payment gateway integration
- Advanced recommendation engine
- Improved ML return-risk model
- Multilingual conversational search
- Voice-based product search
- Image-based fashion search
- AI outfit recommendations
- Advanced seller analytics
- Inventory demand forecasting
- Automated product descriptions
- Email and SMS notifications
- Docker deployment
- CI/CD pipeline
- Cloud deployment
- Redis caching
- Elasticsearch/OpenSearch integration
- Production monitoring

---

# 📄 License

This project is developed for educational and demonstration purposes.
