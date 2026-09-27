import { create } from 'zustand';
import { ChaosInjectionRequest, ChaosEvent } from '@/types/chaos';
import { HealingSession, SSEStepEvent, CandidateFix } from '@/types/healing';
import { KPIMetrics } from '@/types/kpi';
import { useGraphStore } from './useGraphStore';

export interface HealingState {
  activeChaos: ChaosEvent | null;
  activeSession: HealingSession | null;
  isInjectingChaos: boolean;
  isStreaming: boolean;
  isAutoPilotEnabled: boolean;
  selectedCandidateFix: CandidateFix | null;
  kpis: KPIMetrics;
  eventStreamHistory: SSEStepEvent[];

  // Actions
  injectChaos: (request: ChaosInjectionRequest) => Promise<void>;
  startHealingStream: (serviceId?: string) => Promise<void>;
  executeClientSimulatedHealing: (targetId: string) => Promise<void>;
  applyFixAction: (fix: CandidateFix) => Promise<void>;
  toggleAutoPilot: () => void;
  resetIncident: () => void;
  selectCandidateFix: (fix: CandidateFix) => void;
}

const initialKPIs: KPIMetrics = {
  mttdSeconds: 4.2,
  mttrSeconds: 38.6,
  changeFailureRatePercent: 2.1,
  graphQueryLatencyMs: 8.4,
  autonomousHealSuccessRate: 98.4,
  totalIncidentsHealed: 142,
  totalSimulationsRun: 320,
  preventedOutagesCount: 89,
};

export const useHealingStore = create<HealingState>((set, get) => ({
  activeChaos: null,
  activeSession: null,
  isInjectingChaos: false,
  isStreaming: false,
  isAutoPilotEnabled: true,
  selectedCandidateFix: null,
  kpis: initialKPIs,
  eventStreamHistory: [],

  toggleAutoPilot: () => {
    set({ isAutoPilotEnabled: !get().isAutoPilotEnabled });
  },

  selectCandidateFix: (fix: CandidateFix) => {
    set({ selectedCandidateFix: fix });
  },

  injectChaos: async (request: ChaosInjectionRequest) => {
    set({ isInjectingChaos: true });

    const graph = useGraphStore.getState();
    graph.updateNodeStatus(request.targetServiceId, 'critical', {
      responseTimeMs: request.chaosType === 'LATENCY_SPIKE' ? 3420 : 850,
      errorRate: request.chaosType === 'PACKET_DROP' ? 0.45 : 0.82,
      cpuUsage: 94,
      memoryUsage: 88,
    });
    graph.setRootCause(request.targetServiceId);

    if (request.targetServiceId === 'payment-service') {
      graph.updateNodeStatus('order-service', 'warning', {
        responseTimeMs: 2150,
        errorRate: 0.28,
      });
      graph.updateNodeStatus('api-gateway', 'warning', {
        responseTimeMs: 1420,
        errorRate: 0.15,
      });
    }

    const chaosEvent: ChaosEvent = {
      id: `CHAOS-${Date.now()}`,
      targetServiceId: request.targetServiceId,
      targetServiceName: request.targetServiceId.replace('-', ' ').toUpperCase(),
      type: request.chaosType,
      intensityPercent: request.intensityPercent,
      injectedAt: new Date().toISOString(),
      status: 'ACTIVE',
      initialAnomaly: {
        metric: request.chaosType === 'LATENCY_SPIKE' ? 'p99_latency_ms' : 'http_5xx_rate',
        baselineValue: 42,
        anomalyValue: 3420,
        unit: request.chaosType === 'LATENCY_SPIKE' ? 'ms' : '%',
      },
    };

    set({
      activeChaos: chaosEvent,
      isInjectingChaos: false,
      eventStreamHistory: [],
    });

    if (get().isAutoPilotEnabled) {
      await get().startHealingStream(request.targetServiceId);
    }
  },

  startHealingStream: async (serviceId?: string) => {
    const targetId = serviceId || get().activeChaos?.targetServiceId || 'payment-service';
    set({ isStreaming: true });

    const session: HealingSession = {
      sessionId: `HEAL-SESS-${Date.now()}`,
      incidentId: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      targetServiceId: targetId,
      targetServiceName: targetId.replace('-', ' ').toUpperCase(),
      stage: 'ANOMALY_DETECTED',
      rootCauseAnalysis: '',
      confidenceScore: 0,
      activeStep: 1,
      steps: [],
      availableFixes: [],
      isAutonomous: get().isAutoPilotEnabled,
      startedAt: new Date().toISOString(),
    };

    set({ activeSession: session });

    try {
      const eventSource = new EventSource(`http://localhost:8000/api/heal/stream?service_id=${targetId}`);
      
      eventSource.onmessage = (event) => {
        try {
          const stepData: SSEStepEvent = JSON.parse(event.data);
          const current = get().activeSession;
          if (current) {
            const updatedSteps = [...current.steps, stepData];
            const updatedSession: HealingSession = {
              ...current,
              stage: stepData.stage,
              activeStep: stepData.stepIndex,
              steps: updatedSteps,
              availableFixes: stepData.candidateFixes || current.availableFixes,
              appliedFix: stepData.selectedFix || current.appliedFix,
            };

            set({
              activeSession: updatedSession,
              eventStreamHistory: [...get().eventStreamHistory, stepData],
            });

            if (stepData.candidateFixes && stepData.candidateFixes.length > 0) {
              const first = stepData.candidateFixes[0];
              if (first) {
                set({ selectedCandidateFix: first });
              }
            }

            if (stepData.stage === 'COMMITTED') {
              useGraphStore.getState().resetGraphToHealthy();
              set({
                isStreaming: false,
                kpis: {
                  ...get().kpis,
                  totalIncidentsHealed: get().kpis.totalIncidentsHealed + 1,
                  mttrSeconds: Math.round((get().kpis.mttrSeconds * 0.9 + 28 * 0.1) * 10) / 10,
                },
              });
              eventSource.close();
            }
          }
        } catch {
          // parse error
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        get().executeClientSimulatedHealing(targetId);
      };
      return;
    } catch {
      get().executeClientSimulatedHealing(targetId);
    }
  },

  executeClientSimulatedHealing: async (targetId: string) => {
    const steps: SSEStepEvent[] = [
      {
        stepIndex: 1,
        totalSteps: 7,
        stage: 'ANOMALY_DETECTED',
        timestamp: new Date().toISOString(),
        title: 'Anomaly Threshold Breach Detected',
        detail: `eBPF Telemetry Agent detected p99 latency spike (3420ms > 200ms threshold) and 5xx error rate (45.2%) on ${targetId}.`,
        highlightNodes: [targetId],
      },
      {
        stepIndex: 2,
        totalSteps: 7,
        stage: 'SUBGRAPH_EXTRACTED',
        timestamp: new Date().toISOString(),
        title: '2-Hop Causal Subgraph Extracted (Algorithm 3)',
        detail: `Extracted 6 nodes (APIGateway, OrderService, PaymentService, PostgreSQL Payments, Redis, Kafka) and 9 relationships in 6.2ms.`,
        subgraphNodes: ['api-gateway', 'order-service', 'payment-service', 'postgres-payments', 'redis-session-cache', 'kafka-cluster'],
      },
      {
        stepIndex: 3,
        totalSteps: 7,
        stage: 'LLM_REASONING',
        timestamp: new Date().toISOString(),
        title: 'Cohere Command R+ Graph-Grounded Root Cause Diagnosis',
        detail: `LLM Reasoning Output: Database connection pool exhaustion detected on ${targetId} -> PostgreSQL(Payments). Thread starvation causing cascading latency backlog to OrderService.`,
      },
      {
        stepIndex: 4,
        totalSteps: 7,
        stage: 'PLAN_GENERATED',
        timestamp: new Date().toISOString(),
        title: 'Candidate Fix Generation & Safety Scoring (Algorithm 4)',
        detail: `Generated 3 remediation candidates with automated safety score ranking. Selected top-scoring Fix #1 (Score: 94.5/100).`,
        candidateFixes: [
          {
            fixId: 'FIX-001',
            name: 'Scale Connection Pool & Soft Rolling Restart',
            actionType: 'K8S_RESTART',
            safetyScore: 94.5,
            successRate: 98.0,
            sideEffectRisk: 5.0,
            complexityPenalty: 4.0,
            description: 'Dynamically expand DB max_connections pool to 120 and perform zero-downtime rolling pod restart.',
            commandPayload: { max_pool: 120, restart_policy: 'RollingUpdate', max_surge: '25%' },
            estimatedRecoveryTimeSec: 12,
            isSelected: true,
          },
          {
            fixId: 'FIX-002',
            name: 'Trip Circuit Breaker & Shed Non-Critical Traffic',
            actionType: 'CIRCUIT_BREAKER_TRIP',
            safetyScore: 78.2,
            successRate: 90.0,
            sideEffectRisk: 22.0,
            complexityPenalty: 12.0,
            description: 'Trip upstream circuit breaker on OrderService to drop non-critical background analytics telemetry.',
            commandPayload: { breaker_threshold: '10%', timeout_ms: 1000 },
            estimatedRecoveryTimeSec: 6,
          },
          {
            fixId: 'FIX-003',
            name: 'Full Image Rollback to Last Known Good (v3.7.9)',
            actionType: 'ROLLBACK',
            safetyScore: 68.0,
            successRate: 99.0,
            sideEffectRisk: 40.0,
            complexityPenalty: 30.0,
            description: 'Revert deployment to previous container image tag v3.7.9. Destructive to in-flight sessions.',
            commandPayload: { target_revision: 'v3.7.9' },
            estimatedRecoveryTimeSec: 45,
          },
        ],
      },
      {
        stepIndex: 5,
        totalSteps: 7,
        stage: 'ACTUATION_EXECUTING',
        timestamp: new Date().toISOString(),
        title: 'Executing Kubernetes & OCI Actuation Plan',
        detail: `Dispatched authenticated kubectl rollout restart deployment/${targetId} and updated ConfigMap pool parameters in OCI OKE cluster.`,
      },
      {
        stepIndex: 6,
        totalSteps: 7,
        stage: 'HEALTH_VERIFYING',
        timestamp: new Date().toISOString(),
        title: "Dead-Man's Health Probing Active (Algorithm 5)",
        detail: `Probing /healthz and /ready endpoints with exponential backoff. Probe 1: 180ms (PASS), Probe 2: 42ms (PASS), Probe 3: 38ms (PASS). Error rate: 0.0%.`,
        healthProbeResult: {
          probeNumber: 3,
          maxProbes: 3,
          isHealthy: true,
          responseTimeMs: 38,
          errorRate: 0.0,
        },
      },
      {
        stepIndex: 7,
        totalSteps: 7,
        stage: 'COMMITTED',
        timestamp: new Date().toISOString(),
        title: 'Topology Graph Updated & Incident Resolved',
        detail: `All 54 nodes verified healthy. Incident knowledge vector committed to OCI Memory Graph for future zero-shot remediation.`,
      },
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (!step) continue;
      await new Promise((res) => setTimeout(res, 850));

      const current = get().activeSession;
      if (current) {
        const updatedSteps = [...current.steps, step];
        set({
          activeSession: {
            ...current,
            stage: step.stage,
            activeStep: step.stepIndex,
            steps: updatedSteps,
            availableFixes: step.candidateFixes || current.availableFixes,
            appliedFix: step.candidateFixes ? step.candidateFixes[0] : current.appliedFix,
          },
          eventStreamHistory: [...get().eventStreamHistory, step],
        });

        if (step.candidateFixes && step.candidateFixes.length > 0) {
          const first = step.candidateFixes[0];
          if (first) {
            set({ selectedCandidateFix: first });
          }
        }
      }
    }

    useGraphStore.getState().resetGraphToHealthy();
    set({
      isStreaming: false,
      kpis: {
        ...get().kpis,
        totalIncidentsHealed: get().kpis.totalIncidentsHealed + 1,
        mttrSeconds: 34.2,
      },
    });
  },

  applyFixAction: async (fix: CandidateFix) => {
    set({ selectedCandidateFix: fix });
    const targetId = get().activeChaos?.targetServiceId || 'payment-service';
    const graph = useGraphStore.getState();
    graph.updateNodeStatus(targetId, 'healing');
    await new Promise((res) => setTimeout(res, 1000));
    graph.resetGraphToHealthy();

    const finishStep: SSEStepEvent = {
      stepIndex: 7,
      totalSteps: 7,
      stage: 'COMMITTED',
      timestamp: new Date().toISOString(),
      title: 'Human-Approved Fix Successfully Applied & Verified',
      detail: `Operator selected and verified '${fix.name}' (Safety: ${fix.safetyScore}/100). Node returned to optimal baseline latency (36ms).`,
    };

    set({
      isStreaming: false,
      eventStreamHistory: [...get().eventStreamHistory, finishStep],
      activeChaos: null,
      kpis: {
        ...get().kpis,
        totalIncidentsHealed: get().kpis.totalIncidentsHealed + 1,
      },
    });
  },

  resetIncident: () => {
    set({
      activeChaos: null,
      activeSession: null,
      isStreaming: false,
      eventStreamHistory: [],
    });
    useGraphStore.getState().resetGraphToHealthy();
  },
}));
