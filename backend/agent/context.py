import json
from typing import Dict, Any
from backend.graph.base import GraphRepository

def build_neighborhood_context(repo: GraphRepository, service_id: str, telemetry: Dict[str, Any], hops: int = 2, project_id: str = "demo") -> str:
    subgraph = repo.get_subgraph(service_id, hops=hops, project_id=project_id)
    incidents = repo.get_incidents(service_id, days=30, project_id=project_id)

    context = {
        "target_service": service_id,
        "telemetry_anomaly": telemetry,
        "causal_subgraph": {
            "node_count": subgraph.get("node_count", 0),
            "edge_count": subgraph.get("edge_count", 0),
            "nodes": [n.get("id") for n in subgraph.get("nodes", [])],
            "edges": [f"{e.get('source')} -[{e.get('type', 'CALLS')}]-> {e.get('target')}" for e in subgraph.get("edges", [])]
        },
        "recent_incidents": incidents
    }
    return json.dumps(context, indent=2)
