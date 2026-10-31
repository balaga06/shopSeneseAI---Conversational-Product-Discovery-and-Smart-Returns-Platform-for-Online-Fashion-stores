from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from mysql.connector import Error

from database import get_db_connection
from dependencies.auth import require_roles


router = APIRouter(
    prefix="/api/cart",
    tags=["Cart"]
)


class CartItemCreate(BaseModel):
    product_id: int
    product_size_id: int | None = None
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int


@router.get("")
def get_cart(
    current_user=Depends(
        require_roles("CUSTOMER")
    )
):

    connection = get_db_connection()

    if not connection:
        raise HTTPException(500, "Database connection failed")

    cursor = None

    try:

        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                c.cart_id,
                c.product_id,
                c.product_size_id,
                c.quantity,
                p.product_name,
                p.price,
                p.discount_price,
                p.image_url,
                ps.size_code,
                ps.stock AS size_stock
            FROM carts c
            JOIN products p
                ON c.product_id = p.product_id
            LEFT JOIN product_sizes ps
                ON c.product_size_id = ps.product_size_id
            WHERE c.customer_id = %s
            ORDER BY c.created_at DESC
            """,
            (current_user["user_id"],)
        )

        return cursor.fetchall()

    finally:

        if cursor:
            cursor.close()

        connection.close()


@router.post("")
def add_to_cart(
    item: CartItemCreate,
    current_user=Depends(
        require_roles("CUSTOMER")
    )
):

    if item.quantity <= 0:
        raise HTTPException(
            400,
            "Quantity must be greater than zero"
        )

    connection = get_db_connection()

    if not connection:
        raise HTTPException(500, "Database connection failed")

    cursor = None

    try:

        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT product_id
            FROM products
            WHERE product_id = %s
              AND product_status = 'ACTIVE'
            """,
            (item.product_id,)
        )

        if not cursor.fetchone():
            raise HTTPException(
                404,
                "Product not found or inactive"
            )

        cursor.execute(
            """
            SELECT cart_id
            FROM carts
            WHERE customer_id = %s
              AND product_id = %s
              AND (
                    product_size_id = %s
                    OR (
                        product_size_id IS NULL
                        AND %s IS NULL
                    )
                  )
            """,
            (
                current_user["user_id"],
                item.product_id,
                item.product_size_id,
                item.product_size_id
            )
        )

        existing = cursor.fetchone()

        if existing:

            cursor.execute(
                """
                UPDATE carts
                SET quantity = quantity + %s
                WHERE cart_id = %s
                """,
                (
                    item.quantity,
                    existing["cart_id"]
                )
            )

        else:

            cursor.execute(
                """
                INSERT INTO carts
                (
                    customer_id,
                    product_id,
                    product_size_id,
                    quantity
                )
                VALUES (%s,%s,%s,%s)
                """,
                (
                    current_user["user_id"],
                    item.product_id,
                    item.product_size_id,
                    item.quantity
                )
            )

        connection.commit()

        return {
            "message": "Product added to cart"
        }

    except HTTPException:
        raise

    except Error as e:

        connection.rollback()

        print(e)

        raise HTTPException(
            500,
            "Failed to add product to cart"
        )

    finally:

        if cursor:
            cursor.close()

        connection.close()


@router.put("/{cart_id}")
def update_cart(
    cart_id: int,
    item: CartItemUpdate,
    current_user=Depends(
        require_roles("CUSTOMER")
    )
):

    if item.quantity <= 0:
        raise HTTPException(
            400,
            "Quantity must be greater than zero"
        )

    connection = get_db_connection()

    if not connection:
        raise HTTPException(500, "Database connection failed")

    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            UPDATE carts
            SET quantity = %s
            WHERE cart_id = %s
              AND customer_id = %s
            """,
            (
                item.quantity,
                cart_id,
                current_user["user_id"]
            )
        )

        connection.commit()

        return {
            "message": "Cart updated successfully"
        }

    finally:

        cursor.close()
        connection.close()


@router.delete("/{cart_id}")
def remove_from_cart(
    cart_id: int,
    current_user=Depends(
        require_roles("CUSTOMER")
    )
):

    connection = get_db_connection()

    if not connection:
        raise HTTPException(500, "Database connection failed")

    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            DELETE FROM carts
            WHERE cart_id = %s
              AND customer_id = %s
            """,
            (
                cart_id,
                current_user["user_id"]
            )
        )

        connection.commit()

        return {
            "message": "Item removed from cart"
        }

    finally:

        cursor.close()
        connection.close()