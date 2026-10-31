import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from database import get_db_connection
from dependencies.auth import require_roles


router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"]
)


class OrderItemRequest(BaseModel):
    product_id: int
    seller_id: int
    product_size_id: int | None = None
    quantity: int
    unit_price: float


class OrderCreate(BaseModel):
    address_id: int | None = None
    delivery_fee: float = 0
    discount_amount: float = 0
    payment_method: str = "COD"
    items: list[OrderItemRequest]


@router.get("")
def get_orders(
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
            SELECT *
            FROM orders
            WHERE customer_id = %s
            ORDER BY created_at DESC
            """,
            (current_user["user_id"],)
        )

        orders = cursor.fetchall()

        for order in orders:

            cursor.execute(
                """
                SELECT
                    oi.*,
                    p.product_name,
                    p.image_url,
                    ps.size_code
                FROM order_items oi
                JOIN products p
                    ON oi.product_id = p.product_id
                LEFT JOIN product_sizes ps
                    ON oi.product_size_id = ps.product_size_id
                WHERE oi.order_id = %s
                """,
                (order["order_id"],)
            )

            order["items"] = cursor.fetchall()

        return orders

    finally:

        cursor.close()
        connection.close()


@router.get("/{order_id}")
def get_order(
    order_id: int,
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
            SELECT *
            FROM orders
            WHERE order_id = %s
              AND customer_id = %s
            """,
            (
                order_id,
                current_user["user_id"]
            )
        )

        order = cursor.fetchone()

        if not order:
            raise HTTPException(
                404,
                "Order not found"
            )

        cursor.execute(
            """
            SELECT
                oi.*,
                p.product_name,
                p.image_url,
                ps.size_code
            FROM order_items oi
            JOIN products p
                ON oi.product_id = p.product_id
            LEFT JOIN product_sizes ps
                ON oi.product_size_id = ps.product_size_id
            WHERE oi.order_id = %s
            """,
            (order_id,)
        )

        order["items"] = cursor.fetchall()

        return order

    finally:

        cursor.close()
        connection.close()


@router.post("")
def create_order(
    order: OrderCreate,
    current_user=Depends(
        require_roles("CUSTOMER")
    )
):

    if not order.items:
        raise HTTPException(
            400,
            "Order must contain at least one item"
        )

    connection = get_db_connection()

    if not connection:
        raise HTTPException(500, "Database connection failed")

    cursor = connection.cursor()

    try:

        subtotal = sum(
            item.unit_price * item.quantity
            for item in order.items
        )

        total = (
            subtotal
            + order.delivery_fee
            - order.discount_amount
        )

        order_number = (
            "SS-"
            + uuid.uuid4().hex[:10].upper()
        )

        cursor.execute(
            """
            INSERT INTO orders
            (
                order_number,
                customer_id,
                address_id,
                subtotal,
                delivery_fee,
                discount_amount,
                total_amount,
                payment_method,
                payment_status,
                order_status
            )
            VALUES
            (%s,%s,%s,%s,%s,%s,%s,%s,'PENDING','PLACED')
            """,
            (
                order_number,
                current_user["user_id"],
                order.address_id,
                subtotal,
                order.delivery_fee,
                order.discount_amount,
                total,
                order.payment_method
            )
        )

        order_id = cursor.lastrowid

        for item in order.items:

            total_price = (
                item.unit_price * item.quantity
            )

            cursor.execute(
                """
                INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    seller_id,
                    product_size_id,
                    quantity,
                    unit_price,
                    total_price
                )
                VALUES
                (%s,%s,%s,%s,%s,%s,%s)
                """,
                (
                    order_id,
                    item.product_id,
                    item.seller_id,
                    item.product_size_id,
                    item.quantity,
                    item.unit_price,
                    total_price
                )
            )

        connection.commit()

        return {
            "message": "Order placed successfully",
            "order_id": order_id,
            "order_number": order_number,
            "total_amount": total
        }

    except Exception as e:

        connection.rollback()

        print(f"Order error: {e}")

        raise HTTPException(
            500,
            "Failed to create order"
        )

    finally:

        cursor.close()
        connection.close()