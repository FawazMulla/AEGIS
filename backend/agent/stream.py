import json
from typing import AsyncGenerator
from .fallback_rules import RCAResult

async def generate_healing_sse_stream(service_id: str, rca: RCAResult) -> AsyncGenerator[str, None]:
    events = [
        {"type": "thought", "content": f"Analyzing 2-hop causal subgraph topology around {service_id}..."},
        {"type": "cypher", "content": f"MATCH path = (s:Service {{id: '{service_id}'}})-[*1..2]-(m) RETURN path"},
        {"type": "thought", "content": f"Identified root cause: {rca.explanation}"},
        {"type": "candidates", "content": [r.model_dump() for r in rca.ranked_remediations]},
        {"type": "result", "content": {"root_cause": rca.root_cause_service, "confidence": rca.confidence, "selected_fix": rca.ranked_remediations[0].model_dump() if rca.ranked_remediations else None}},
        {"type": "done", "content": "RCA and remediation planning complete."}
    ]
    for ev in events:
        yield f"data: {json.dumps(ev)}\n\n"
