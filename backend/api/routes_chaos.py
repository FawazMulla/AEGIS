from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.chaos.faults import inject_fault
from backend.graph.networkx_repo import NetworkXGraphRepository
from backend.graph.seed import load_seed_topology

router = APIRouter(prefix="/api/chaos", tags=["Chaos Fault Injection"])
default_repo = NetworkXGraphRepository()
load_seed_topology(default_repo, "demo")

class ChaosRequest(BaseModel):
    target_service_id: str
    fault_type: str = "pool_exhaustion"
    project_id: str = "demo"

@router.post("/inject")
async def api_inject_chaos(req: ChaosRequest):
    try:
        res = inject_fault(default_repo, req.target_service_id, req.fault_type, req.project_id)
        return {"status": "INJECTED", **res}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
