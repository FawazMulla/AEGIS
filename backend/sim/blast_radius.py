from collections import deque
from typing import Dict, Any
from backend.graph.base import GraphRepository

def compute_blast_radius(repo: GraphRepository, target_service: str, max_hops: int = 3, attenuation: float = 0.75, project_id: str = "demo") -> Dict[str, Dict[str, Any]]:
    node = repo.get_node(target_service, project_id)
    if not node:
        return {target_service: {"depth": 0, "impact_weight": 1.0}}

    impacted: Dict[str, Dict[str, Any]] = {target_service: {"depth": 0, "impact_weight": 1.0}}
    queue = deque([(target_service, 0, 1.0)])

    while queue:
        current, depth, weight = queue.popleft()
        if depth >= max_hops:
            continue
        predecessors = repo.get_predecessors(current, project_id)
        for pred in predecessors:
            if pred not in impacted:
                attenuated_weight = round(weight * attenuation, 4)
                impacted[pred] = {"depth": depth + 1, "impact_weight": attenuated_weight}
                queue.append((pred, depth + 1, attenuated_weight))

    return impacted
