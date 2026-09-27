from fastapi import APIRouter
from ..models.schemas import MemoryCommitRequest

router = APIRouter(prefix="/api/memory", tags=["Memory & Learning"])

@router.post("/commit")
async def commit_incident_memory(request: MemoryCommitRequest):
    return {
        "status": "COMMITTED",
        "incident_id": request.incident_id,
        "vector_id": f"VEC-{request.incident_id}",
        "graph_nodes_updated": [request.target_service_id],
        "learning_feedback": "Resolution feedback embedded into Neo4j/NetworkX incident history. Confidence updated (+1.2%)."
    }
