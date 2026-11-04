import re
from typing import Dict, Any, Tuple
from backend.sim.contract_diff import diff_schemas, ContractDiffResult

def parse_spring_boot_git_diff(diff_text: str) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    old_schema: Dict[str, Any] = {"paths": {}, "properties": {}}
    new_schema: Dict[str, Any] = {"paths": {}, "properties": {}}

    for line in diff_text.splitlines():
        field_match = re.search(r"^[+-]\s*(?:private|public|protected)\s+([A-Za-z0-9_<>]+)\s+([A-Za-z0-9_]+)\s*;", line)
        if field_match:
            ftype, fname = field_match.groups()
            if line.startswith("-"):
                old_schema["properties"][fname] = {"type": ftype}
            elif line.startswith("+"):
                new_schema["properties"][fname] = {"type": ftype}
            continue

        mapping_match = re.search(r'^[+-]\s*@(Get|Post|Put|Delete)Mapping\s*\(\s*["\']([^"\']+)["\']\s*\)', line)
        if mapping_match:
            verb, path = mapping_match.groups()
            verb = verb.lower()
            if line.startswith("-"):
                old_schema["paths"].setdefault(path, []).append(verb)
            elif line.startswith("+"):
                new_schema["paths"].setdefault(path, []).append(verb)
            continue

    return old_schema, new_schema

def analyze_git_diff(diff_text: str) -> ContractDiffResult:
    old_s, new_s = parse_spring_boot_git_diff(diff_text)
    return diff_schemas(old_s, new_s)
