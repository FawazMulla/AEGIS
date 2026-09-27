from fastapi import APIRouter
from ..models.schemas import PRSimulationRequest, SimulationResponse
from ..services.risk_engine import risk_engine

router = APIRouter(prefix="/api", tags=["Pre-Ship Simulation"])

@router.post("/simulate-pr", response_model=SimulationResponse)
async def simulate_pr(request: PRSimulationRequest):
    result = risk_engine.compute_risk(
        pr_id=request.pr_id,
        target_service=request.target_service,
        has_breaking_api_change=request.has_breaking_api_change,
        has_schema_change=request.has_schema_change,
        diff_summary=request.diff_summary
    )
    return result
