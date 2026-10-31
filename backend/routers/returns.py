from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from database import get_db_connection
from dependencies.auth import require_roles


router = APIRouter(
    prefix="/api/returns",
    tags=["Returns"]
)


class ReturnCreate(BaseModel):
    order_item_id: int
    reason: str
    description: str | None = None


@router.get("")
def get_returns(
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
                r.*,
                p.product_name,
                p.image_url
            FROM returns r
            JOIN order_items oi
                ON r.order_item_id = oi.order_item_id
            JOIN products p
                ON oi.product_id = p.product_id
            WHERE r.customer_id = %s
            ORDER BY r.requested_at DESC
            """,
            (current_user["user_id"],)
        )

        return cursor.fetchall()

    finally:

        cursor.close()
        connection.close()


@router.post("")
def create_return(
    request: ReturnCreate,
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
                oi.order_item_id,
                oi.unit_price,
                o.customer_id
            FROM order_items oi
            JOIN orders o
                ON oi.order_id = o.order_id
            WHERE oi.order_item_id = %s
              AND o.customer_id = %s
            """,
            (
                request.order_item_id,
                current_user["user_id"]
            )
        )

        item = cursor.fetchone()

        if not item:
            raise HTTPException(
                404,
                "Order item not found"
            )

        cursor.execute(
            """
            INSERT INTO returns
            (
                order_item_id,
                customer_id,
                reason,
                description,
                return_status,
                refund_amount
            )
            VALUES
            (%s,%s,%s,%s,'REQUESTED',%s)
            """,
            (
                request.order_item_id,
                current_user["user_id"],
                request.reason,
                request.description,
                item["unit_price"]
            )
        )

        connection.commit()

        return {
            "message": "Return request submitted successfully",
            "return_id": cursor.lastrowid
        }

    except HTTPException:
        raise

    finally:

        cursor.close()
        connection.close()