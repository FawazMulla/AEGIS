import pytest
from backend.graph.networkx_repo import NetworkXGraphRepository
from backend.graph.seed import load_seed_topology
from backend.sim.blast_radius import compute_blast_radius

def test_blast_radius_attenuation():
    repo = NetworkXGraphRepository()
    load_seed_topology(repo, project_id="blast_test")
    blast = compute_blast_radius(repo, "payment-service", max_hops=3, attenuation=0.75, project_id="blast_test")
    assert "payment-service" in blast
    assert blast["payment-service"]["depth"] == 0
    assert blast["payment-service"]["impact_weight"] == 1.0
    for nid, data in blast.items():
        if nid != "payment-service":
            assert data["depth"] >= 1
            assert data["impact_weight"] <= 0.75
