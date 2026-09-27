import pytest
from app.services.graph_service import graph_service
from app.services.risk_engine import risk_engine
from app.services.llm_agent import llm_agent

def test_algorithm_1_blast_radius_traversal():
    """Verify Algorithm 1 BFS traversal with 0.75 attenuation factor."""
    result = graph_service.compute_blast_radius("payment-service", max_depth=3, attenuation=0.75)
    
    assert "payment-service" in result
    assert result["payment-service"]["depth"] == 0
    assert result["payment-service"]["impact_weight"] == 1.0

    # OrderService calls PaymentService, so depth=1, weight=0.75
    assert "order-service" in result
    assert result["order-service"]["depth"] == 1
    assert result["order-service"]["impact_weight"] == 0.75

    # APIGateway calls PaymentService directly, so depth=1, weight=0.75
    assert "api-gateway" in result
    assert result["api-gateway"]["depth"] == 1
    assert result["api-gateway"]["impact_weight"] == 0.75

def test_algorithm_2_composite_risk_scoring():
    """Verify Algorithm 2 Composite Risk Scoring: R = 0.35*B + 0.30*C + 0.15*D + 0.20*H."""
    res_breaking = risk_engine.compute_risk(
        pr_id="PR-1082",
        target_service="payment-service",
        has_breaking_api_change=True,
        has_schema_change=True
    )
    assert res_breaking["verdict"] in ("BLOCK", "WARNING")
    assert res_breaking["overall_risk_score"] > 50
    assert res_breaking["components"]["contract_breaking_severity"] == 100.0

    res_safe = risk_engine.compute_risk(
        pr_id="PR-1083",
        target_service="notification-service",
        has_breaking_api_change=False,
        has_schema_change=False
    )
    assert res_safe["verdict"] == "PROCEED"
    assert res_safe["overall_risk_score"] < 35

def test_algorithm_3_causal_subgraph_extraction():
    """Verify Algorithm 3 2-hop causal subgraph extraction."""
    subgraph = graph_service.extract_causal_subgraph("payment-service", k_hops=2)
    assert subgraph["node_count"] >= 4
    assert any(n["id"] == "payment-service" for n in subgraph["nodes"])
    assert any(n["id"] == "order-service" for n in subgraph["nodes"])

def test_algorithm_4_fix_safety_scoring():
    """Verify Algorithm 4 Fix Safety Scoring formula."""
    # S_F = 0.40 * 98 + 0.35 * (100 - 5) + 0.25 * (100 - 4) = 39.2 + 33.25 + 24.0 = 96.45
    score = llm_agent.compute_fix_safety_score(success_rate=98.0, side_effect_risk=5.0, complexity_penalty=4.0)
    assert 90.0 <= score <= 100.0
