import threading
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Set
import networkx as nx
from .base import GraphRepository

class NetworkXGraphRepository(GraphRepository):
    def __init__(self):
        self._lock = threading.RLock()
        self._graphs: Dict[str, nx.DiGraph] = {}
        self._incidents: Dict[str, List[Dict[str, Any]]] = {}

    def _get_graph(self, project_id: str) -> nx.DiGraph:
        with self._lock:
            if project_id not in self._graphs:
                g = nx.DiGraph()
                self._graphs[project_id] = g
            return self._graphs[project_id]

    def set_graph(self, project_id: str, graph: nx.DiGraph):
        with self._lock:
            self._graphs[project_id] = graph

    def get_topology(self, project_id: str = "demo") -> Dict[str, Any]:
        with self._lock:
            g = self._get_graph(project_id)
            nodes = []
            for n, data in g.nodes(data=True):
                nodes.append({"id": n, "data": {"id": n, **data}})
            edges = []
            for u, v, data in g.edges(data=True):
                edge_id = f"e-{u}-{v}"
                edges.append({"id": edge_id, "source": u, "target": v, "data": {"id": edge_id, "source": u, "target": v, **data}})
            healthy = len([n for n in nodes if n["data"].get("status") == "healthy"])
            return {
                "nodes": nodes,
                "edges": edges,
                "metadata": {
                    "totalNodes": len(nodes),
                    "totalEdges": len(edges),
                    "healthyCount": healthy,
                    "warningCount": 0,
                    "criticalCount": len(nodes) - healthy
                }
            }

    def get_node(self, node_id: str, project_id: str = "demo") -> Optional[Dict[str, Any]]:
        with self._lock:
            g = self._get_graph(project_id)
            if node_id in g:
                return {"id": node_id, **g.nodes[node_id]}
            return None

    def get_predecessors(self, node_id: str, project_id: str = "demo") -> List[str]:
        with self._lock:
            g = self._get_graph(project_id)
            if node_id in g:
                return list(g.predecessors(node_id))
            return []

    def get_successors(self, node_id: str, project_id: str = "demo") -> List[str]:
        with self._lock:
            g = self._get_graph(project_id)
            if node_id in g:
                return list(g.successors(node_id))
            return []

    def get_subgraph(self, service_id: str, hops: int = 2, project_id: str = "demo") -> Dict[str, Any]:
        with self._lock:
            g = self._get_graph(project_id)
            if service_id not in g:
                return {"nodes": [], "edges": [], "node_count": 0, "edge_count": 0}

            undirected = g.to_undirected()
            visited: Set[str] = {service_id}
            current_layer: Set[str] = {service_id}

            for _ in range(hops):
                next_layer = set()
                for node in current_layer:
                    next_layer.update(undirected.neighbors(node))
                next_layer -= visited
                visited.update(next_layer)
                current_layer = next_layer

            sub = g.subgraph(visited)
            nodes = [{"id": n, **g.nodes[n]} for n in sub.nodes()]
            edges = [{"source": u, "target": v, **g.get_edge_data(u, v)} for u, v in sub.edges()]
            return {"nodes": nodes, "edges": edges, "node_count": len(nodes), "edge_count": len(edges)}

    def add_incident(self, service_id: str, description: str, decision_data: Dict[str, Any], project_id: str = "demo") -> str:
        with self._lock:
            inc_id = f"INC-{uuid.uuid4().hex[:8]}"
            record = {
                "incident_id": inc_id,
                "service_id": service_id,
                "description": description,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "decision_data": decision_data,
                "project_id": project_id
            }
            key = f"{project_id}:{service_id}"
            if key not in self._incidents:
                self._incidents[key] = []
            self._incidents[key].append(record)

            g = self._get_graph(project_id)
            if service_id in g:
                g.add_node(inc_id, label=description, type="Incident", status="resolved")
                g.add_edge(service_id, inc_id, type="EXPERIENCED")

            return inc_id

    def get_incidents(self, service_id: str, days: int = 30, project_id: str = "demo") -> List[Dict[str, Any]]:
        with self._lock:
            key = f"{project_id}:{service_id}"
            return list(self._incidents.get(key, []))

    def reset_to_seed(self, project_id: str = "demo") -> None:
        with self._lock:
            from .seed import load_seed_topology
            load_seed_topology(self, project_id)
