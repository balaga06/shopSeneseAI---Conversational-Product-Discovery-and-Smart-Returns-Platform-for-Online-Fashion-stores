import os
import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException


router = APIRouter(
    prefix="/api/media",
    tags=["Media"]
)


UPLOAD_DIR = "uploads/products"

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp"
}

MAX_FILE_SIZE = 5 * 1024 * 1024


@router.post("/upload")
async def upload_product_image(
    file: UploadFile = File(...)
):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected"
        )

    extension = os.path.splitext(
        file.filename
    )[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG and WEBP images are allowed"
        )

    file_content = await file.read()

    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Image size must be less than 5 MB"
        )

    os.makedirs(
        UPLOAD_DIR,
        exist_ok=True
    )

    unique_filename = (
        f"{uuid.uuid4().hex}{extension}"
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_filename
    )

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    image_url = (
        f"/uploads/products/{unique_filename}"
    )

    return {
        "message": "Image uploaded successfully",
        "image_url": image_url,
        "filename": unique_filename
    }