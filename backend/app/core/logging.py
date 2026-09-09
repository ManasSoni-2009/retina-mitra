"""
Structured Logging & Request ID Middleware for DrishtiSetu API.
"""

import time
import uuid
import logging
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)

logger = logging.getLogger("drishtisetu.api")

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        start_time = time.time()
        request.state.request_id = request_id

        logger.info(f"[{request_id}] START {request.method} {request.url.path}")

        try:
            response = await call_next(request)
            duration_ms = (time.time() - start_time) * 1000.0
            response.headers["X-Request-ID"] = request_id
            logger.info(f"[{request_id}] END {request.method} {request.url.path} -> {response.status_code} ({duration_ms:.1f}ms)")
            return response
        except Exception as exc:
            duration_ms = (time.time() - start_time) * 1000.0
            logger.error(f"[{request_id}] FAILED {request.method} {request.url.path} -> Error: {str(exc)} ({duration_ms:.1f}ms)")
            raise exc
