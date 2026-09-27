import networkx as nx
from collections import deque
from typing import Dict, Any, List, Set

class GraphService:
    def __init__(self):
        self.graph = nx.DiGraph()
        self._init_seed_graph()

    def _init_seed_graph(self):
        """Initializes the in-memory NetworkX directed graph."""
        nodes_data = [
            ("api-gateway", {"label": "API Gateway (Kong / OCI Ingress)", "layer": "gateway", "type": "APIGateway", "status": "healthy", "version": "v3.4.1", "responseTimeMs": 14, "errorRate": 0.01}),
            ("auth-service", {"label": "Auth Service", "layer": "services", "type": "Microservice", "status": "healthy", "version": "v2.1.0", "responseTimeMs": 18, "errorRate": 0.02}),
            ("order-service", {"label": "Order Service", "layer": "services", "type": "Microservice", "status": "healthy", "version": "v4.12.3", "responseTimeMs": 38, "errorRate": 0.04}),
            ("payment-service", {"label": "Payment Service", "layer": "services", "type": "Microservice", "status": "healthy", "version": "v3.8.0", "responseTimeMs": 42, "errorRate": 0.03}),
            ("inventory-service", {"label": "Inventory Service", "layer": "services", "type": "Microservice", "status": "healthy", "version": "v1.9.4", "responseTimeMs": 22, "errorRate": 0.01}),
            ("notification-service", {"label": "Notification Service", "layer": "services", "type": "Microservice", "status": "healthy", "version": "v2.0.1", "responseTimeMs": 15, "errorRate": 0.01}),
            ("shipping-service", {"label": "Shipping Service", "layer": "services", "type": "Microservice", "status": "healthy", "version": "v1.4.0", "responseTimeMs": 29, "errorRate": 0.02}),
            ("analytics-worker", {"label": "Analytics Worker", "layer": "services", "type": "Microservice", "status": "healthy", "version": "v3.1.2", "responseTimeMs": 45, "errorRate": 0.02}),
            ("redis-session-cache", {"label": "Redis Session Cache", "layer": "databases", "type": "Cache", "status": "healthy", "version": "v7.2.4", "responseTimeMs": 2, "errorRate": 0.001}),
            ("postgres-auth", {"label": "PostgreSQL (Auth DB)", "layer": "databases", "type": "Database", "status": "healthy", "version": "v16.1", "responseTimeMs": 5, "errorRate": 0.005}),
            ("postgres-orders", {"label": "PostgreSQL (Orders DB)", "layer": "databases", "type": "Database", "status": "healthy", "version": "v16.1", "responseTimeMs": 8, "errorRate": 0.008}),
            ("postgres-payments", {"label": "PostgreSQL (Payments DB)", "layer": "databases", "type": "Database", "status": "healthy", "version": "v16.1", "responseTimeMs": 9, "errorRate": 0.007}),
            ("kafka-cluster", {"label": "Kafka Event Bus", "layer": "databases", "type": "Queue", "status": "healthy", "version": "v3.6.0", "responseTimeMs": 6, "errorRate": 0.002}),
            ("oci-oke-cluster", {"label": "OCI Kubernetes Engine (OKE)", "layer": "cloud", "type": "OCIResource", "status": "healthy", "version": "v1.29.1", "responseTimeMs": 10, "errorRate": 0.001}),
            ("oci-genai-service", {"label": "OCI Generative AI (Cohere Command R+)", "layer": "cloud", "type": "OCIResource", "status": "healthy", "version": "Command R+", "responseTimeMs": 420, "errorRate": 0.0}),
        ]

        for node_id, attrs in nodes_data:
            self.graph.add_node(node_id, **attrs)

        edges_data = [
            ("api-gateway", "auth-service", {"type": "CALLS", "protocol": "HTTP/REST", "p99LatencyMs": 24, "trafficRps": 420}),
            ("api-gateway", "order-service", {"type": "CALLS", "protocol": "HTTP/REST", "p99LatencyMs": 48, "trafficRps": 310}),
            ("api-gateway", "payment-service", {"type": "CALLS", "protocol": "HTTP/REST", "p99LatencyMs": 55, "trafficRps": 180}),
            ("api-gateway", "inventory-service", {"type": "CALLS", "protocol": "HTTP/REST", "p99LatencyMs": 32, "trafficRps": 220}),
            ("order-service", "auth-service", {"type": "CALLS", "protocol": "gRPC", "p99LatencyMs": 12, "trafficRps": 280}),
            ("order-service", "payment-service", {"type": "CALLS", "protocol": "HTTP/REST", "p99LatencyMs": 58, "trafficRps": 190}),
            ("order-service", "inventory-service", {"type": "CALLS", "protocol": "gRPC", "p99LatencyMs": 19, "trafficRps": 240}),
            ("payment-service", "auth-service", {"type": "CALLS", "protocol": "gRPC", "p99LatencyMs": 14, "trafficRps": 180}),
            ("order-service", "shipping-service", {"type": "CALLS", "protocol": "gRPC", "p99LatencyMs": 28, "trafficRps": 85}),
            ("order-service", "kafka-cluster", {"type": "DEPENDS_ON", "protocol": "AMQP", "p99LatencyMs": 8, "trafficRps": 320}),
            ("payment-service", "kafka-cluster", {"type": "DEPENDS_ON", "protocol": "AMQP", "p99LatencyMs": 9, "trafficRps": 190}),
            ("kafka-cluster", "notification-service", {"type": "DEPENDS_ON", "protocol": "AMQP", "p99LatencyMs": 11, "trafficRps": 150}),
            ("kafka-cluster", "analytics-worker", {"type": "DEPENDS_ON", "protocol": "AMQP", "p99LatencyMs": 14, "trafficRps": 490}),
            ("auth-service", "redis-session-cache", {"type": "DEPENDS_ON", "protocol": "Redis", "p99LatencyMs": 3, "trafficRps": 420}),
            ("auth-service", "postgres-auth", {"type": "DEPENDS_ON", "protocol": "PostgreSQL", "p99LatencyMs": 7, "trafficRps": 120}),
            ("order-service", "postgres-orders", {"type": "DEPENDS_ON", "protocol": "PostgreSQL", "p99LatencyMs": 12, "trafficRps": 310}),
            ("payment-service", "postgres-payments", {"type": "DEPENDS_ON", "protocol": "PostgreSQL", "p99LatencyMs": 11, "trafficRps": 180}),
            ("order-service", "oci-oke-cluster", {"type": "HOSTED_ON", "protocol": "gRPC", "p99LatencyMs": 2, "trafficRps": 0}),
            ("analytics-worker", "oci-genai-service", {"type": "CALLS", "protocol": "HTTP/REST", "p99LatencyMs": 420, "trafficRps": 10}),
        ]

        for u, v, attrs in edges_data:
            self.graph.add_edge(u, v, **attrs)

    # -------------------------------------------------------------
    # Algorithm 1: Downstream Blast Radius (BFS with Depth Attenuation)
    # -------------------------------------------------------------
    def compute_blast_radius(self, changed_node_id: str, max_depth: int = 3, attenuation: float = 0.75) -> Dict[str, Dict[str, Any]]:
        """
        Traverse upstream dependents of the changed node via BFS.
        Returns: { node_id: { depth: int, impact_weight: float } }
        """
        if changed_node_id not in self.graph:
            return {changed_node_id: {"depth": 0, "impact_weight": 1.0}}

        impacted: Dict[str, Dict[str, Any]] = {changed_node_id: {"depth": 0, "impact_weight": 1.0}}
        queue = deque([(changed_node_id, 0, 1.0)])

        while queue:
            current, depth, weight = queue.popleft()

            if depth >= max_depth:
                continue

            # Traverse UPSTREAM: services that CALL or DEPEND ON the current node
            for predecessor in self.graph.predecessors(current):
                edge_data = self.graph.get_edge_data(predecessor, current, default={})
                edge_type = edge_data.get("type", "CALLS")

                # Traversal rules: CALLS and DEPENDS_ON are traversed upstream
                if edge_type in ("CALLS", "DEPENDS_ON"):
                    if predecessor not in impacted:
                        attenuated_weight = weight * attenuation
                        impacted[predecessor] = {
                            "depth": depth + 1,
                            "impact_weight": round(attenuated_weight, 4)
                        }
                        queue.append((predecessor, depth + 1, attenuated_weight))

        return impacted

    # -------------------------------------------------------------
    # Algorithm 3: 2-Hop Causal Subgraph Extraction
    # -------------------------------------------------------------
    def extract_causal_subgraph(self, root_node_id: str, k_hops: int = 2) -> Dict[str, Any]:
        """
        Extract the k-hop causal neighborhood around root_node_id in undirected sense.
        Returns serialized nodes and edges for LLM prompt context and visual focus.
        """
        if root_node_id not in self.graph:
            return {"nodes": [], "edges": []}

        # Convert to undirected view to find all upstream and downstream nodes within k hops
        undirected_view = self.graph.to_undirected()
        subgraph_node_ids: Set[str] = {root_node_id}
        current_layer: Set[str] = {root_node_id}

        for _ in range(k_hops):
            next_layer = set()
            for node in current_layer:
                next_layer.update(undirected_view.neighbors(node))
            next_layer -= subgraph_node_ids
            subgraph_node_ids.update(next_layer)
            current_layer = next_layer

        subgraph = self.graph.subgraph(subgraph_node_ids)

        nodes = [{"id": n, **self.graph.nodes[n]} for n in subgraph.nodes()]
        edges = [
            {"source": u, "target": v, **self.graph.get_edge_data(u, v)}
            for u, v in subgraph.edges()
        ]

        return {"nodes": nodes, "edges": edges, "node_count": len(nodes), "edge_count": len(edges)}

    def check_circular_dependency(self, source: str, target: str) -> bool:
        """
        Check if adding an edge source -> target would introduce a cycle.
        """
        if nx.has_path(self.graph, target, source):
            return True
        return False

    def get_topology(self) -> Dict[str, Any]:
        """Return serialized topology."""
        nodes = []
        for n, attrs in self.graph.nodes(data=True):
            nodes.append({
                "id": n,
                "data": {"id": n, **attrs}
            })
        
        edges = []
        for u, v, attrs in self.graph.edges(data=True):
            edges.append({
                "id": f"e-{u}-{v}",
                "source": u,
                "target": v,
                "data": {"id": f"e-{u}-{v}", "source": u, "target": v, **attrs}
            })

        return {
            "nodes": nodes,
            "edges": edges,
            "metadata": {
                "totalNodes": len(nodes),
                "totalEdges": len(edges),
                "healthyCount": len([n for n in nodes if n["data"].get("status") == "healthy"]),
                "warningCount": 0,
                "criticalCount": 0,
            }
        }

graph_service = GraphService()
