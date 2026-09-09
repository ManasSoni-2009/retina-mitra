"""
Pydantic schemas for User & Audit Management.
"""

from typing import Optional
from pydantic import BaseModel, Field

class User(BaseModel):
    uid: str
    email: str
    displayName: str
    role: str = Field(..., description="PHC_TECHNICIAN, OPHTHALMOLOGIST, ADMIN")
    phcCenter: Optional[str] = "PHC-Rampur"
    district: Optional[str] = "Nanded"
    isActive: bool = True

class AuditEvent(BaseModel):
    eventId: str
    timestamp: str
    userId: str
    action: str
    resource: str
    details: Optional[str] = None
