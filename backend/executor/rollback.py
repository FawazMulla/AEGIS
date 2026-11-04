import time
import asyncio
from typing import Dict, Any, Callable
from backend.graph.networkx_repo import NetworkXGraphRepository
from .allowlist import validate_action
from .actuator import get_service_lock

async def execute_with_deadman_watchdog(repo: NetworkXGraphRepository, service_id: str, action: str, parameters: Dict[str, Any], probe_fn: Callable[[], bool], timeout_sec: float = 10.0, project_id: str = "demo") -> Dict[str, Any]:
    validate_action(action, parameters)
    lock = get_service_lock(service_id)

    async with lock:
        g = repo._get_graph(project_id)
        if service_id not in g:
            raise ValueError(f"Service {service_id} not found in graph")

        snapshot = dict(g.nodes[service_id])

        if action == "scale_pool":
            g.nodes[service_id].update({"status": "healthy", "responseTimeMs": 42, "errorRate": 0.01, "max_connections": parameters["pool_size"], "fault": None})
        elif action == "restart":
            g.nodes[service_id].update({"status": "healthy", "responseTimeMs": 40, "errorRate": 0.01, "fault": None})

        start = time.time()
        is_healthy = False
        while (time.time() - start) < timeout_sec:
            if probe_fn():
                is_healthy = True
                break
            await asyncio.sleep(0.05)

        if is_healthy:
            return {"status": "healed", "service_id": service_id, "action": action, "elapsed_sec": round(time.time() - start, 3)}
        else:
            g.nodes[service_id].clear()
            g.nodes[service_id].update(snapshot)
            return {"status": "rolled_back", "service_id": service_id, "action": action, "reason": "Health verification failed or timed out", "elapsed_sec": round(time.time() - start, 3)}
