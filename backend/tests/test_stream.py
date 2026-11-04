import pytest
from backend.agent.fallback_rules import get_deterministic_fallback
from backend.agent.stream import generate_healing_sse_stream

@pytest.mark.asyncio
async def test_sse_thought_stream():
    rca = get_deterministic_fallback("payment-service", {"fault": "pool_exhaustion"})
    stream = generate_healing_sse_stream("payment-service", rca)
    chunks = [c async for c in stream]
    assert len(chunks) == 6
    assert any("thought" in c for c in chunks)
    assert any("cypher" in c for c in chunks)
