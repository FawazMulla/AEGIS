from typing import Dict, Any, Optional
from backend.config import settings
from backend.graph.base import GraphRepository
from .blast_radius import compute_blast_radius
from .contract_diff import diff_schemas, ContractDiffResult
from .cycles import detect_cycles_with_new_edge

W_B = 0.35
W_C = 0.30
W_D = 0.15
W_H = 0.20

def assess_change_risk(repo: GraphRepository, target_service: str, old_schema: Optional[Dict[str, Any]] = None, new_schema: Optional[Dict[str, Any]] = None, contract_result: Optional[ContractDiffResult] = None, proposed_calls: Optional[str] = None, project_id: str = "demo") -> Dict[str, Any]:
    blast = compute_blast_radius(repo, target_service, project_id=project_id)
    topo = repo.get_topology(project_id)
    services = [n for n in topo.get("nodes", []) if n.get("data", {}).get("type") != "Incident"]
    total_services = max(1, len(services) if services else 54)
    raw_b = (len(blast) / total_services) * 100.0
    B = min(100.0, raw_b)

    if contract_result is not None:
        c_res = contract_result
    elif old_schema is not None and new_schema is not None:
        c_res = diff_schemas(old_schema, new_schema)
    else:
        c_res = ContractDiffResult(is_breaking=False, score=0.0, breaking_changes=[], safe_changes=[])
    C = c_res.score

    D = 0.0
    if proposed_calls:
        if detect_cycles_with_new_edge(repo, target_service, proposed_calls, project_id=project_id):
            D = 100.0

    incidents = repo.get_incidents(target_service, days=30, project_id=project_id)
    incident_count = len(incidents)
    H = min(100.0, incident_count * 25.0)

    base_score = round(W_B * B + W_C * C + W_D * D, 1)
    h_contrib = round(W_H * H, 1)
    risk_score = round(base_score + h_contrib, 1)

    if risk_score >= settings.THRESHOLD_BLOCK or c_res.is_breaking:
        verdict = "BLOCKED"
    elif risk_score >= settings.THRESHOLD_WARN:
        verdict = "WARN"
    else:
        verdict = "APPROVED"

    return {
        "target_service": target_service,
        "risk_score": risk_score,
        "verdict": verdict,
        "components": {
            "blast_radius": round(B, 1),
            "contract": round(C, 1),
            "cycles": round(D, 1),
            "history": round(H, 1)
        },
        "blast_nodes": blast,
        "is_breaking": c_res.is_breaking,
        "breaking_changes": c_res.breaking_changes,
        "safe_changes": c_res.safe_changes,
        "incident_count": incident_count
    }
