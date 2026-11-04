import pytest
from backend.agent.rca import diagnose_incident

@pytest.mark.asyncio
async def test_llm_resilience_fallback():
    res = await diagnose_incident("payment-service", "Context test", {"fault": "pool_exhaustion"})
    assert res.root_cause_service == "payment-service"
    assert res.confidence > 90.0
    assert len(res.ranked_remediations) > 0
