import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv

load_dotenv()

import bcrypt
from jose import jwt
from fastapi import HTTPException, status
from mysql.connector import Error

from database import get_db_connection
from schemas.auth import RegisterRequest, LoginRequest


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

JWT_EXPIRE_MINUTES = int(
    os.getenv("JWT_EXPIRE_MINUTES", 60)
)


# ============================================================
# PASSWORD HASHING
# ============================================================

def hash_password(password: str) -> str:
    """
    Convert a plain-text password into a secure bcrypt hash.
    """

    password_bytes = password.encode("utf-8")

    hashed_password = bcrypt.hashpw(
        password_bytes,
        bcrypt.gensalt()
    )

    return hashed_password.decode("utf-8")


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    """
    Compare a plain-text password with the stored bcrypt hash.

    If the stored hash is invalid or corrupted, return False
    instead of causing a 500 Internal Server Error.
    """

    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )

    except (ValueError, TypeError):
        return False


# ============================================================
# JWT TOKEN CREATION
# ============================================================

def create_access_token(
    user_id: int,
    email: str,
    role: str
) -> str:
    """
    Create JWT access token.
    """

    expire_time = datetime.now(timezone.utc) + timedelta(
        minutes=JWT_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "email": email,
        "role": role,
        "exp": expire_time
    }

    token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )

    return token


# ============================================================
# REGISTER USER
# ============================================================

def register_user(request: RegisterRequest):
    """
    Register a new customer.

    Public registration always creates CUSTOMER.

    The frontend cannot choose:
        ADMIN
        SELLER
        SUPPORT_AGENT

    Only CUSTOMER accounts can be created through public
    registration.
    """

    connection = get_db_connection()

    if not connection:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection failed"
        )

    cursor = None

    try:
        cursor = connection.cursor(dictionary=True)

        # ----------------------------------------------------
        # Check whether email already exists
        # ----------------------------------------------------

        cursor.execute(
            """
            SELECT user_id
            FROM users
            WHERE email = %s
            """,
            (request.email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )

        # ----------------------------------------------------
        # Hash password
        # ----------------------------------------------------

        password_hash = hash_password(
            request.password
        )

        # ----------------------------------------------------
        # Insert new customer
        #
        # IMPORTANT:
        # Role is always CUSTOMER.
        # It is NOT taken from the frontend.
        # ----------------------------------------------------

        cursor.execute(
            """
            INSERT INTO users
            (
                full_name,
                email,
                password_hash,
                phone,
                role,
                account_status
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                'CUSTOMER',
                'ACTIVE'
            )
            """,
            (
                request.full_name,
                request.email,
                password_hash,
                request.phone
            )
        )

        connection.commit()

        user_id = cursor.lastrowid

        return {
            "user_id": user_id,
            "full_name": request.full_name,
            "email": request.email,
            "phone": request.phone,
            "role": "CUSTOMER",
            "account_status": "ACTIVE"
        }

    except HTTPException:
        raise

    except Error as e:

        connection.rollback()

        print(
            f"Registration database error: {e}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

    finally:

        if cursor:
            cursor.close()

        connection.close()


# ============================================================
# LOGIN USER
# ============================================================

def login_user(request: LoginRequest):
    """
    Authenticate user and generate JWT token.
    """

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
        # Find user by email
        # ----------------------------------------------------

        cursor.execute(
            """
            SELECT
                user_id,
                full_name,
                email,
                password_hash,
                phone,
                role,
                account_status
            FROM users
            WHERE email = %s
            """,
            (request.email,)
        )

        user = cursor.fetchone()

        # ----------------------------------------------------
        # User does not exist
        # ----------------------------------------------------

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # ----------------------------------------------------
        # Verify password
        # ----------------------------------------------------

        password_is_valid = verify_password(
            request.password,
            user["password_hash"]
        )

        if not password_is_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # ----------------------------------------------------
        # Check account status
        # ----------------------------------------------------

        if user["account_status"] != "ACTIVE":

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Account is "
                    f"{user['account_status'].lower()}"
                )
            )

        # ----------------------------------------------------
        # Get trusted role from database
        #
        # We DO NOT accept role from frontend.
        # ----------------------------------------------------

        role = user["role"]

        # ----------------------------------------------------
        # Generate JWT
        # ----------------------------------------------------

        access_token = create_access_token(
            user_id=user["user_id"],
            email=user["email"],
            role=role
        )

        # ----------------------------------------------------
        # Return login response
        # ----------------------------------------------------

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "user_id": user["user_id"],
                "full_name": user["full_name"],
                "email": user["email"],
                "phone": user["phone"],
                "role": role,
                "account_status": user["account_status"]
            }
        }

    except HTTPException:
        raise

    except Error as e:

        print(
            f"Login database error: {e}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

    finally:

        if cursor:
            cursor.close()

        connection.close()