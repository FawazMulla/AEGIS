from typing import List, Tuple
from backend.graph.base import GraphRepository

def detect_cycles_with_new_edge(repo: GraphRepository, source: str, target: str, project_id: str = "demo") -> bool:
    if source == target:
        return True
    visited = set()
    queue = [target]
    while queue:
        curr = queue.pop(0)
        if curr == source:
            return True
        if curr not in visited:
            visited.add(curr)
            succs = repo.get_successors(curr, project_id)
            for s in succs:
                if s not in visited:
                    queue.append(s)
    return False
