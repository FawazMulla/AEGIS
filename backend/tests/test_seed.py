import pytest
from backend.graph.networkx_repo import NetworkXGraphRepository
from backend.graph.seed import load_seed_topology

def test_load_seed_topology():
    repo = NetworkXGraphRepository()
    load_seed_topology(repo, project_id="demo")

    topo = repo.get_topology("demo")
    assert topo["metadata"]["totalNodes"] == 54
    assert topo["metadata"]["totalEdges"] == 142
    assert repo.get_node("api-gateway", "demo") is not None
    assert repo.get_node("payment-service", "demo") is not None
