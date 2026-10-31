import os

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from mysql.connector import Error

from database import get_db_connection


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


# ============================================================
# JWT CONFIGURATION
# ============================================================

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "shopsense-ai-development-secret"
)

JWT_ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256"
)


# ============================================================
# HTTP BEARER AUTHENTICATION
# ============================================================

security = HTTPBearer()


# ============================================================
# GET CURRENT USER
# ============================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    # --------------------------------------------------------
    # DECODE JWT
    # --------------------------------------------------------

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )

        user_id = payload.get("sub")

        if not user_id:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

    except JWTError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )


    # --------------------------------------------------------
    # CONNECT TO DATABASE
    # --------------------------------------------------------

    connection = get_db_connection()

    if not connection:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection failed"
        )


    cursor = None

    try:

        cursor = connection.cursor(
            dictionary=True
        )


        # ----------------------------------------------------
        # GET USER
        # ----------------------------------------------------

        cursor.execute(
            """
            SELECT
                user_id,
                full_name,
                email,
                phone,
                role,
                account_status
            FROM users
            WHERE user_id = %s
            """,
            (user_id,)
        )


        user = cursor.fetchone()


        # ----------------------------------------------------
        # USER NOT FOUND
        # ----------------------------------------------------

        if not user:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )


        # ----------------------------------------------------
        # CHECK ACCOUNT STATUS
        # ----------------------------------------------------

        if user["account_status"] != "ACTIVE":

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is not active"
            )


        return user


    except HTTPException:

        raise


    except Error as e:

        print(
            f"Authentication database error: {e}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication failed"
        )


    finally:

        if cursor:

            cursor.close()

        connection.close()


# ============================================================
# ROLE AUTHORIZATION
# ============================================================

def require_roles(*allowed_roles):

    def role_checker(
        current_user=Depends(get_current_user)
    ):

        # ----------------------------------------------------
        # CHECK USER ROLE
        # ----------------------------------------------------

        if current_user["role"] not in allowed_roles:

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource"
            )


        return current_user


    return role_checker