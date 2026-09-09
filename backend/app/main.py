"""
DrishtiSetu FastAPI Backend Application Entrypoint.
Includes CORS, Request ID Logging Middleware, and Custom Exception Handlers.
"""

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import RequestLoggingMiddleware
from app.api.v1 import health, screenings, quality, simulation

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Explainable AI for Diabetic Retinopathy Screening in Rural India (SIH26038)"
)

# Add Logging Middleware
app.add_middleware(RequestLoggingMiddleware)

# Configure CORS
origins = settings.ALLOWED_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Structured Error Handlers (Prevents raw tracebacks exposure)
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    req_id = getattr(request.state, "request_id", "unknown")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": True,
            "requestId": req_id,
            "message": "An internal server error occurred while processing the request.",
            "detail": str(exc) if settings.ENVIRONMENT == "development" else "Internal server error."
        }
    )

# Mount Routers
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(screenings.router, prefix=settings.API_V1_STR, tags=["Screenings"])
app.include_router(quality.router, prefix=settings.API_V1_STR, tags=["Quality Gate"])
app.include_router(simulation.router, prefix=settings.API_V1_STR, tags=["Simulink"])

@app.get("/")
def root():
    return {
        "message": "Welcome to DrishtiSetu API — Human-in-the-loop DR Decision Support Platform",
        "docs": "/docs",
        "version": settings.VERSION
    }
