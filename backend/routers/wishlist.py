from fastapi import APIRouter, Depends, HTTPException
from mysql.connector import Error

from database import get_db_connection
from dependencies.auth import require_roles


router = APIRouter(
    prefix="/api/wishlist",
    tags=["Wishlist"]
)


@router.get("")
def get_wishlist(
    current_user=Depends(
        require_roles("CUSTOMER")
    )
):

    connection = get_db_connection()

    if not connection:
        raise HTTPException(500, "Database connection failed")

    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT
                w.wishlist_id,
                w.product_id,
                p.product_name,
                p.description,
                p.price,
                p.discount_price,
                p.image_url,
                p.color,
                p.brand
            FROM wishlist w
            JOIN products p
                ON w.product_id = p.product_id
            WHERE w.customer_id = %s
            ORDER BY w.created_at DESC
            """,
            (current_user["user_id"],)
        )

        return cursor.fetchall()

    finally:

        cursor.close()
        connection.close()


@router.post("/{product_id}")
def add_to_wishlist(
    product_id: int,
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
            INSERT IGNORE INTO wishlist
            (customer_id, product_id)
            VALUES (%s,%s)
            """,
            (
                current_user["user_id"],
                product_id
            )
        )

        connection.commit()

        return {
            "message": "Product added to wishlist"
        }

    finally:

        cursor.close()
        connection.close()


@router.delete("/{product_id}")
def remove_from_wishlist(
    product_id: int,
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
            DELETE FROM wishlist
            WHERE customer_id = %s
              AND product_id = %s
            """,
            (
                current_user["user_id"],
                product_id
            )
        )

        connection.commit()

        return {
            "message": "Product removed from wishlist"
        }

    finally:

        cursor.close()
        connection.close()