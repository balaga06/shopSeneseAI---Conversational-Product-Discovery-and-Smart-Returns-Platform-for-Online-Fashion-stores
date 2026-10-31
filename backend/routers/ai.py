from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from database import get_db_connection
from dependencies.auth import require_roles


router = APIRouter(
    prefix="/api/ai",
    tags=["AI"]
)


# ============================================================
# SIZE RECOMMENDATION
# ============================================================

class SizeRecommendationRequest(BaseModel):
    product_id: int
    height_cm: float
    weight_kg: float
    chest_cm: float
    waist_cm: float
    hip_cm: float
    preferred_fit: str = "REGULAR"


@router.post("/size-recommendation")
def size_recommendation(
    request: SizeRecommendationRequest,
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
            SELECT *
            FROM product_sizes
            WHERE product_id = %s
              AND stock > 0
            ORDER BY product_size_id
            """,
            (request.product_id,)
        )

        sizes = cursor.fetchall()

        if not sizes:
            raise HTTPException(
                404,
                "No available sizes found"
            )

        best_size = None
        best_score = float("inf")

        for size in sizes:

            score = 0

            if size["chest_min"] is not None:
                if request.chest_cm < size["chest_min"]:
                    score += size["chest_min"] - request.chest_cm

            if size["chest_max"] is not None:
                if request.chest_cm > size["chest_max"]:
                    score += request.chest_cm - size["chest_max"]

            if size["waist_min"] is not None:
                if request.waist_cm < size["waist_min"]:
                    score += size["waist_min"] - request.waist_cm

            if size["waist_max"] is not None:
                if request.waist_cm > size["waist_max"]:
                    score += request.waist_cm - size["waist_max"]

            if size["hip_min"] is not None:
                if request.hip_cm < size["hip_min"]:
                    score += size["hip_min"] - request.hip_cm

            if size["hip_max"] is not None:
                if request.hip_cm > size["hip_max"]:
                    score += request.hip_cm - size["hip_max"]

            if score < best_score:
                best_score = score
                best_size = size["size_code"]

        confidence = max(
            0,
            min(
                100,
                100 - (best_score * 5)
            )
        )

        cursor.execute(
            """
            INSERT INTO ai_predictions
            (
                customer_id,
                product_id,
                prediction_type,
                recommended_size,
                size_confidence,
                ai_result,
                model_version
            )
            VALUES
            (
                %s,
                %s,
                'SIZE_RECOMMENDATION',
                %s,
                %s,
                JSON_OBJECT(
                    'height_cm', %s,
                    'weight_kg', %s,
                    'chest_cm', %s,
                    'waist_cm', %s,
                    'hip_cm', %s
                ),
                'rule-based-v1'
            )
            """,
            (
                current_user["user_id"],
                request.product_id,
                best_size,
                confidence,
                request.height_cm,
                request.weight_kg,
                request.chest_cm,
                request.waist_cm,
                request.hip_cm
            )
        )

        connection.commit()

        return {
            "recommended_size": best_size,
            "confidence": round(confidence, 2),
            "model_version": "rule-based-v1"
        }

    finally:

        cursor.close()
        connection.close()


# ============================================================
# RETURN RISK
# ============================================================

class ReturnRiskRequest(BaseModel):
    product_id: int
    order_item_id: int | None = None
    selected_size: str | None = None


@router.post("/return-risk")
def return_risk(
    request: ReturnRiskRequest,
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
                COUNT(*) AS total_returns
            FROM returns r
            JOIN order_items oi
                ON r.order_item_id = oi.order_item_id
            JOIN orders o
                ON oi.order_id = o.order_id
            WHERE o.customer_id = %s
            """,
            (current_user["user_id"],)
        )

        result = cursor.fetchone()

        total_returns = result["total_returns"]

        if total_returns >= 5:
            risk = "HIGH"
            probability = 85
        elif total_returns >= 2:
            risk = "MEDIUM"
            probability = 55
        else:
            risk = "LOW"
            probability = 20

        cursor.execute(
            """
            INSERT INTO ai_predictions
            (
                customer_id,
                product_id,
                order_item_id,
                prediction_type,
                return_risk,
                return_probability,
                ai_result,
                model_version
            )
            VALUES
            (
                %s,%s,%s,
                'RETURN_RISK',
                %s,%s,
                JSON_OBJECT(
                    'previous_returns', %s,
                    'selected_size', %s
                ),
                'rule-based-v1'
            )
            """,
            (
                current_user["user_id"],
                request.product_id,
                request.order_item_id,
                risk,
                probability,
                total_returns,
                request.selected_size
            )
        )

        connection.commit()

        return {
            "return_risk": risk,
            "return_probability": probability,
            "model_version": "rule-based-v1"
        }

    finally:

        cursor.close()
        connection.close()