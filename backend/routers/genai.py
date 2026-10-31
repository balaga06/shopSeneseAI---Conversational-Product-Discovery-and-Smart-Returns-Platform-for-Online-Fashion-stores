from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from database import get_db_connection
from dependencies.auth import require_roles


router = APIRouter(
    prefix="/api/genai",
    tags=["Generative AI"]
)


# ============================================================
# CONVERSATIONAL PRODUCT SEARCH
# ============================================================

class ProductSearchRequest(BaseModel):
    query: str


@router.post("/search")
def conversational_search(
    request: ProductSearchRequest,
    current_user=Depends(
        require_roles("CUSTOMER")
    )
):

    query = request.query.lower()

    connection = get_db_connection()

    if not connection:
        raise HTTPException(
            500,
            "Database connection failed"
        )

    cursor = connection.cursor(dictionary=True)

    try:

        sql = """
            SELECT
                p.product_id,
                p.product_name,
                p.description,
                p.brand,
                p.gender,
                p.color,
                p.fit_type,
                p.occasion,
                p.price,
                p.discount_price,
                p.image_url,
                c.category_name
            FROM products p
            JOIN categories c
                ON p.category_id = c.category_id
            WHERE p.product_status = 'ACTIVE'
        """

        params = []

        if "men" in query:
            sql += " AND p.gender IN ('MEN','UNISEX')"

        elif "women" in query:
            sql += " AND p.gender IN ('WOMEN','UNISEX')"

        if "black" in query:
            sql += " AND LOWER(p.color) LIKE %s"
            params.append("%black%")

        if "red" in query:
            sql += " AND LOWER(p.color) LIKE %s"
            params.append("%red%")

        if "blue" in query:
            sql += " AND LOWER(p.color) LIKE %s"
            params.append("%blue%")

        sql += """
            ORDER BY p.created_at DESC
            LIMIT 20
        """

        cursor.execute(sql, tuple(params))

        products = cursor.fetchall()

        return {
            "query": request.query,
            "message": "Products found based on your request",
            "products": products
        }

    finally:

        cursor.close()
        connection.close()


# ============================================================
# REVIEW SUMMARY
# ============================================================

class ReviewSummaryRequest(BaseModel):
    product_id: int


@router.post("/review-summary")
def review_summary(
    request: ReviewSummaryRequest,
    current_user=Depends(
        require_roles("CUSTOMER")
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
                rating,
                review_text
            FROM reviews
            WHERE product_id = %s
              AND review_status = 'VISIBLE'
            ORDER BY created_at DESC
            """,
            (request.product_id,)
        )

        reviews = cursor.fetchall()

        if not reviews:
            return {
                "product_id": request.product_id,
                "summary": "No reviews available yet.",
                "pros": [],
                "cons": []
            }

        average_rating = sum(
            r["rating"]
            for r in reviews
        ) / len(reviews)

        positive = [
            r["review_text"]
            for r in reviews
            if r["rating"] >= 4
            and r["review_text"]
        ]

        negative = [
            r["review_text"]
            for r in reviews
            if r["rating"] <= 2
            and r["review_text"]
        ]

        return {
            "product_id": request.product_id,
            "average_rating": round(
                average_rating,
                2
            ),
            "review_count": len(reviews),
            "summary": (
                f"This product has an average rating "
                f"of {average_rating:.1f}/5 "
                f"from {len(reviews)} reviews."
            ),
            "pros": positive[:5],
            "cons": negative[:5],
            "ai_status": "ready_for_llm_integration"
        }

    finally:

        cursor.close()
        connection.close()