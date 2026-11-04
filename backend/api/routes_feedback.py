from fastapi import APIRouter
from pydantic import BaseModel
from backend.feedback.writer import commit_incident_feedback
from backend.api.routes_chaos import default_repo

router = APIRouter(prefix="/api", tags=["Memory & Feedback"])

class MemoryCommitReq(BaseModel):
    service_id: str
    description: str
    root_cause: str
    action_taken: str
    safety_score: float = 90.0
    recovery_time_sec: float = 8.5
    outcome: str = "resolved"
    project_id: str = "demo"

@router.post("/memory/commit")
async def api_commit_memory(req: MemoryCommitReq):
    inc_id = commit_incident_feedback(
        repo=default_repo,
        service_id=req.service_id,
        description=req.description,
        root_cause=req.root_cause,
        action_taken=req.action_taken,
        safety_score=req.safety_score,
        recovery_time_sec=req.recovery_time_sec,
        outcome=req.outcome,
        project_id=req.project_id
    )
    return {"status": "COMMITTED", "incident_id": inc_id, "service_id": req.service_id, "learning_delta": "+5.0 risk score penalty applied"}

@router.get("/incidents/ledger")
async def api_get_incidents(service_id: str = "payment-service", days: int = 30, project_id: str = "demo"):
    incidents = default_repo.get_incidents(service_id, days=days, project_id=project_id)
    return {"service_id": service_id, "total_incidents": len(incidents), "incidents": incidents}
