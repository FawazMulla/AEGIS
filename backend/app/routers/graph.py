from fastapi import APIRouter
from ..services.graph_service import graph_service
from ..models.schemas import TopologyResponse

router = APIRouter(prefix="/api/graph", tags=["Knowledge Graph"])

@router.get("/topology", response_model=TopologyResponse)
async def get_topology():
    return graph_service.get_topology()

@router.get("/subgraph/{node_id}")
async def get_subgraph(node_id: str, k_hops: int = 2):
    return graph_service.extract_causal_subgraph(node_id, k_hops=k_hops)

@router.get("/blast-radius/{node_id}")
async def get_blast_radius(node_id: str, max_depth: int = 3):
    return graph_service.compute_blast_radius(node_id, max_depth=max_depth)
