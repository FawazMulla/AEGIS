from typing import Dict, Any
from backend.graph.networkx_repo import NetworkXGraphRepository

def inject_fault(repo: NetworkXGraphRepository, target_service_id: str, fault_type: str = "pool_exhaustion", project_id: str = "demo") -> Dict[str, Any]:
    g = repo._get_graph(project_id)
    if target_service_id not in g:
        raise ValueError(f"Service {target_service_id} does not exist in graph")

    if fault_type == "pool_exhaustion":
        patch = {"status": "degraded", "responseTimeMs": 3420, "errorRate": 0.45, "active_connections": 100, "max_connections": 100, "fault": "pool_exhaustion"}
    elif fault_type == "latency_spike":
        patch = {"status": "degraded", "responseTimeMs": 4500, "errorRate": 0.12, "fault": "latency_spike"}
    elif fault_type == "error_cascade":
        patch = {"status": "unhealthy", "responseTimeMs": 1200, "errorRate": 0.85, "fault": "error_cascade"}
    else:
        patch = {"status": "degraded", "responseTimeMs": 2500, "errorRate": 0.30, "fault": fault_type}

    g.nodes[target_service_id].update(patch)
    return {"target_service_id": target_service_id, "fault_type": fault_type, "applied_telemetry": patch}
