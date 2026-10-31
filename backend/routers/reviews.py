from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from database import get_db_connection
from dependencies.auth import require_roles


router = APIRouter(
    prefix="/api/reviews",
    tags=["Reviews"]
)


class ReviewCreate(BaseModel):
    product_id: int
    order_item_id: int | None = None
    rating: int
    review_text: str | None = None


@router.get("/product/{product_id}")
def get_product_reviews(product_id: int):

    connection = get_db_connection()

    if not connection:
        raise HTTPException(500, "Database connection failed")

    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT
                r.review_id,
                r.rating,
                r.review_text,
                r.created_at,
                u.full_name
            FROM reviews r
            JOIN users u
                ON r.customer_id = u.user_id
            WHERE r.product_id = %s
              AND r.review_status = 'VISIBLE'
            ORDER BY r.created_at DESC
            """,
            (product_id,)
        )

        return cursor.fetchall()

    finally:

        cursor.close()
        connection.close()


@router.post("")
def create_review(
    review: ReviewCreate,
    current_user=Depends(
        require_roles("CUSTOMER")
    )
):

    if review.rating < 1 or review.rating > 5:
        raise HTTPException(
            400,
            "Rating must be between 1 and 5"
        )

    connection = get_db_connection()

    if not connection:
        raise HTTPException(500, "Database connection failed")

    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            INSERT INTO reviews
            (
                customer_id,
                product_id,
                order_item_id,
                rating,
                review_text,
                review_status
            )
            VALUES
            (%s,%s,%s,%s,%s,'VISIBLE')
            """,
            (
                current_user["user_id"],
                review.product_id,
                review.order_item_id,
                review.rating,
                review.review_text
            )
        )

        connection.commit()

        return {
            "message": "Review submitted successfully",
            "review_id": cursor.lastrowid
        }

    finally:

        cursor.close()
        connection.close()