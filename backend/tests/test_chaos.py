import pytest
from backend.graph.networkx_repo import NetworkXGraphRepository
from backend.graph.seed import load_seed_topology
from backend.chaos.faults import inject_fault
from backend.security.ssrf import validate_url_safe

def test_ssrf_blocks_metadata_and_loopback():
    with pytest.raises(ValueError, match="SSRF violation|Blocked SSRF target"):
        validate_url_safe("http://169.254.169.254/latest/meta-data/")
    with pytest.raises(ValueError, match="SSRF violation|Blocked SSRF target"):
        validate_url_safe("http://127.0.0.1:8000/internal")
    with pytest.raises(ValueError, match="SSRF violation|Blocked SSRF target"):
        validate_url_safe("http://localhost:3000/admin")
    assert validate_url_safe("https://api.github.com") is True

def test_chaos_fault_injection():
    repo = NetworkXGraphRepository()
    load_seed_topology(repo, "chaos_proj")
    res = inject_fault(repo, "payment-service", fault_type="pool_exhaustion", project_id="chaos_proj")
    node = repo.get_node("payment-service", "chaos_proj")
    assert node["status"] == "degraded"
    assert node["responseTimeMs"] == 3420
    assert node["fault"] == "pool_exhaustion"
