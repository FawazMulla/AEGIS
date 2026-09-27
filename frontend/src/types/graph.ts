export type GraphLayer = 'gateway' | 'services' | 'databases' | 'infrastructure' | 'cloud';

export type NodeType =
  | 'APIGateway'
  | 'Microservice'
  | 'Database'
  | 'Cache'
  | 'Queue'
  | 'KubernetesPod'
  | 'APIEndpoint'
  | 'OCIResource';

export type NodeHealthStatus = 'healthy' | 'warning' | 'critical' | 'simulated-risk' | 'healing';

export interface GraphNodeData extends Record<string, unknown> {
  id: string;
  label: string;
  layer: GraphLayer;
  type: NodeType;
  status: NodeHealthStatus;
  version?: string;
  responseTimeMs?: number;
  errorRate?: number;
  cpuUsage?: number;
  memoryUsage?: number;
  impactWeight?: number;
  depth?: number;
  isBlastRadius?: boolean;
  isRootCause?: boolean;
  description?: string;
  metadata?: Record<string, unknown>;
}

export type EdgeType = 'CALLS' | 'DEPENDS_ON' | 'EXPOSES' | 'INSTANCE_OF' | 'HOSTED_ON';

export interface GraphEdgeData extends Record<string, unknown> {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: EdgeType;
  p99LatencyMs?: number;
  trafficRps?: number;
  protocol?: 'HTTP/REST' | 'gRPC' | 'PostgreSQL' | 'Redis' | 'AMQP';
  isImpacted?: boolean;
  isDegraded?: boolean;
}

export interface GraphTopology {
  nodes: Array<{
    id: string;
    type?: string;
    position: { x: number; y: number };
    data: GraphNodeData;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type?: string;
    animated?: boolean;
    data: GraphEdgeData;
  }>;
  metadata: {
    totalNodes: number;
    totalEdges: number;
    healthyCount: number;
    warningCount: number;
    criticalCount: number;
    lastUpdated: string;
  };
}
