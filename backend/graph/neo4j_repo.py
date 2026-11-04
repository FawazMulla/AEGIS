import logging
from typing import Dict, Any, List, Optional
from .base import GraphRepository
from .queries import (
    GET_NODE,
    GET_PREDECESSORS,
    GET_SUCCESSORS,
    GET_SUBGRAPH,
    ADD_INCIDENT,
    GET_INCIDENTS
)

logger = logging.getLogger(__name__)

class Neo4jGraphRepository(GraphRepository):
    def __init__(self, uri: str = "bolt://localhost:7687", user: str = "neo4j", password: str = "password"):
        self.uri = uri
        self.user = user
        self.password = password
        self._driver = None

    def _get_driver(self):
        if self._driver is None:
            try:
                from neo4j import GraphDatabase
                self._driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))
            except Exception as e:
                logger.warning(f"Could not connect to Neo4j at {self.uri}: {e}")
                raise ConnectionError(f"Neo4j offline: {e}")
        return self._driver

    def verify_connectivity(self) -> bool:
        try:
            driver = self._get_driver()
            driver.verify_connectivity()
            return True
        except Exception:
            return False

    def get_topology(self, project_id: str = "demo") -> Dict[str, Any]:
        driver = self._get_driver()
        with driver.session() as session:
            result = session.run("MATCH (n {project_id: $pid}) RETURN n", pid=project_id)
            nodes = [{"id": record["n"]["id"], "data": dict(record["n"])} for record in result]
            edge_res = session.run(
                "MATCH (u {project_id: $pid})-[r]->(v {project_id: $pid}) RETURN u.id AS source, v.id AS target, type(r) AS type, properties(r) AS props",
                pid=project_id
            )
            edges = []
            for r in edge_res:
                edge_id = f"e-{r['source']}-{r['target']}"
                edges.append({"id": edge_id, "source": r["source"], "target": r["target"], "data": {"id": edge_id, "type": r["type"], **r["props"]}})
            healthy = len([n for n in nodes if n["data"].get("status") == "healthy"])
            return {"nodes": nodes, "edges": edges, "metadata": {"totalNodes": len(nodes), "totalEdges": len(edges), "healthyCount": healthy, "warningCount": 0, "criticalCount": len(nodes) - healthy}}

    def get_node(self, node_id: str, project_id: str = "demo") -> Optional[Dict[str, Any]]:
        driver = self._get_driver()
        with driver.session() as session:
            res = session.run(GET_NODE, node_id=node_id, project_id=project_id).single()
            if res:
                return dict(res["n"])
            return None

    def get_predecessors(self, node_id: str, project_id: str = "demo") -> List[str]:
        driver = self._get_driver()
        with driver.session() as session:
            res = session.run(GET_PREDECESSORS, node_id=node_id, project_id=project_id)
            return [r["id"] for r in res]

    def get_successors(self, node_id: str, project_id: str = "demo") -> List[str]:
        driver = self._get_driver()
        with driver.session() as session:
            res = session.run(GET_SUCCESSORS, node_id=node_id, project_id=project_id)
            return [r["id"] for r in res]

    def get_subgraph(self, service_id: str, hops: int = 2, project_id: str = "demo") -> Dict[str, Any]:
        driver = self._get_driver()
        with driver.session() as session:
            res = session.run(GET_SUBGRAPH, service_id=service_id, hops=hops, project_id=project_id)
            nodes = set()
            edges = []
            for record in res:
                path = record["path"]
                for n in path.nodes:
                    nodes.add(n["id"])
                for rel in path.relationships:
                    edges.append({"source": rel.start_node["id"], "target": rel.end_node["id"], "type": rel.type})
            return {"nodes": [{"id": n} for n in nodes], "edges": edges, "node_count": len(nodes), "edge_count": len(edges)}

    def add_incident(self, service_id: str, description: str, decision_data: Dict[str, Any], project_id: str = "demo") -> str:
        import uuid
        inc_id = f"INC-{uuid.uuid4().hex[:8]}"
        driver = self._get_driver()
        with driver.session() as session:
            session.run(ADD_INCIDENT, service_id=service_id, incident_id=inc_id, description=description, decision_data=str(decision_data), project_id=project_id)
            return inc_id

    def get_incidents(self, service_id: str, days: int = 30, project_id: str = "demo") -> List[Dict[str, Any]]:
        driver = self._get_driver()
        with driver.session() as session:
            res = session.run(GET_INCIDENTS, service_id=service_id, project_id=project_id)
            return [dict(r["inc"]) for r in res]

    def reset_to_seed(self, project_id: str = "demo") -> None:
        from .seed import load_seed_topology
        load_seed_topology(self, project_id)
