export type ChaosType =
  | 'LATENCY_SPIKE'
  | 'PACKET_DROP'
  | 'POD_CRASH'
  | 'CONNECTION_POOL_EXHAUSTION'
  | 'MEMORY_LEAK'
  | 'DB_LOCK';

export interface ChaosInjectionRequest {
  targetServiceId: string;
  chaosType: ChaosType;
  intensityPercent: number;
  durationSeconds: number;
  description?: string;
}

export interface ChaosEvent {
  id: string;
  targetServiceId: string;
  targetServiceName: string;
  type: ChaosType;
  intensityPercent: number;
  injectedAt: string;
  status: 'ACTIVE' | 'HEALED' | 'ROLLED_BACK' | 'FAILED';
  initialAnomaly: {
    metric: string;
    baselineValue: number;
    anomalyValue: number;
    unit: string;
  };
}
