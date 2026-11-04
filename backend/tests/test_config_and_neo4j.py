import pytest
from backend.config import settings, Settings
from backend.graph.neo4j_repo import Neo4jGraphRepository

def test_config_defaults_and_validation():
    s = Settings()
    assert s.GRAPH_BACKEND in ("networkx", "neo4j")
    assert s.PORT == 8000
    assert s.HOST == "0.0.0.0"
    assert s.THRESHOLD_BLOCK == 70.0
    assert s.THRESHOLD_WARN == 40.0
    assert s.NEO4J_PASSWORD == "password"
    assert s.NEO4J_URI == "bolt://localhost:7687"

def test_neo4j_offline_skip():
    repo = Neo4jGraphRepository()
    if not repo.verify_connectivity():
        pytest.skip("Neo4j daemon is not running locally; skipping integration test.")
    topology = repo.get_topology("demo")
    assert "nodes" in topology
