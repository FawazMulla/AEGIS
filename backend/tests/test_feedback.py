import pytest
from backend.graph.networkx_repo import NetworkXGraphRepository
from backend.feedback.writer import commit_incident_feedback

def test_commit_incident_feedback():
    repo = NetworkXGraphRepository()
    repo._get_graph("test_proj").add_node("payment-service", label="Payment")
    inc_id = commit_incident_feedback(repo=repo, service_id="payment-service", description="DB Exhaustion Outage", root_cause="Connection leak", action_taken="scale_pool", safety_score=85.0, recovery_time_sec=7.2, project_id="test_proj")
    assert inc_id.startswith("INC-")
    incs = repo.get_incidents("payment-service", days=30, project_id="test_proj")
    assert len(incs) == 1
    assert incs[0]["description"] == "DB Exhaustion Outage"
