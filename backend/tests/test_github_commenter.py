import pytest
from backend.webhooks.commenter import format_risk_comment

def test_github_commenter_markdown_and_disclaimer():
    assessment = {
        "verdict": "BLOCKED",
        "risk_score": 75.0,
        "components": {"blast_radius": 20.0, "contract": 100.0, "cycles": 0.0, "history": 0.0},
        "blast_nodes": {"payment-service": {"depth": 0, "impact_weight": 1.0}, "order-service": {"depth": 1, "impact_weight": 0.75}},
        "breaking_changes": ["Deleted telephone field"]
    }
    comment = format_risk_comment(142, assessment)
    assert "🛡️ AEGIS Change Risk Assessment — PR #142" in comment
    assert "🔴 CRITICAL RISK" in comment
    assert "Simulated/emulator measurement" in comment
