import pytest
from backend.graph.networkx_repo import NetworkXGraphRepository
from backend.graph.seed import load_seed_topology
from backend.sim.risk import assess_change_risk
from backend.sim.contract_diff import ContractDiffResult

def test_golden_loop_pr_142_learning():
    repo = NetworkXGraphRepository()
    load_seed_topology(repo, project_id="pr142_test")
    breaking_diff = ContractDiffResult(is_breaking=True, score=100.0, breaking_changes=["Removed telephone field"], safe_changes=[])

    pre_eval = assess_change_risk(repo=repo, target_service="payment-service", contract_result=breaking_diff, project_id="pr142_test")
    pre_score = pre_eval["risk_score"]
    assert pre_eval["verdict"] == "BLOCKED"
    assert pre_eval["components"]["history"] == 0.0

    repo.add_incident(service_id="payment-service", description="DB pool exhaustion failure", decision_data={"fix": "scale_pool"}, project_id="pr142_test")

    post_eval = assess_change_risk(repo=repo, target_service="payment-service", contract_result=breaking_diff, project_id="pr142_test")
    post_score = post_eval["risk_score"]
    assert post_eval["components"]["history"] == 25.0

    delta = round(post_score - pre_score, 1)
    assert delta == 5.0, f"Expected exactly +5.0 delta, got {delta}"
