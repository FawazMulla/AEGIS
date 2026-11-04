from typing import Dict, Any, List
from pydantic import BaseModel

class CandidateRemediation(BaseModel):
    fix_id: str
    action: str
    safety_index: float
    recovery_probability: float
    final_score: float
    parameters: Dict[str, Any]
    description: str

class RCAResult(BaseModel):
    root_cause_service: str
    confidence: float
    explanation: str
    ranked_remediations: List[CandidateRemediation]

def get_deterministic_fallback(service_id: str, telemetry: Dict[str, Any]) -> RCAResult:
    fault = telemetry.get("fault", "pool_exhaustion")
    if "pool" in fault or telemetry.get("active_connections", 0) >= 80:
        explanation = f"Database connection pool exhaustion detected on {service_id}. High concurrency causing thread starvation and upstream latency cascades."
        remediations = [
            CandidateRemediation(fix_id="FIX-001", action="scale_pool", safety_index=85.0, recovery_probability=95.0, final_score=89.0, parameters={"pool_size": 150}, description="Scale DB connection pool size from 100 to 150"),
            CandidateRemediation(fix_id="FIX-002", action="restart", safety_index=90.0, recovery_probability=40.0, final_score=70.0, parameters={"grace_period_sec": 15}, description="Rolling restart pods to clear hung connections"),
            CandidateRemediation(fix_id="FIX-003", action="rollback", safety_index=55.0, recovery_probability=60.0, final_score=57.0, parameters={"revision": "previous"}, description="Rollback release to prior container image")
        ]
    else:
        explanation = f"High latency and elevated error rate on {service_id} due to transient service degradation."
        remediations = [
            CandidateRemediation(fix_id="FIX-001", action="restart", safety_index=90.0, recovery_probability=85.0, final_score=88.0, parameters={"grace_period_sec": 10}, description="Restart affected container workload"),
            CandidateRemediation(fix_id="FIX-002", action="rollback", safety_index=75.0, recovery_probability=70.0, final_score=73.0, parameters={"revision": "previous"}, description="Rollback to previous stable image")
        ]

    return RCAResult(root_cause_service=service_id, confidence=94.5, explanation=explanation, ranked_remediations=remediations)
