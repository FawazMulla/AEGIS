import React, { useState } from 'react';
import { GraphCanvas } from './GraphCanvas';
import { useGraphStore } from '@/stores/useGraphStore';
import { useSimulationStore } from '@/stores/useSimulationStore';
import { useHealingStore } from '@/stores/useHealingStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Server,
  GitCommit,
  ArrowRight,
  Sparkles,
  Flame,
  Info,
  Layers,
  X,
  Database,
  Cloud,
  Radio,
  Activity,
  Cpu,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';

export const FullGraphPage: React.FC = () => {
  const { nodes, edges, selectedNodeId, selectNode } = useGraphStore();
  const { runSimulation } = useSimulationStore();
  const { injectChaos } = useHealingStore();
  const [showLegend, setShowLegend] = useState(true);
  const [showInspector, setShowInspector] = useState(true);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const data = selectedNode?.data;

  const incomingEdges = edges.filter((e) => e.target === selectedNodeId);
  const outgoingEdges = edges.filter((e) => e.source === selectedNodeId);

  const handleTestBlastRadius = async () => {
    if (!selectedNodeId) return;
    toast.success(`Computing BFS blast radius on ${selectedNodeId}...`);
    await runSimulation();
  };

  const handleInjectFaultOnSelected = async () => {
    if (!selectedNodeId) return;
    toast.error(`Injecting chaos fault into ${selectedNodeId}...`);
    await injectChaos({
      targetServiceId: selectedNodeId,
      chaosType: 'LATENCY_SPIKE',
      intensityPercent: 85,
      durationSeconds: 60,
    });
  };

  return (
    <div className="relative w-full h-[calc(100vh-130px)] px-4 sm:px-6 pb-4 flex flex-col">
      {/* Top Banner / Breadcrumb info */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">
            Knowledge Graph Topology Explorer
          </h2>
          <Badge variant="outline" className="text-[10px] font-mono">
            54 Nodes • 142 Edges • NetworkX / Neo4j
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLegend(!showLegend)}
            className="h-8 text-xs font-heading font-semibold"
          >
            <Info className="h-3.5 w-3.5 mr-1" />
            {showLegend ? "Hide Legend" : "Show Legend"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInspector(!showInspector)}
            className="h-8 text-xs font-heading font-semibold"
          >
            <Layers className="h-3.5 w-3.5 mr-1" />
            {showInspector ? "Hide Inspector" : "Show Inspector"}
          </Button>
        </div>
      </div>

      {/* Main Canvas Container with Floating Panels */}
      <div className="relative flex-1 w-full h-full rounded-lg overflow-hidden border border-border shadow-sm">
        <GraphCanvas />

        {/* Floating Legend Overlay (Bottom Left) */}
        {showLegend && (
          <div className="absolute bottom-4 left-4 z-20 max-w-xs p-3 rounded-lg bg-card/95 border border-border shadow-md space-y-2 pointer-events-auto">
            <h4 className="text-xs font-heading font-semibold text-foreground flex items-center justify-between">
              <span>Topology Legend</span>
              <span className="text-[10px] font-mono text-muted-foreground">AEGIS KG</span>
            </h4>

            {/* Node Status Legend */}
            <div className="grid grid-cols-2 gap-1.5 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Healthy (SLA 100%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                <span>Fault Anomaly</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-tertiary" />
                <span>Simulated Risk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span>Self-Healing Loop</span>
              </div>
            </div>

            {/* Edge Relationship Types */}
            <div className="pt-1.5 border-t border-border/40 space-y-1 text-[10px] text-muted-foreground">
              <div className="flex items-center justify-between">
                <span className="text-sky-400 font-medium">REST / HTTP:</span>
                <span className="font-mono font-medium text-foreground">CALLS (gRPC)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-medium">Database / Queue:</span>
                <span className="font-mono font-medium text-foreground">DEPENDS_ON</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-medium">Blast Radius:</span>
                <span className="font-mono font-medium text-primary">Impact Wave</span>
              </div>
            </div>
          </div>
        )}

        {/* Floating Inspector Panel (Right Side) */}
        {showInspector && (
          <div className="absolute top-4 right-4 bottom-4 z-20 w-84 max-w-[90vw] p-4 rounded-lg bg-card/95 border border-border shadow-md overflow-y-auto space-y-3 pointer-events-auto animate-in slide-in-from-right-4 duration-150">
            {selectedNode && data ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-secondary border border-border">
                      {data.layer === 'gateway' ? (
                        <Radio className="h-4 w-4 text-sky-400" />
                      ) : data.layer === 'databases' ? (
                        <Database className="h-4 w-4 text-amber-400" />
                      ) : data.layer === 'cloud' ? (
                        <Cloud className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Server className="h-4 w-4 text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-xs sm:text-sm truncate max-w-[140px]" title={data.label}>
                        {data.label}
                      </h3>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">
                        {data.layer} • {data.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant={data.status === 'critical' ? 'destructive' : data.status === 'simulated-risk' ? 'secondary' : 'outline'}
                      className="text-[10px] font-medium"
                    >
                      {data.status.toUpperCase()}
                    </Badge>
                    <button
                      onClick={() => selectNode(null)}
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      title="Deselect Node"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Live Metrics */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-secondary/40 border border-border text-xs">
                  <div>
                    <span className="text-[9px] text-muted-foreground font-mono flex items-center gap-1">
                      <Activity className="h-3 w-3 text-sky-400" /> P99 LATENCY
                    </span>
                    <p className="font-mono font-semibold text-foreground text-sm mt-0.5">
                      {data.responseTimeMs ?? 24}ms
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground font-mono flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3 text-rose-400" /> ERROR RATE
                    </span>
                    <p className="font-mono font-semibold text-foreground text-sm mt-0.5">
                      {data.errorRate !== undefined ? `${(data.errorRate * 100).toFixed(1)}%` : '0.0%'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground font-mono flex items-center gap-1">
                      <Cpu className="h-3 w-3 text-emerald-400" /> CPU LOAD
                    </span>
                    <p className="font-mono font-semibold text-foreground text-sm mt-0.5">
                      {data.cpuUsage ?? 32}%
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground font-mono">VERSION</span>
                    <p className="font-mono font-semibold text-foreground text-sm mt-0.5">
                      {data.version ?? 'v1.0.0'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {data.description && (
                  <p className="text-[11px] text-muted-foreground bg-secondary/30 p-2 rounded-md border border-border leading-relaxed">
                    {data.description}
                  </p>
                )}

                {/* Dependencies */}
                <div className="space-y-2 pt-1 border-t border-border text-xs">
                  <h4 className="text-[11px] font-heading font-semibold text-foreground flex items-center gap-1">
                    <GitCommit className="h-3 w-3 text-primary" /> Upstream Callers ({incomingEdges.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {incomingEdges.length === 0 ? (
                      <span className="text-[10px] text-muted-foreground">None</span>
                    ) : (
                      incomingEdges.map((e) => (
                        <Badge
                          key={e.id}
                          variant="outline"
                          onClick={() => selectNode(e.source)}
                          className="text-[10px] py-0 cursor-pointer hover:bg-secondary"
                        >
                          {e.source}
                        </Badge>
                      ))
                    )}
                  </div>

                  <h4 className="text-[11px] font-heading font-semibold text-foreground flex items-center gap-1 pt-1">
                    <ArrowRight className="h-3 w-3 text-primary" /> Downstream Calls ({outgoingEdges.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {outgoingEdges.length === 0 ? (
                      <span className="text-[10px] text-muted-foreground">None</span>
                    ) : (
                      outgoingEdges.map((e) => (
                        <Badge
                          key={e.id}
                          variant="outline"
                          onClick={() => selectNode(e.target)}
                          className="text-[10px] py-0 cursor-pointer hover:bg-secondary"
                        >
                          {e.target}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="pt-2 border-t border-border space-y-2">
                  <Button
                    onClick={handleTestBlastRadius}
                    className="w-full h-8 text-xs font-heading font-semibold bg-primary text-primary-foreground shadow-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    Simulate PR Blast Radius
                  </Button>

                  <Button
                    onClick={handleInjectFaultOnSelected}
                    variant="destructive"
                    className="w-full h-8 text-xs font-heading font-semibold shadow-xs"
                  >
                    <Flame className="h-3.5 w-3.5 mr-1" />
                    Inject Chaos Anomaly
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4 py-2">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-1.5">
                    <Server className="h-4 w-4 text-primary" /> Node Inspector
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    Ready
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Click any microservice, database, or cloud resource in the canvas to inspect real-time metrics, telemetry, and blast radius.
                </p>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-heading font-semibold text-muted-foreground block">
                    Quick Inspect Key Services:
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {['payment-service', 'order-service', 'auth-service', 'inventory-service', 'postgres-orders'].map((serviceId) => {
                      const node = nodes.find((n) => n.id === serviceId);
                      if (!node) return null;
                      return (
                        <button
                          key={serviceId}
                          onClick={() => selectNode(serviceId)}
                          className="flex items-center justify-between p-2 rounded-md bg-secondary/40 border border-border text-xs hover:border-primary/50 transition-colors text-left"
                        >
                          <span className="font-mono font-medium text-foreground">{node.data.label}</span>
                          <Badge
                            variant={node.data.status === 'critical' ? 'destructive' : 'secondary'}
                            className="text-[9px] px-1.5 py-0"
                          >
                            {node.data.status}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
