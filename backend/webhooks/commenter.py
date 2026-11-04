from typing import Dict, Any

def format_risk_comment(pr_number: int, assessment: Dict[str, Any]) -> str:
    verdict = assessment.get("verdict", "BLOCKED")
    score = assessment.get("risk_score", 0.0)
    components = assessment.get("components", {})
    blast_nodes = assessment.get("blast_nodes", {})
    breaking_changes = assessment.get("breaking_changes", [])

    if verdict == "APPROVED":
        status_badge = "🟢 APPROVED (<40)"
    elif verdict == "WARN":
        status_badge = "🟡 WARN (40-69)"
    else:
        status_badge = "🔴 CRITICAL RISK (≥70)"

    callers_list = "\n".join([f"- `{node}` (depth: {data.get('depth')}, weight: {data.get('impact_weight')})" for node, data in blast_nodes.items()])
    breaking_list = "\n".join([f"- ⚠️ {b}" for b in breaking_changes]) if breaking_changes else "_None_"

    comment = f"""### 🛡️ AEGIS Change Risk Assessment — PR #{pr_number}

**Merge Gate Verdict**: {status_badge}
**Composite Risk Score**: `{score}/100`

---

#### 📊 Risk Calculation Breakdown
`Risk score computed by AEGIS: 0.35·Blast + 0.30·Contract + 0.15·Cycle + 0.20·History`
- **Blast Radius (B)**: `{components.get('blast_radius', 0.0)}%`
- **Contract Breaking Severity (C)**: `{components.get('contract', 0.0)}%`
- **Dependency Cycle Penalty (D)**: `{components.get('cycles', 0.0)}%`
- **Historical Incident Penalty (H)**: `{components.get('history', 0.0)}%`

---

#### 💥 Upstream Blast Radius Caller Chain
{callers_list}

#### 🔍 Contract Diff Findings
{breaking_list}

---
> ℹ️ *Simulated/emulator measurement computed by AEGIS*
"""
    return comment.strip()
