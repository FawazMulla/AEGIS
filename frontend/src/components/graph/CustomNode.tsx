import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Shield, Server, Database, Cloud, AlertTriangle, CheckCircle2, RefreshCw, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GraphNodeData } from '@/types/graph';
import { Badge } from '@/components/ui/badge';

const getLayerIcon = (layer: string, type: string) => {
  if (layer === 'gateway') return <Radio className="h-4 w-4 text-primary" />;
  if (layer === 'databases') return <Database className="h-4 w-4 text-amber-400" />;
  if (layer === 'cloud') return <Cloud className="h-4 w-4 text-purple-400" />;
  if (type === 'Microservice') return <Server className="h-4 w-4 text-sky-400" />;
  return <Shield className="h-4 w-4 text-primary" />;
};

const getStatusBorderAndGlow = (status: string, isBlastRadius?: boolean, isRootCause?: boolean) => {
  if (isRootCause) {
    return 'border-destructive ring-2 ring-destructive ring-offset-2 ring-offset-background animate-pulse glow-red';
  }
  if (status === 'critical') {
    return 'border-destructive ring-1 ring-destructive glow-red';
  }
  if (status === 'warning') {
    return 'border-warning ring-1 ring-warning';
  }
  if (status === 'healing') {
    return 'border-primary ring-2 ring-primary animate-pulse glow-cyan';
  }
  if (status === 'simulated-risk' || isBlastRadius) {
    return 'border-tertiary ring-1 ring-tertiary glow-purple';
  }
  return 'border-border/80 hover:border-primary/60';
};

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as GraphNodeData;
  const isHealthy = nodeData.status === 'healthy';
  const isCritical = nodeData.status === 'critical' || nodeData.isRootCause;
  const isSimulatedRisk = nodeData.status === 'simulated-risk' || nodeData.isBlastRadius;
  const isHealing = nodeData.status === 'healing';

  return (
    <div
      className={cn(
        "relative rounded-2xl bg-card/95 p-3.5 shadow-md border transition-all duration-300 min-w-[200px] max-w-[240px] select-none cursor-pointer",
        getStatusBorderAndGlow(nodeData.status, nodeData.isBlastRadius, nodeData.isRootCause),
        selected && "ring-2 ring-primary shadow-lg scale-105",
        "backdrop-blur-md"
      )}
    >
      {/* React Flow Handles */}
      <Handle type="target" position={Position.Top} className="!bg-primary !border-2 !border-background" />
      <Handle type="source" position={Position.Bottom} className="!bg-primary !border-2 !border-background" />
      <Handle type="target" position={Position.Left} className="!bg-primary !border-2 !border-background" />
      <Handle type="source" position={Position.Right} className="!bg-primary !border-2 !border-background" />

      {/* Header with Icon and Health Indicator */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/80 border border-border">
            {getLayerIcon(nodeData.layer, nodeData.type)}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-heading font-bold text-xs truncate leading-tight" title={nodeData.label}>
              {nodeData.label}
            </h4>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {nodeData.type}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        {isCritical && (
          <Badge variant="destructive" className="px-1.5 py-0 text-[10px] flex items-center gap-1 font-bold animate-pulse">
            <AlertTriangle className="h-3 w-3" /> FAULT
          </Badge>
        )}
        {isHealing && (
          <Badge variant="tertiary" className="px-1.5 py-0 text-[10px] flex items-center gap-1 font-bold animate-spin">
            <RefreshCw className="h-3 w-3" /> HEAL
          </Badge>
        )}
        {isSimulatedRisk && (
          <Badge variant="secondary" className="px-1.5 py-0 text-[10px] flex items-center gap-1 font-bold bg-purple-950 text-purple-300 border-purple-800">
            RISK {nodeData.impactWeight ? `(${Math.round(nodeData.impactWeight * 100)}%)` : ''}
          </Badge>
        )}
        {isHealthy && !isSimulatedRisk && (
          <div className="flex items-center text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-border/50 text-[11px]">
        <div className="flex flex-col">
          <span className="text-[9px] text-muted-foreground">LATENCY</span>
          <span className={cn(
            "font-mono font-semibold",
            (nodeData.responseTimeMs ?? 0) > 500 ? "text-destructive" : "text-foreground"
          )}>
            {nodeData.responseTimeMs ? `${nodeData.responseTimeMs}ms` : '—'}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[9px] text-muted-foreground">ERROR RATE</span>
          <span className={cn(
            "font-mono font-semibold",
            (nodeData.errorRate ?? 0) > 0.05 ? "text-destructive" : "text-foreground"
          )}>
            {nodeData.errorRate !== undefined ? `${(nodeData.errorRate * 100).toFixed(1)}%` : '0.0%'}
          </span>
        </div>
      </div>
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
