import pytest
from httpx import AsyncClient, ASGITransport
from fastapi import FastAPI
from backend.api.routes_chaos import router as chaos_router
from backend.api.routes_monitor import router as monitor_router

app = FastAPI()
app.include_router(chaos_router)
app.include_router(monitor_router)

@pytest.mark.asyncio
async def test_chaos_and_monitor_endpoints():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post("/api/chaos/inject", json={"target_service_id": "payment-service", "fault_type": "pool_exhaustion"})
        assert resp.status_code == 200
        assert resp.json()["status"] == "INJECTED"

        resp_ssrf = await client.post("/api/monitor/probe", json={"url": "http://169.254.169.254/secret"})
        assert resp_ssrf.status_code == 400
