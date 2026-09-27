export interface KPIMetrics {
  mttdSeconds: number;             // Mean Time to Detect (Target: < 5s)
  mttrSeconds: number;             // Mean Time to Remediate (Target: < 45s)
  changeFailureRatePercent: number;// Target: < 2.5%
  graphQueryLatencyMs: number;     // Target: < 12ms
  autonomousHealSuccessRate: number; // e.g. 98.4%
  totalIncidentsHealed: number;
  totalSimulationsRun: number;
  preventedOutagesCount: number;
}

export interface TelemetryPoint {
  timestamp: string;
  p99LatencyMs: number;
  p50LatencyMs: number;
  errorRatePercent: number;
  rps: number;
  cpuPercent: number;
}
