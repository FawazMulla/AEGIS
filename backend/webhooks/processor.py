from typing import Dict, Any, Optional
from backend.graph.base import GraphRepository
from backend.sim.risk import assess_change_risk
from backend.webhooks.git_diff_analyzer import analyze_git_diff
from backend.webhooks.commenter import format_risk_comment

async def process_pull_request_webhook(repo: GraphRepository, payload: Dict[str, Any], diff_patch: Optional[str] = None, project_id: str = "demo") -> Dict[str, Any]:
    action = payload.get("action")
    if action not in ("opened", "synchronize", "reopened"):
        return {"status": "ignored", "reason": f"Unsupported action {action}"}

    pr_data = payload.get("pull_request", {})
    pr_number = pr_data.get("number", 1)
    target_service = payload.get("repository", {}).get("name", "payment-service")

    contract_res = None
    if diff_patch:
        contract_res = analyze_git_diff(diff_patch)

    assessment = assess_change_risk(repo=repo, target_service=target_service, contract_result=contract_res, project_id=project_id)
    markdown_comment = format_risk_comment(pr_number, assessment)

    return {"status": "processed", "pr_number": pr_number, "target_service": target_service, "assessment": assessment, "comment": markdown_comment}
