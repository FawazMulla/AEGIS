from typing import Dict, Any, List
from pydantic import BaseModel

class ContractDiffResult(BaseModel):
    is_breaking: bool
    score: float
    breaking_changes: List[str]
    safe_changes: List[str]

def diff_schemas(old_schema: Dict[str, Any], new_schema: Dict[str, Any]) -> ContractDiffResult:
    breaking = []
    safe = []

    old_paths = old_schema.get("paths", {})
    new_paths = new_schema.get("paths", {})
    for path, methods in old_paths.items():
        if path not in new_paths:
            breaking.append(f"Deleted path: {path}")
        else:
            for method in methods:
                if method not in new_paths[path]:
                    breaking.append(f"Removed HTTP method {method.upper()} from {path}")

    for path, methods in new_paths.items():
        if path not in old_paths:
            safe.append(f"Added new path: {path}")

    old_props = old_schema.get("properties", {})
    new_props = new_schema.get("properties", {})
    for prop, p_data in old_props.items():
        if prop not in new_props:
            breaking.append(f"Deleted property/field: {prop}")
        elif p_data.get("type") != new_props[prop].get("type"):
            breaking.append(f"Changed type of field {prop} from {p_data.get('type')} to {new_props[prop].get('type')}")

    for prop in new_props:
        if prop not in old_props:
            safe.append(f"Added optional property/field: {prop}")

    is_breaking = len(breaking) > 0
    return ContractDiffResult(
        is_breaking=is_breaking,
        score=100.0 if is_breaking else 0.0,
        breaking_changes=breaking,
        safe_changes=safe
    )
