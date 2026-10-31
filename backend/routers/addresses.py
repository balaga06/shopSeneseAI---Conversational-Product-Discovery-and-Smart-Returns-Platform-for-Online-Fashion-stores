from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from database import get_db_connection
from dependencies.auth import require_roles


router = APIRouter(
    prefix="/api/addresses",
    tags=["Addresses"]
)


class AddressCreate(BaseModel):
    full_name: str
    phone: str
    address_line: str
    city: str
    state: str
    postal_code: str
    country: str = "India"
    is_default: bool = False


@router.get("")
def get_addresses(
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
            FROM addresses
            WHERE customer_id = %s
            ORDER BY is_default DESC, created_at DESC
            """,
            (current_user["user_id"],)
        )

        return cursor.fetchall()

    finally:

        cursor.close()
        connection.close()


@router.post("")
def add_address(
    address: AddressCreate,
    current_user=Depends(
        require_roles("CUSTOMER")
    )
):

    connection = get_db_connection()

    if not connection:
        raise HTTPException(500, "Database connection failed")

    cursor = connection.cursor()

    try:

        if address.is_default:

            cursor.execute(
                """
                UPDATE addresses
                SET is_default = FALSE
                WHERE customer_id = %s
                """,
                (current_user["user_id"],)
            )

        cursor.execute(
            """
            INSERT INTO addresses
            (
                customer_id,
                full_name,
                phone,
                address_line,
                city,
                state,
                postal_code,
                country,
                is_default
            )
            VALUES
            (%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """,
            (
                current_user["user_id"],
                address.full_name,
                address.phone,
                address.address_line,
                address.city,
                address.state,
                address.postal_code,
                address.country,
                address.is_default
            )
        )

        connection.commit()

        return {
            "message": "Address added successfully",
            "address_id": cursor.lastrowid
        }

    finally:

        cursor.close()
        connection.close()


@router.delete("/{address_id}")
def delete_address(
    address_id: int,
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
            DELETE FROM addresses
            WHERE address_id = %s
              AND customer_id = %s
            """,
            (
                address_id,
                current_user["user_id"]
            )
        )

        connection.commit()

        return {
            "message": "Address deleted successfully"
        }

    finally:

        cursor.close()
        connection.close()