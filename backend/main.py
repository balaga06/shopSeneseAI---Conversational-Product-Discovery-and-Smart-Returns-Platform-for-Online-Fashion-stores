from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import get_db_connection

from routers.auth import router as auth_router
from routers.media import router as media_router
from routers.categories import router as categories_router
from routers.product import router as product_router
from routers.admin import router as admin_router


app = FastAPI(
    title="ShopSense AI API",
    description="Backend API for ShopSense AI",
    version="1.0.0"
)


# =========================================================
# CORS CONFIGURATION
# =========================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================================================
# STATIC FILES
# =========================================================

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


# =========================================================
# ROUTERS
# =========================================================

app.include_router(auth_router)

app.include_router(categories_router)

app.include_router(media_router)

app.include_router(product_router)

app.include_router(admin_router)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "message": "ShopSense AI Backend is running"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/api/health")
def health_check():

    connection = get_db_connection()

    if connection:

        connection.close()

        return {
            "status": "success",
            "backend": "FastAPI",
            "database": "MySQL",
            "message": "Backend and MySQL are connected"
        }

    return {
        "status": "error",
        "backend": "FastAPI",
        "database": "MySQL",
        "message": "MySQL connection failed"
    }