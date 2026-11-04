import pytest
from backend.executor.allowlist import validate_action
from backend.executor.actuator import compute_hmac_signature, verify_hmac_signature

def test_allowlist_validation():
    validate_action("scale_pool", {"pool_size": 200})
    validate_action("restart", {"grace_period_sec": 10})
    with pytest.raises(ValueError, match="not in allowlisted"):
        validate_action("rm_rf_root", {})
    with pytest.raises(ValueError, match="pool_size"):
        validate_action("scale_pool", {"pool_size": 20})

def test_hmac_signature_verification():
    payload = '{"action": "restart"}'
    sig = compute_hmac_signature(payload, "secret-test")
    assert verify_hmac_signature(payload, sig, "secret-test") is True
    assert verify_hmac_signature(payload, sig, "wrong-secret") is False
