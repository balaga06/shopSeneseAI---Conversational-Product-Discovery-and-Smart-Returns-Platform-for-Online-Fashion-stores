from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from mysql.connector import Error

from database import get_db_connection
from dependencies.auth import get_current_user, require_roles


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)


# ============================================================
# PRODUCT SIZE SCHEMA
# ============================================================

class ProductSize(BaseModel):

    size_code: str = Field(
        ...,
        min_length=1,
        max_length=20
    )

    stock: int = Field(
        0,
        ge=0
    )

    chest_min: Optional[float] = None
    chest_max: Optional[float] = None

    waist_min: Optional[float] = None
    waist_max: Optional[float] = None

    hip_min: Optional[float] = None
    hip_max: Optional[float] = None

    height_min: Optional[float] = None
    height_max: Optional[float] = None


# ============================================================
# CREATE PRODUCT REQUEST
# ============================================================

class ProductCreate(BaseModel):

    product_name: str = Field(
        ...,
        min_length=2,
        max_length=200
    )

    description: Optional[str] = None

    brand: Optional[str] = Field(
        default=None,
        max_length=100
    )

    category_id: int

    gender: str

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

    price: float = Field(
        ...,
        gt=0
    )

    discount_price: Optional[float] = Field(
        default=None,
        ge=0
    )

    image_url: Optional[str] = None

    product_status: str = "ACTIVE"

    stock: int = Field(
        0,
        ge=0
    )

    sizes: list[ProductSize] = []


# ============================================================
# GET PRODUCTS
#
# PUBLIC API
#
# Customer does not need login just to browse products.
# ============================================================

@router.get("")
def get_products(

    category_id: Optional[int] = Query(
        default=None
    ),

    gender: Optional[str] = Query(
        default=None
    ),

    fit_type: Optional[str] = Query(
        default=None
    ),

    min_price: Optional[float] = Query(
        default=None
    ),

    max_price: Optional[float] = Query(
        default=None
    )
):

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
        # BASE QUERY
        # ----------------------------------------------------

        query = """
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
            WHERE p.product_status = 'ACTIVE'
        """

        params = []

        # ----------------------------------------------------
        # CATEGORY FILTER
        # ----------------------------------------------------

        if category_id is not None:

            query += """
                AND p.category_id = %s
            """

            params.append(category_id)

        # ----------------------------------------------------
        # GENDER FILTER
        # ----------------------------------------------------

        if gender:

            query += """
                AND p.gender = %s
            """

            params.append(gender)

        # ----------------------------------------------------
        # FIT FILTER
        # ----------------------------------------------------

        if fit_type:

            query += """
                AND p.fit_type = %s
            """

            params.append(fit_type)

        # ----------------------------------------------------
        # MIN PRICE
        # ----------------------------------------------------

        if min_price is not None:

            query += """
                AND COALESCE(
                    p.discount_price,
                    p.price
                ) >= %s
            """

            params.append(min_price)

        # ----------------------------------------------------
        # MAX PRICE
        # ----------------------------------------------------

        if max_price is not None:

            query += """
                AND COALESCE(
                    p.discount_price,
                    p.price
                ) <= %s
            """

            params.append(max_price)

        # ----------------------------------------------------
        # ORDER
        # ----------------------------------------------------

        query += """
            ORDER BY p.product_id DESC
        """

        cursor.execute(
            query,
            tuple(params)
        )

        products = cursor.fetchall()

        return products

    except Error as e:

        print(
            "Product GET database error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=f"Failed to load products: {str(e)}"
        )

    finally:

        if cursor:
            cursor.close()

        connection.close()


# ============================================================
# CREATE PRODUCT
#
# ONLY SELLER CAN CREATE PRODUCTS
# ============================================================

@router.post("")
def create_product(

    request: ProductCreate,

    current_user=Depends(
        require_roles("SELLER")
    )
):

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
        # VERIFY CATEGORY
        # ----------------------------------------------------

        cursor.execute(
            """
            SELECT
                category_id
            FROM categories
            WHERE category_id = %s
            """,
            (request.category_id,)
        )

        category = cursor.fetchone()

        if not category:

            raise HTTPException(
                status_code=400,
                detail="Invalid category"
            )

        # ----------------------------------------------------
        # VERIFY SELLER
        #
        # seller_id comes from JWT/current user.
        # We DO NOT accept seller_id from React.
        # ----------------------------------------------------

        seller_id = current_user["user_id"]

        # ----------------------------------------------------
        # VERIFY SELLER ROLE
        # ----------------------------------------------------

        if current_user["role"] != "SELLER":

            raise HTTPException(
                status_code=403,
                detail="Only sellers can create products"
            )

        # ----------------------------------------------------
        # CALCULATE STOCK FROM SIZE INVENTORY
        # ----------------------------------------------------

        if request.sizes:

            total_stock = sum(
                size.stock
                for size in request.sizes
            )

        else:

            total_stock = request.stock

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
                    %s,
                    %s,
                    %s
                )
                """,
                (
                    product_id,
                    size.size_code,
                    size.chest_min,
                    size.chest_max,
                    size.waist_min,
                    size.waist_max,
                    size.hip_min,
                    size.hip_max,
                    size.height_min,
                    size.height_max,
                    size.stock
                )
            )

        # ----------------------------------------------------
        # COMMIT
        # ----------------------------------------------------

        connection.commit()

        return {
            "message": "Product created successfully",

            "product_id": product_id,

            "seller_id": seller_id,

            "stock": total_stock,

            "product": {
                "product_name": request.product_name,
                "category_id": request.category_id,
                "brand": request.brand,
                "gender": request.gender,
                "color": request.color,
                "material": request.material,
                "fit_type": request.fit_type,
                "occasion": request.occasion,
                "price": request.price,
                "discount_price": request.discount_price,
                "image_url": request.image_url,
                "product_status": request.product_status
            },

            "sizes_added": len(request.sizes)
        }

    except HTTPException:

        connection.rollback()

        raise

    except Error as e:

        connection.rollback()

        print(
            "Product INSERT database error:",
            e
        )

        raise HTTPException(
            status_code=500,
            detail=f"Failed to create product: {str(e)}"
        )

    finally:

        if cursor:
            cursor.close()

        connection.close()