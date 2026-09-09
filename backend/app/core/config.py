"""
Application Configuration and Configurable Quality Thresholds.
"""

import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "DrishtiSetu API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "*")

    # Configurable Quality Gate Thresholds
    QUALITY_THRESHOLD_GRADABLE: float = float(os.getenv("QUALITY_THRESHOLD_GRADABLE", "0.65"))
    QUALITY_THRESHOLD_BORDERLINE: float = float(os.getenv("QUALITY_THRESHOLD_BORDERLINE", "0.45"))
    QUALITY_ALLOW_BORDERLINE_INFERENCE: bool = os.getenv("QUALITY_ALLOW_BORDERLINE_INFERENCE", "true").lower() == "true"

    model_config = SettingsConfigDict(case_sensitive=True)

settings = Settings()
