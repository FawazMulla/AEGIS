export type HealingStage =
  | 'IDLE'
  | 'ANOMALY_DETECTED'
  | 'SUBGRAPH_EXTRACTED'
  | 'LLM_REASONING'
  | 'PLAN_GENERATED'
  | 'ACTUATION_EXECUTING'
  | 'HEALTH_VERIFYING'
  | 'COMMITTED'
  | 'FAILED'
  | 'ROLLED_BACK';

export interface CandidateFix {
  fixId: string;
  name: string;
  actionType: 'K8S_RESTART' | 'CONFIG_UPDATE' | 'CIRCUIT_BREAKER_TRIP' | 'SCALE_REPLICAS' | 'ROLLBACK';
  safetyScore: number; // Algorithm 4: 0-100
  successRate: number;
  sideEffectRisk: number;
  complexityPenalty: number;
  description: string;
  commandPayload: Record<string, unknown>;
  estimatedRecoveryTimeSec: number;
  isSelected?: boolean;
}

export interface SSEStepEvent {
  stepIndex: number;
  totalSteps: number;
  stage: HealingStage;
  timestamp: string;
  title: string;
  detail: string;
  rawPayload?: Record<string, unknown>;
  highlightNodes?: string[];
  subgraphNodes?: string[];
  candidateFixes?: CandidateFix[];
  selectedFix?: CandidateFix;
  healthProbeResult?: {
    probeNumber: number;
    maxProbes: number;
    isHealthy: boolean;
    responseTimeMs: number;
    errorRate: number;
  };
}

export interface HealingSession {
  sessionId: string;
  incidentId: string;
  targetServiceId: string;
  targetServiceName: string;
  stage: HealingStage;
  rootCauseAnalysis: string;
  confidenceScore: number;
  activeStep: number;
  steps: SSEStepEvent[];
  availableFixes: CandidateFix[];
  appliedFix?: CandidateFix;
  isAutonomous: boolean;
  startedAt: string;
  resolvedAt?: string;
  mttrSeconds?: number;
}
