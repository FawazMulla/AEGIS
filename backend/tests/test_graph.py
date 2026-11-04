import pytest
from backend.graph.networkx_repo import NetworkXGraphRepository
import networkx as nx

def test_networkx_graph_repository_crud():
    repo = NetworkXGraphRepository()
    g = nx.DiGraph()
    g.add_node("svc-a", label="Service A", status="healthy")
    g.add_node("svc-b", label="Service B", status="healthy")
    g.add_edge("svc-a", "svc-b", type="CALLS")
    repo.set_graph("test-proj", g)

    topo = repo.get_topology("test-proj")
    assert topo["metadata"]["totalNodes"] == 2
    assert topo["metadata"]["totalEdges"] == 1

    node_a = repo.get_node("svc-a", "test-proj")
    assert node_a is not None
    assert node_a["label"] == "Service A"

    preds = repo.get_predecessors("svc-b", "test-proj")
    assert preds == ["svc-a"]
    succs = repo.get_successors("svc-a", "test-proj")
    assert succs == ["svc-b"]

    sub = repo.get_subgraph("svc-a", hops=1, project_id="test-proj")
    assert sub["node_count"] == 2

    inc_id = repo.add_incident("svc-a", "Test outage", {"cause": "db_leak"}, "test-proj")
    assert inc_id.startswith("INC-")
    incs = repo.get_incidents("svc-a", days=30, project_id="test-proj")
    assert len(incs) == 1
    assert incs[0]["description"] == "Test outage"
