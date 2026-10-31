from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from database import get_db_connection
from dependencies.auth import require_roles


router = APIRouter(
    prefix="/api/support",
    tags=["Support"]
)


class SupportCreate(BaseModel):
    subject: str
    query_type: str = "OTHER"
    customer_message: str
    order_id: int | None = None


class SupportReply(BaseModel):
    agent_reply: str
    query_status: str = "RESOLVED"


@router.post("")
def create_support_query(
    request: SupportCreate,
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
            INSERT INTO support_queries
            (
                customer_id,
                order_id,
                subject,
                query_type,
                customer_message,
                query_status
            )
            VALUES
            (%s,%s,%s,%s,%s,'OPEN')
            """,
            (
                current_user["user_id"],
                request.order_id,
                request.subject,
                request.query_type,
                request.customer_message
            )
        )

        connection.commit()

        return {
            "message": "Support request created",
            "query_id": cursor.lastrowid
        }

    finally:

        cursor.close()
        connection.close()


@router.get("")
def get_support_queries(
    current_user=Depends(
        require_roles(
            "CUSTOMER",
            "SUPPORT_AGENT",
            "ADMIN"
        )
    )
):

    connection = get_db_connection()

    if not connection:
        raise HTTPException(500, "Database connection failed")

    cursor = connection.cursor(dictionary=True)

    try:

        if current_user["role"] == "CUSTOMER":

            cursor.execute(
                """
                SELECT *
                FROM support_queries
                WHERE customer_id = %s
                ORDER BY created_at DESC
                """,
                (current_user["user_id"],)
            )

        else:

            cursor.execute(
                """
                SELECT *
                FROM support_queries
                ORDER BY created_at DESC
                """
            )

        return cursor.fetchall()

    finally:

        cursor.close()
        connection.close()


@router.put("/{query_id}/reply")
def reply_support_query(
    query_id: int,
    request: SupportReply,
    current_user=Depends(
        require_roles(
            "SUPPORT_AGENT",
            "ADMIN"
        )
    )
):

    connection = get_db_connection()

    if not connection:
        raise HTTPException(500, "Database connection failed")

    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            UPDATE support_queries
            SET
                agent_id = %s,
                agent_reply = %s,
                query_status = %s
            WHERE query_id = %s
            """,
            (
                current_user["user_id"],
                request.agent_reply,
                request.query_status,
                query_id
            )
        )

        connection.commit()

        return {
            "message": "Support response updated"
        }

    finally:

        cursor.close()
        connection.close()