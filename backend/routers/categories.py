from fastapi import APIRouter, HTTPException
from mysql.connector import Error

from database import get_db_connection


router = APIRouter(
    prefix="/api/categories",
    tags=["Categories"]
)


# ============================================================
# GET ALL CATEGORIES
# ============================================================

@router.get("")
def get_categories():

    connection = get_db_connection()

    if not connection:

        raise HTTPException(
            status_code=500,
            detail="Database connection failed"
        )

    cursor = None

    try:

        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                category_id,
                category_name
            FROM categories
            ORDER BY category_name ASC
            """
        )

        categories = cursor.fetchall()

        print(
            f"Categories loaded: {len(categories)}"
        )

        return categories

    except Error as e:

        print(
            f"Category database error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=f"Failed to load categories: {str(e)}"
        )

    finally:

        if cursor:
            cursor.close()

        connection.close()