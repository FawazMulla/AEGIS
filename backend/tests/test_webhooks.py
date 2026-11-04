import pytest
import hmac
import hashlib
from backend.webhooks.signature import verify_github_signature

def test_github_webhook_signature():
    secret = "my_secret_token"
    payload = b'{"action": "opened", "number": 142}'
    valid_sig = "sha256=" + hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()
    assert verify_github_signature(payload, valid_sig, secret) is True
    assert verify_github_signature(payload, "sha256=invalid", secret) is False
