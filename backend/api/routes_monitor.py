from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.monitor.health_checker import health_checker

router = APIRouter(prefix="/api/monitor", tags=["Health Monitor"])

class MonitorProbeRequest(BaseModel):
    url: str
    allow_private: bool = False

@router.post("/probe")
async def api_probe_endpoint(req: MonitorProbeRequest):
    try:
        return await health_checker.probe(req.url, allow_private=req.allow_private)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
