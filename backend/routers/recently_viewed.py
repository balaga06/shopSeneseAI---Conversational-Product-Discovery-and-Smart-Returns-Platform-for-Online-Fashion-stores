from fastapi import APIRouter, Depends, HTTPException
from mysql.connector import Error

from database import get_db_connection
from dependencies.auth import require_roles


router = APIRouter(
    prefix="/api/recently-viewed",
    tags=["Recently Viewed"]
)


@router.get("")
def get_recently_viewed(
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
                r.recently_viewed_id,
                r.product_id,
                r.viewed_at,
                p.product_name,
                p.price,
                p.discount_price,
                p.image_url,
                p.brand,
                p.color
            FROM recently_viewed r
            JOIN products p
                ON r.product_id = p.product_id
            WHERE r.customer_id = %s
            ORDER BY r.viewed_at DESC
            LIMIT 20
            """,
            (current_user["user_id"],)
        )

        return cursor.fetchall()

    finally:

        cursor.close()
        connection.close()


@router.post("/{product_id}")
def add_recently_viewed(
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
            INSERT INTO recently_viewed
            (
                customer_id,
                product_id
            )
            VALUES (%s,%s)
            """,
            (
                current_user["user_id"],
                product_id
            )
        )

        connection.commit()

        return {
            "message": "Recently viewed product recorded"
        }

    finally:

        cursor.close()
        connection.close()