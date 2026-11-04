import re
import yaml
from typing import Dict, Any, List

def parse_docker_compose(compose_yaml_str: str) -> Dict[str, Any]:
    data = yaml.safe_load(compose_yaml_str) or {}
    services = data.get("services", {})
    nodes = []
    edges = []
    service_names = list(services.keys())

    for name, s_data in services.items():
        image = s_data.get("image", "custom")
        ports = s_data.get("ports", [])
        env = s_data.get("environment", {})

        nodes.append({"id": name, "label": name.replace("-", " ").title(), "type": "Microservice", "tier": "backend" if "db" not in name and "redis" not in name else "databases", "image": image, "ports": ports, "status": "healthy"})

        depends_on = s_data.get("depends_on", [])
        if isinstance(depends_on, dict):
            depends_on = list(depends_on.keys())
        for dep in depends_on:
            edges.append({"source": name, "target": dep, "type": "DEPENDS_ON", "protocol": "INTERNAL"})

        env_dict = {}
        if isinstance(env, list):
            for item in env:
                if "=" in item:
                    k, v = item.split("=", 1)
                    env_dict[k] = v
        elif isinstance(env, dict):
            env_dict = env

        for val in env_dict.values():
            if isinstance(val, str):
                for target_svc in service_names:
                    if target_svc != name and re.search(rf"\b{re.escape(target_svc)}\b", val):
                        if not any(e["source"] == name and e["target"] == target_svc for e in edges):
                            edges.append({"source": name, "target": target_svc, "type": "CALLS", "protocol": "HTTP/REST"})

    return {"nodes": nodes, "edges": edges, "metadata": {"totalNodes": len(nodes), "totalEdges": len(edges)}}
