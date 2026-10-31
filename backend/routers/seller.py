from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from mysql.connector import Error

from database import get_db_connection


router = APIRouter(
    prefix="/api/seller",
    tags=["Seller"]
)


# ============================================================
# SIZE REQUEST MODEL
# ============================================================

class ProductSizeRequest(BaseModel):
    size: str = Field(..., min_length=1, max_length=20)

    stock: int = Field(..., ge=0)

    chest_min: Optional[float] = None
    chest_max: Optional[float] = None

    waist_min: Optional[float] = None
    waist_max: Optional[float] = None

    hip_min: Optional[float] = None
    hip_max: Optional[float] = None


# ============================================================
# PRODUCT REQUEST MODEL
# ============================================================

class ProductCreateRequest(BaseModel):

    product_name: str = Field(..., min_length=1, max_length=200)

    description: Optional[str] = None

    brand: Optional[str] = Field(
        default=None,
        max_length=100
    )

    category_id: int

    gender: Optional[str] = None

    color: Optional[str] = Field(
        default=None,
        max_length=50
    )

    material: Optional[str] = Field(
        default=None,
        max_length=100
    )

    fit_type: Optional[str] = None

    occasion: Optional[str] = Field(
        default=None,
        max_length=100
    )

    price: float = Field(..., ge=0)

    discount_price: Optional[float] = Field(
        default=None,
        ge=0
    )

    image_url: Optional[str] = Field(
        default=None,
        max_length=500
    )

    product_status: str = "ACTIVE"

    stock: int = Field(
        default=0,
        ge=0
    )

    sizes: list[ProductSizeRequest] = []


# ============================================================
# CREATE PRODUCT
# ============================================================

@router.post("/products")
def create_product(request: ProductCreateRequest):

    connection = get_db_connection()

    if not connection:
        raise HTTPException(
            status_code=500,
            detail="Database connection failed"
        )

    cursor = None

    try:

        cursor = connection.cursor(
            dictionary=True
        )

        # ----------------------------------------------------
        # TEMPORARY SELLER FOR UI PREVIEW
        # ----------------------------------------------------
        #
        # Currently Seller routes are open without login.
        # Therefore we automatically find an ACTIVE SELLER.
        #
        # Later, when seller authentication is enabled,
        # this will be replaced by the JWT current user.
        # ----------------------------------------------------

        cursor.execute(
            """
            SELECT user_id
            FROM users
            WHERE role = 'SELLER'
              AND account_status = 'ACTIVE'
            ORDER BY user_id
            LIMIT 1
            """
        )

        seller = cursor.fetchone()

        if not seller:

            raise HTTPException(
                status_code=400,
                detail=(
                    "No active SELLER account exists. "
                    "Create a seller account before adding products."
                )
            )

        seller_id = seller["user_id"]

        # ----------------------------------------------------
        # CHECK CATEGORY
        # ----------------------------------------------------

        cursor.execute(
            """
            SELECT category_id
            FROM categories
            WHERE category_id = %s
              AND status = 'ACTIVE'
            """,
            (request.category_id,)
        )

        category = cursor.fetchone()

        if not category:

            raise HTTPException(
                status_code=400,
                detail="Invalid or inactive category"
            )

        # ----------------------------------------------------
        # VALIDATE PRODUCT STATUS
        # ----------------------------------------------------

        allowed_statuses = {
            "ACTIVE",
            "INACTIVE",
            "OUT_OF_STOCK"
        }

        if request.product_status not in allowed_statuses:

            raise HTTPException(
                status_code=400,
                detail="Invalid product status"
            )

        # ----------------------------------------------------
        # VALIDATE GENDER
        # ----------------------------------------------------

        allowed_genders = {
            "MEN",
            "WOMEN",
            "UNISEX",
            "KIDS"
        }

        if (
            request.gender is not None
            and request.gender not in allowed_genders
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid gender"
            )

        # ----------------------------------------------------
        # VALIDATE FIT TYPE
        # ----------------------------------------------------

        allowed_fit_types = {
            "SLIM",
            "REGULAR",
            "RELAXED",
            "OVERSIZED"
        }

        if (
            request.fit_type
            and request.fit_type not in allowed_fit_types
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid fit type"
            )

        # ----------------------------------------------------
        # VALIDATE DISCOUNT PRICE
        # ----------------------------------------------------

        if (
            request.discount_price is not None
            and request.discount_price >= request.price
        ):

            raise HTTPException(
                status_code=400,
                detail="Discount price must be lower than product price"
            )

        # ----------------------------------------------------
        # CALCULATE TOTAL STOCK FROM SIZES
        # ----------------------------------------------------

        total_stock = sum(
            size.stock
            for size in request.sizes
        )

        # ----------------------------------------------------
        # INSERT PRODUCT
        # ----------------------------------------------------

        cursor.execute(
            """
            INSERT INTO products
            (
                seller_id,
                category_id,
                product_name,
                description,
                brand,
                gender,
                color,
                material,
                fit_type,
                occasion,
                price,
                discount_price,
                image_url,
                stock,
                product_status
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
            """,
            (
                seller_id,
                request.category_id,
                request.product_name,
                request.description,
                request.brand,
                request.gender,
                request.color,
                request.material,
                request.fit_type,
                request.occasion,
                request.price,
                request.discount_price,
                request.image_url,
                total_stock,
                request.product_status
            )
        )

        product_id = cursor.lastrowid

        # ----------------------------------------------------
        # INSERT PRODUCT SIZES
        # ----------------------------------------------------

        for size in request.sizes:

            cursor.execute(
                """
                INSERT INTO product_sizes
                (
                    product_id,
                    size_code,
                    chest_min,
                    chest_max,
                    waist_min,
                    waist_max,
                    hip_min,
                    hip_max,
                    height_min,
                    height_max,
                    stock
                )
                VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    NULL,
                    NULL,
                    %s
                )
                """,
                (
                    product_id,
                    size.size,
                    size.chest_min,
                    size.chest_max,
                    size.waist_min,
                    size.waist_max,
                    size.hip_min,
                    size.hip_max,
                    size.stock
                )
            )

        # ----------------------------------------------------
        # COMMIT
        # ----------------------------------------------------

        connection.commit()

        # ----------------------------------------------------
        # RETURN CREATED PRODUCT
        # ----------------------------------------------------

        return {
            "message": "Product created successfully",
            "product_id": product_id,
            "seller_id": seller_id,
            "product_name": request.product_name,
            "stock": total_stock,
            "product_status": request.product_status
        }

    except HTTPException:
        connection.rollback()
        raise

    except Error as e:

        connection.rollback()

        print(
            f"Product creation database error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=f"Failed to create product: {str(e)}"
        )

    finally:

        if cursor:
            cursor.close()

        connection.close()


# ============================================================
# SELLER PRODUCTS
# ============================================================

@router.get("/products")
def get_seller_products():

    connection = get_db_connection()

    if not connection:
        raise HTTPException(
            status_code=500,
            detail="Database connection failed"
        )

    cursor = None

    try:

        cursor = connection.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT
                p.product_id,
                p.seller_id,
                p.category_id,
                c.category_name,
                p.product_name,
                p.description,
                p.brand,
                p.gender,
                p.color,
                p.material,
                p.fit_type,
                p.occasion,
                p.price,
                p.discount_price,
                p.image_url,
                p.stock,
                p.product_status,
                p.created_at,
                p.updated_at
            FROM products p
            LEFT JOIN categories c
                ON p.category_id = c.category_id
            ORDER BY p.created_at DESC
            """
        )

        products = cursor.fetchall()

        return products

    except Error as e:

        print(
            f"Seller products database error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to load seller products"
        )

    finally:

        if cursor:
            cursor.close()

        connection.close()