from fastapi import APIRouter, Depends, HTTPException

from database import get_db_connection
from dependencies.auth import require_roles


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


@router.get("/dashboard")
def admin_dashboard(
    current_user=Depends(
        require_roles("ADMIN")
    )
):

    connection = get_db_connection()

    if not connection:
        raise HTTPException(
            500,
            "Database connection failed"
        )

    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            "SELECT COUNT(*) AS count FROM users"
        )
        users = cursor.fetchone()["count"]

        cursor.execute(
            "SELECT COUNT(*) AS count FROM products"
        )
        products = cursor.fetchone()["count"]

        cursor.execute(
            "SELECT COUNT(*) AS count FROM orders"
        )
        orders = cursor.fetchone()["count"]

        cursor.execute(
            "SELECT COUNT(*) AS count FROM returns"
        )
        returns = cursor.fetchone()["count"]

        cursor.execute(
            """
            SELECT
                COALESCE(SUM(total_amount),0)
                AS revenue
            FROM orders
            WHERE payment_status = 'PAID'
            """
        )

        revenue = cursor.fetchone()["revenue"]

        return {
            "total_users": users,
            "total_products": products,
            "total_orders": orders,
            "total_returns": returns,
            "total_revenue": float(revenue)
        }

    finally:

        cursor.close()
        connection.close()


@router.get("/users")
def get_users(
    current_user=Depends(
        require_roles("ADMIN")
    )
):

    connection = get_db_connection()

    if not connection:
        raise HTTPException(
            500,
            "Database connection failed"
        )

    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT
                user_id,
                full_name,
                email,
                phone,
                role,
                account_status,
                created_at
            FROM users
            ORDER BY created_at DESC
            """
        )

        return cursor.fetchall()

    finally:

        cursor.close()
        connection.close()


@router.get("/returns")
def get_all_returns(
    current_user=Depends(
        require_roles("ADMIN")
    )
):

    connection = get_db_connection()

    if not connection:
        raise HTTPException(
            500,
            "Database connection failed"
        )

    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT
                r.*,
                u.full_name,
                u.email,
                p.product_name
            FROM returns r
            JOIN users u
                ON r.customer_id = u.user_id
            JOIN order_items oi
                ON r.order_item_id = oi.order_item_id
            JOIN products p
                ON oi.product_id = p.product_id
            ORDER BY r.requested_at DESC
            """
        )

        return cursor.fetchall()

    finally:

        cursor.close()
        connection.close()