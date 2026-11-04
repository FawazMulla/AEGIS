from typing import Dict, Any
from backend.graph.base import GraphRepository

def commit_incident_feedback(repo: GraphRepository, service_id: str, description: str, root_cause: str, action_taken: str, safety_score: float, recovery_time_sec: float, outcome: str = "resolved", project_id: str = "demo") -> str:
    decision_data = {"root_cause": root_cause, "action_taken": action_taken, "safety_score": safety_score, "recovery_time_sec": recovery_time_sec, "outcome": outcome}
    return repo.add_incident(service_id=service_id, description=description, decision_data=decision_data, project_id=project_id)
