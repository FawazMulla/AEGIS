import time
from fastapi import APIRouter
from ..models.schemas import ChaosInjectionRequest

router = APIRouter(prefix="/api/chaos", tags=["Chaos Engineering"])

@router.post("/inject")
async def inject_chaos(request: ChaosInjectionRequest):
    return {
        "status": "INJECTED",
        "event_id": f"CHAOS-{int(time.time())}",
        "target_service_id": request.target_service_id,
        "chaos_type": request.chaos_type,
        "intensity_percent": request.intensity_percent,
        "duration_seconds": request.duration_seconds,
        "telemetry_anomaly": {
            "p99_latency_ms": 3420.0,
            "error_rate": 0.45,
            "cpu_percent": 94.0
        }
    }
