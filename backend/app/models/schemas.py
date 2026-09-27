from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class NodeDataSchema(BaseModel):
    id: str
    label: str
    layer: str
    type: str
    status: str = "healthy"
    version: Optional[str] = None
    responseTimeMs: Optional[float] = None
    errorRate: Optional[float] = None
    cpuUsage: Optional[float] = None
    memoryUsage: Optional[float] = None
    impactWeight: Optional[float] = None
    depth: Optional[int] = None
    description: Optional[str] = None

class EdgeDataSchema(BaseModel):
    id: str
    source: str
    target: str
    type: str = "CALLS"
    label: Optional[str] = None
    p99LatencyMs: Optional[float] = None
    trafficRps: Optional[float] = None
    protocol: Optional[str] = "HTTP/REST"

class TopologyResponse(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    metadata: Dict[str, Any]

class PRSimulationRequest(BaseModel):
    pr_id: str
    target_service: str
    has_breaking_api_change: bool = False
    has_schema_change: bool = False
    diff_summary: str = ""

class RiskComponentsSchema(BaseModel):
    blast_radius_index: float
    contract_breaking_severity: float
    circular_dependency_penalty: float
    historical_incident_factor: float

class ImpactedNodeSchema(BaseModel):
    node_id: str
    service_name: str
    depth: int
    impact_weight: float
    criticality: str
    direct_dependency: bool

class SimulationResponse(BaseModel):
    simulation_id: str
    pr_id: str
    target_service: str
    overall_risk_score: int
    verdict: str  # PROCEED, WARNING, BLOCK
    verdict_reason: str
    components: RiskComponentsSchema
    impacted_nodes: List[ImpactedNodeSchema]
    blast_radius_count: int
    total_services_count: int
    mitigation_recommendations: List[str]
    ai_rationale: Optional[str] = None

class ChaosInjectionRequest(BaseModel):
    target_service_id: str
    chaos_type: str = "LATENCY_SPIKE"
    intensity_percent: int = 80
    duration_seconds: int = 60
    description: Optional[str] = None

class CandidateFixSchema(BaseModel):
    fix_id: str
    name: str
    action_type: str
    safety_score: float
    success_rate: float
    side_effect_risk: float
    complexity_penalty: float
    description: str
    command_payload: Dict[str, Any]
    estimated_recovery_time_sec: int

class ActuatorExecutionRequest(BaseModel):
    fix_id: str
    target_service_id: str
    command_payload: Dict[str, Any]
    is_dry_run: bool = False

class MemoryCommitRequest(BaseModel):
    incident_id: str
    target_service_id: str
    root_cause: str
    applied_fix_id: str
    recovery_time_sec: float
