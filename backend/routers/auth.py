from fastapi import APIRouter, Depends, status

from schemas.auth import (
    RegisterRequest,
    LoginRequest,
    UserResponse,
    LoginResponse
)

from services.auth_service import (
    register_user,
    login_user
)

from dependencies.auth import get_current_user


# Create authentication router
router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


# ============================================================
# REGISTER
# ============================================================

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(request: RegisterRequest):
    return register_user(request)


# ============================================================
# LOGIN
# ============================================================

@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK
)
def login(request: LoginRequest):
    return login_user(request)


# ============================================================
# CURRENT USER
# ============================================================

@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return current_user