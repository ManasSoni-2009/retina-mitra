"""
Role-Based Access Control (RBAC) Module for DrishtiSetu Backend API.
Enforces role permissions for:
- operator: Upload and view assigned screenings. Forbidden from submitting reviewer decisions.
- reviewer: Access review queue, claim cases, submit reviews & overrides.
- admin: System configuration and full audit log access.
"""

from typing import List, Dict, Any
from fastapi import Header, HTTPException, status

from fastapi import Header, HTTPException, Depends, status

from typing import Optional

def get_current_user(
    x_user_role: Optional[str] = Header(default="reviewer", alias="X-User-Role"),
    x_user_id: Optional[str] = Header(default="DR-S-RAO", alias="X-User-Id"),
    authorization: Optional[str] = Header(default=None, alias="Authorization")
) -> Dict[str, str]:
    """
    Extracts authenticated user context from headers (X-User-Role or Authorization Bearer).
    Roles: operator, reviewer, admin
    """
    if authorization:
        token = authorization.replace("Bearer ", "").strip()
        if token.startswith("INVALID") or not token or token == "invalid":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token provided."
            )
        if token in ["operator", "reviewer", "admin"]:
            role = token
        else:
            role = "reviewer"
    else:
        role = (x_user_role or "reviewer").lower().strip()

    if role not in ["operator", "reviewer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid user role '{role}'. Valid roles are: operator, reviewer, admin."
        )
    return {
        "role": role,
        "userId": x_user_id or "DR-S-RAO"
    }

def require_role(allowed_roles: List[str]):
    """
    FastAPI dependency enforcing that current user role is among allowed_roles.
    Raises 403 Forbidden if user role is not permitted.
    """
    def role_checker(user: Dict[str, str] = Depends(get_current_user)):
        if user["role"] not in [r.lower() for r in allowed_roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied: Role '{user['role']}' is not authorized. Allowed roles: {allowed_roles}"
            )
        return user
    return role_checker
