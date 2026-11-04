import pytest
from httpx import AsyncClient, ASGITransport
from fastapi import FastAPI
from backend.api.routes_feedback import router as feedback_router
from backend.api.routes_chaos import default_repo
from backend.sim.risk import assess_change_risk
from backend.sim.contract_diff import ContractDiffResult

app = FastAPI()
app.include_router(feedback_router)

@pytest.mark.asyncio
async def test_api_closed_loop_lifecycle():
    breaking_diff = ContractDiffResult(is_breaking=True, score=100.0, breaking_changes=["Drop field"], safe_changes=[])
    pre_eval = assess_change_risk(repo=default_repo, target_service="payment-service", contract_result=breaking_diff, project_id="closed_loop_test")
    pre_score = pre_eval["risk_score"]

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post("/api/memory/commit", json={"service_id": "payment-service", "description": "Postgres connection pool leak", "root_cause": "pool_exhaustion", "action_taken": "scale_pool", "project_id": "closed_loop_test"})
        assert resp.status_code == 200

    post_eval = assess_change_risk(repo=default_repo, target_service="payment-service", contract_result=breaking_diff, project_id="closed_loop_test")
    post_score = post_eval["risk_score"]
    delta = round(post_score - pre_score, 1)
    assert delta == 5.0, f"Expected +5.0, got {delta}"
