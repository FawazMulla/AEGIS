export type RiskVerdict = 'PROCEED' | 'WARNING' | 'BLOCK';

export interface RiskComponents {
  blastRadiusIndex: number;          // Factor B (0-100, weight 0.35)
  contractBreakingSeverity: number;  // Factor C (0 or 100, weight 0.30)
  circularDependencyPenalty: number; // Factor D (0 or 100, weight 0.15)
  historicalIncidentFactor: number;  // Factor H (0-100, weight 0.20)
}

export interface ImpactedServiceNode {
  nodeId: string;
  serviceName: string;
  depth: number;
  impactWeight: number;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  directDependency: boolean;
}

export interface PRDiffInput {
  prId: string;
  title: string;
  author: string;
  targetService: string;
  branch: string;
  changedFilesCount: number;
  linesAdded: number;
  linesDeleted: number;
  hasBreakingApiChange: boolean;
  hasSchemaChange: boolean;
  diffSummary: string;
  targetEndpoint?: string;
  apiDiffPayload?: string;
}

export interface SimulationResult {
  simulationId: string;
  prId: string;
  targetService: string;
  overallRiskScore: number;
  verdict: RiskVerdict;
  verdictReason: string;
  components: RiskComponents;
  impactedNodes: ImpactedServiceNode[];
  blastRadiusCount: number;
  totalServicesCount: number;
  mitigationRecommendations: string[];
  generatedAt: string;
  aiRationale?: string;
}
