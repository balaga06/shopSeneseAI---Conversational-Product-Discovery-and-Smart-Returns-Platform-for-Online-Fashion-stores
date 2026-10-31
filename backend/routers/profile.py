from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from mysql.connector import Error

from database import get_db_connection
from dependencies.auth import require_roles


router = APIRouter(
    prefix="/api/profile",
    tags=["Customer Profile"]
)


class ProfileUpdate(BaseModel):
    date_of_birth: str | None = None
    gender: str | None = None
    height_cm: float | None = None
    weight_kg: float | None = None
    chest_cm: float | None = None
    waist_cm: float | None = None
    hip_cm: float | None = None
    preferred_fit: str = "REGULAR"
    preferred_style: str | None = None


@router.get("")
def get_profile(
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
                u.user_id,
                u.full_name,
                u.email,
                u.phone,
                cp.*
            FROM users u
            LEFT JOIN customer_profiles cp
                ON u.user_id = cp.customer_id
            WHERE u.user_id = %s
            """,
            (current_user["user_id"],)
        )

        profile = cursor.fetchone()

        return profile

    finally:

        cursor.close()
        connection.close()


@router.put("")
def update_profile(
    profile: ProfileUpdate,
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
            INSERT INTO customer_profiles
            (
                customer_id,
                date_of_birth,
                gender,
                height_cm,
                weight_kg,
                chest_cm,
                waist_cm,
                hip_cm,
                preferred_fit,
                preferred_style
            )
            VALUES
            (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ON DUPLICATE KEY UPDATE
                date_of_birth = VALUES(date_of_birth),
                gender = VALUES(gender),
                height_cm = VALUES(height_cm),
                weight_kg = VALUES(weight_kg),
                chest_cm = VALUES(chest_cm),
                waist_cm = VALUES(waist_cm),
                hip_cm = VALUES(hip_cm),
                preferred_fit = VALUES(preferred_fit),
                preferred_style = VALUES(preferred_style)
            """,
            (
                current_user["user_id"],
                profile.date_of_birth,
                profile.gender,
                profile.height_cm,
                profile.weight_kg,
                profile.chest_cm,
                profile.waist_cm,
                profile.hip_cm,
                profile.preferred_fit,
                profile.preferred_style
            )
        )

        connection.commit()

        return {
            "message": "Profile updated successfully"
        }

    finally:

        cursor.close()
        connection.close()