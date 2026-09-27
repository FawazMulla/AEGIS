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
} from 'lucide-react';
import { toast } from 'sonner';

export const FullGraphPage: React.FC = () => {
  const { nodes, edges, selectedNodeId } = useGraphStore();
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
      <div className="relative flex-1 w-full h-full rounded-2xl overflow-hidden border border-border shadow-xl">
        <GraphCanvas />

        {/* Floating Legend Overlay (Bottom Left) */}
        {showLegend && (
          <div className="absolute bottom-4 left-4 z-20 max-w-xs p-3 rounded-2xl bg-card/90 backdrop-blur-md border border-border shadow-lg space-y-2 pointer-events-auto">
            <h4 className="text-xs font-heading font-bold text-foreground flex items-center justify-between">
              <span>Topology Schema Legend</span>
              <span className="text-[10px] font-mono text-muted-foreground">AEGIS KG</span>
            </h4>

            {/* Node Status Legend */}
            <div className="grid grid-cols-2 gap-1.5 text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Healthy (SLA 100%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                <span>Fault Anomaly</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
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
                <span>Solid Arrow:</span>
                <span className="font-mono font-semibold text-foreground">CALLS (REST / gRPC)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Dashed Arrow:</span>
                <span className="font-mono font-semibold text-foreground">DEPENDS_ON (DB / Kafka)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cyan Pulsing:</span>
                <span className="font-mono font-semibold text-primary">Active Blast Radius</span>
              </div>
            </div>
          </div>
        )}

        {/* Floating Inspector Panel (Right Side) */}
        {showInspector && selectedNode && data && (
          <div className="absolute top-16 right-4 bottom-4 z-20 w-80 p-4 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-2xl overflow-y-auto space-y-3 pointer-events-auto animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-muted border border-border">
                  <Server className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xs sm:text-sm truncate max-w-[160px]" title={data.label}>
                    {data.label}
                  </h3>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    {data.layer} • {data.type}
                  </span>
                </div>
              </div>
              <Badge
                variant={data.status === 'critical' ? 'destructive' : data.status === 'simulated-risk' ? 'tertiary' : 'secondary'}
                className="text-[10px] font-bold"
              >
                {data.status.toUpperCase()}
              </Badge>
            </div>

            {/* Live Metrics */}
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs">
              <div>
                <span className="text-[9px] text-muted-foreground font-mono">P99 LATENCY</span>
                <p className="font-mono font-bold text-foreground text-sm">
                  {data.responseTimeMs ?? 24}ms
                </p>
              </div>
              <div>
                <span className="text-[9px] text-muted-foreground font-mono">ERROR RATE</span>
                <p className="font-mono font-bold text-foreground text-sm">
                  {data.errorRate !== undefined ? `${(data.errorRate * 100).toFixed(1)}%` : '0.0%'}
                </p>
              </div>
              <div>
                <span className="text-[9px] text-muted-foreground font-mono">CPU LOAD</span>
                <p className="font-mono font-bold text-foreground text-sm">
                  {data.cpuUsage ?? 32}%
                </p>
              </div>
              <div>
                <span className="text-[9px] text-muted-foreground font-mono">VERSION</span>
                <p className="font-mono font-bold text-foreground text-sm">
                  {data.version ?? 'v1.0.0'}
                </p>
              </div>
            </div>

            {/* Description */}
            {data.description && (
              <p className="text-[11px] text-muted-foreground bg-muted/20 p-2 rounded-lg border border-border/40 leading-relaxed">
                {data.description}
              </p>
            )}

            {/* Dependencies */}
            <div className="space-y-2 pt-1 border-t border-border/40 text-xs">
              <h4 className="text-[11px] font-heading font-bold text-foreground flex items-center gap-1">
                <GitCommit className="h-3 w-3 text-primary" /> Upstream Callers ({incomingEdges.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {incomingEdges.length === 0 ? (
                  <span className="text-[10px] text-muted-foreground">None</span>
                ) : (
                  incomingEdges.map((e) => (
                    <Badge key={e.id} variant="outline" className="text-[10px] py-0">
                      {e.source}
                    </Badge>
                  ))
                )}
              </div>

              <h4 className="text-[11px] font-heading font-bold text-foreground flex items-center gap-1 pt-1">
                <ArrowRight className="h-3 w-3 text-primary" /> Downstream Calls ({outgoingEdges.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {outgoingEdges.length === 0 ? (
                  <span className="text-[10px] text-muted-foreground">None</span>
                ) : (
                  outgoingEdges.map((e) => (
                    <Badge key={e.id} variant="outline" className="text-[10px] py-0">
                      {e.target}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Action CTAs */}
            <div className="pt-2 border-t border-border/40 space-y-2">
              <Button
                onClick={handleTestBlastRadius}
                className="w-full h-8 text-xs font-heading font-bold bg-primary text-primary-foreground shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Simulate PR Blast Radius
              </Button>

              <Button
                onClick={handleInjectFaultOnSelected}
                variant="destructive"
                className="w-full h-8 text-xs font-heading font-bold shadow-xs"
              >
                <Flame className="h-3.5 w-3.5 mr-1" />
                Inject Chaos Anomaly
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
