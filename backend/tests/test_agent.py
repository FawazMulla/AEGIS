import pytest
from backend.graph.networkx_repo import NetworkXGraphRepository
from backend.graph.seed import load_seed_topology
from backend.agent.context import build_neighborhood_context
from backend.agent.fallback_rules import get_deterministic_fallback

def test_neighborhood_context_and_fallback_rules():
    repo = NetworkXGraphRepository()
    load_seed_topology(repo, "agent_test")
    ctx = build_neighborhood_context(repo, "payment-service", {"fault": "pool_exhaustion"}, hops=2, project_id="agent_test")
    assert "payment-service" in ctx

    rca = get_deterministic_fallback("payment-service", {"fault": "pool_exhaustion", "active_connections": 100})
    assert rca.root_cause_service == "payment-service"
    assert rca.confidence >= 90.0
    assert len(rca.ranked_remediations) == 3
