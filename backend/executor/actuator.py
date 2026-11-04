import hmac
import hashlib
import asyncio
from typing import Dict, Any
from backend.config import settings
from .allowlist import validate_action

_SERVICE_LOCKS: Dict[str, asyncio.Lock] = {}

def get_service_lock(service_id: str) -> asyncio.Lock:
    if service_id not in _SERVICE_LOCKS:
        _SERVICE_LOCKS[service_id] = asyncio.Lock()
    return _SERVICE_LOCKS[service_id]

def compute_hmac_signature(payload: str, secret: str = settings.ADMIN_SHARED_SECRET) -> str:
    return hmac.new(secret.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256).hexdigest()

def verify_hmac_signature(payload: str, signature: str, secret: str = settings.ADMIN_SHARED_SECRET) -> bool:
    expected = compute_hmac_signature(payload, secret)
    return hmac.compare_digest(expected, signature)
