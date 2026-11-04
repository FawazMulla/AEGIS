import os
import yaml
import networkx as nx
from typing import Dict, Any
from .base import GraphRepository
from .networkx_repo import NetworkXGraphRepository

TOPOLOGY_YAML_PATH = os.path.join(os.path.dirname(__file__), "../../data/topology.yaml")

def load_seed_topology(repo: GraphRepository, project_id: str = "demo") -> Dict[str, Any]:
    yaml_path = os.path.abspath(TOPOLOGY_YAML_PATH)
    if not os.path.exists(yaml_path):
        yaml_path = "data/topology.yaml"

    with open(yaml_path, "r") as f:
        data = yaml.safe_load(f)

    if isinstance(repo, NetworkXGraphRepository):
        g = nx.DiGraph()
        for node in data.get("nodes", []):
            nid = node["id"]
            attrs = {k: v for k, v in node.items() if k != "id"}
            attrs.setdefault("project_id", project_id)
            g.add_node(nid, **attrs)

        for edge in data.get("edges", []):
            src = edge["source"]
            tgt = edge["target"]
            attrs = {k: v for k, v in edge.items() if k not in ("source", "target")}
            attrs.setdefault("project_id", project_id)
            g.add_edge(src, tgt, **attrs)

        repo.set_graph(project_id, g)
    return data
