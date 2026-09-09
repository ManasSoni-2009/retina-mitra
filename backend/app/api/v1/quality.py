"""
Quality Gate API Endpoint.
Evaluates fundus image quality metrics and provides physical recapture guidance.
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.schemas.screening import ImageQuality
from app.services.quality_service import validate_image_file, analyze_fundus_quality

router = APIRouter()

@router.post("/quality/check", response_model=ImageQuality)
async def check_image_quality(
    file: UploadFile = File(...),
    sampleType: str = Form(default="gradable")
):
    """
    Evaluates fundus image quality prior to inference.
    Strictly checks MIME, extension, size, dimensions, and runs OpenCV quality heuristics.
    """
    file_bytes = await file.read()
    
    is_valid, err_msg = validate_image_file(file_bytes, file.filename or "image.png", file.content_type or "image/png")
    if not is_valid:
        raise HTTPException(status_code=400, detail=err_msg)

    return analyze_fundus_quality(file_bytes, file.filename or sampleType)
