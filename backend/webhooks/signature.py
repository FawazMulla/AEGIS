import hmac
import hashlib
from backend.config import settings

def verify_github_signature(payload_bytes: bytes, header_signature: str, secret: str = settings.WEBHOOK_SECRET) -> bool:
    if not header_signature or not header_signature.startswith("sha256="):
        return False
    received_sig = header_signature[7:]
    expected_sig = hmac.new(secret.encode("utf-8"), payload_bytes, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected_sig, received_sig)
