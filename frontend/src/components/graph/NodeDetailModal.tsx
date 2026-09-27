import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useGraphStore } from '@/stores/useGraphStore';
import { Server, Activity, Cpu, HardDrive, GitCommit, ArrowRight, AlertOctagon } from 'lucide-react';

export const NodeDetailModal: React.FC = () => {
  const { selectedNodeId, selectNode, nodes, edges } = useGraphStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const data = selectedNode?.data;

  if (!selectedNode || !data) return null;

  // Find upstream callers and downstream dependencies
  const incomingEdges = edges.filter((e) => e.target === selectedNodeId);
  const outgoingEdges = edges.filter((e) => e.source === selectedNodeId);

  return (
    <Dialog open={!!selectedNodeId} onOpenChange={(open) => !open && selectNode(null)}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-md border-border">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-muted border border-border">
                <Server className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg">{data.label}</DialogTitle>
                <DialogDescription className="text-xs">
                  Layer: {data.layer.toUpperCase()} • Type: {data.type}
                </DialogDescription>
              </div>
            </div>
            <Badge
              variant={
                data.status === 'critical' || data.isRootCause
                  ? 'destructive'
                  : data.status === 'simulated-risk'
                  ? 'tertiary'
                  : 'secondary'
              }
              className="text-xs font-bold"
            >
              {data.status.toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-xl border border-border/60">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-sky-400" />
            <div>
              <p className="text-[10px] text-muted-foreground">LATENCY (P99)</p>
              <p className="text-sm font-mono font-bold text-foreground">
                {data.responseTimeMs ?? 24} ms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AlertOctagon className="h-4 w-4 text-rose-400" />
            <div>
              <p className="text-[10px] text-muted-foreground">ERROR RATE</p>
              <p className="text-sm font-mono font-bold text-foreground">
                {data.errorRate !== undefined ? `${(data.errorRate * 100).toFixed(2)}%` : '0.00%'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-emerald-400" />
            <div>
              <p className="text-[10px] text-muted-foreground">CPU UTILIZATION</p>
              <p className="text-sm font-mono font-bold text-foreground">
                {data.cpuUsage ?? 32}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-purple-400" />
            <div>
              <p className="text-[10px] text-muted-foreground">MEMORY LOAD</p>
              <p className="text-sm font-mono font-bold text-foreground">
                {data.memoryUsage ?? 48}%
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        {data.description && (
          <p className="text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border/40">
            {data.description}
          </p>
        )}

        {/* Graph Dependencies Section */}
        <div className="space-y-2 pt-2 border-t border-border/60">
          <h4 className="text-xs font-heading font-bold text-foreground flex items-center gap-1.5">
            <GitCommit className="h-3.5 w-3.5 text-primary" /> Upstream Callers ({incomingEdges.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {incomingEdges.length === 0 ? (
              <span className="text-[11px] text-muted-foreground">Root service (No upstream callers)</span>
            ) : (
              incomingEdges.map((e) => (
                <Badge key={e.id} variant="outline" className="text-[11px]">
                  {e.source} ({e.data?.protocol ?? 'HTTP'})
                </Badge>
              ))
            )}
          </div>

          <h4 className="text-xs font-heading font-bold text-foreground flex items-center gap-1.5 pt-2">
            <ArrowRight className="h-3.5 w-3.5 text-primary" /> Downstream Dependencies ({outgoingEdges.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {outgoingEdges.length === 0 ? (
              <span className="text-[11px] text-muted-foreground">Leaf service (No downstream calls)</span>
            ) : (
              outgoingEdges.map((e) => (
                <Badge key={e.id} variant="outline" className="text-[11px]">
                  {e.target} ({e.data?.type ?? 'CALLS'})
                </Badge>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
