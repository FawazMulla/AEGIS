import pytest
from backend.graph.networkx_repo import NetworkXGraphRepository
from backend.graph.seed import load_seed_topology
from backend.executor.rollback import execute_with_deadman_watchdog

@pytest.mark.asyncio
async def test_deadman_watchdog_success():
    repo = NetworkXGraphRepository()
    load_seed_topology(repo, "watchdog_test")
    res = await execute_with_deadman_watchdog(repo=repo, service_id="payment-service", action="scale_pool", parameters={"pool_size": 150}, probe_fn=lambda: True, project_id="watchdog_test")
    assert res["status"] == "healed"

@pytest.mark.asyncio
async def test_deadman_watchdog_failure_triggers_rollback():
    repo = NetworkXGraphRepository()
    load_seed_topology(repo, "watchdog_fail_test")
    g = repo._get_graph("watchdog_fail_test")
    g.nodes["payment-service"]["status"] = "degraded"
    g.nodes["payment-service"]["original_marker"] = "keep_me"
    res = await execute_with_deadman_watchdog(repo=repo, service_id="payment-service", action="scale_pool", parameters={"pool_size": 150}, probe_fn=lambda: False, timeout_sec=0.1, project_id="watchdog_fail_test")
    assert res["status"] == "rolled_back"
    assert repo.get_node("payment-service", "watchdog_fail_test")["status"] == "degraded"
