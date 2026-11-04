from typing import Dict, Any

ALLOWED_ACTIONS = {"restart", "scale_pool", "rollback"}

def validate_action(action: str, parameters: Dict[str, Any]) -> None:
    if action not in ALLOWED_ACTIONS:
        raise ValueError(f"Action '{action}' is not in allowlisted actions: {ALLOWED_ACTIONS}")
    if action == "scale_pool":
        pool_size = parameters.get("pool_size")
        if pool_size is None or not (100 <= pool_size <= 500):
            raise ValueError(f"Invalid pool_size {pool_size}; must be bounded in [100, 500]")
    elif action == "restart":
        grace = parameters.get("grace_period_sec", 15)
        if not (0 <= grace <= 60):
            raise ValueError(f"Invalid grace_period_sec {grace}; must be bounded in [0, 60]")
