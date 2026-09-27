import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Shield, Server, Database, Cloud, AlertTriangle, CheckCircle2, RefreshCw, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GraphNodeData } from '@/types/graph';
import { Badge } from '@/components/ui/badge';

const getLayerConfig = (layer: string, type: string) => {
  if (layer === 'gateway') {
    return {
      icon: <Radio className="h-4 w-4 text-sky-400" />,
      bg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
      labelColor: 'text-sky-400',
    };
  }
  if (layer === 'databases') {
    return {
      icon: <Database className="h-4 w-4 text-amber-400" />,
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      labelColor: 'text-amber-400',
    };
  }
  if (layer === 'cloud') {
    return {
      icon: <Cloud className="h-4 w-4 text-emerald-400" />,
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      labelColor: 'text-emerald-400',
    };
  }
  if (type === 'Microservice') {
    return {
      icon: <Server className="h-4 w-4 text-indigo-400" />,
      bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
      labelColor: 'text-indigo-400',
    };
  }
  return {
    icon: <Shield className="h-4 w-4 text-primary" />,
    bg: 'bg-primary/10 border-primary/30 text-primary',
    labelColor: 'text-primary',
  };
};

const getStatusBorderAndGlow = (status: string, isBlastRadius?: boolean, isRootCause?: boolean) => {
  if (isRootCause) {
    return 'border-destructive ring-2 ring-destructive/80 bg-destructive/10 shadow-lg shadow-destructive/10';
  }
  if (status === 'critical') {
    return 'border-destructive ring-1 ring-destructive/60 bg-destructive/5';
  }
  if (status === 'warning') {
    return 'border-amber-500/80 bg-amber-500/5 ring-1 ring-amber-500/40';
  }
  if (status === 'healing') {
    return 'border-sky-400 ring-1 ring-sky-400/80 bg-sky-950/20';
  }
  if (status === 'simulated-risk' || isBlastRadius) {
    return 'border-purple-500/80 ring-1 ring-purple-500/60 bg-purple-950/20';
  }
  return 'border-border/80 hover:border-primary/60 hover:shadow-md';
};

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as GraphNodeData;
  const isHealthy = nodeData.status === 'healthy';
  const isCritical = nodeData.status === 'critical' || nodeData.isRootCause;
  const isSimulatedRisk = nodeData.status === 'simulated-risk' || nodeData.isBlastRadius;
  const isHealing = nodeData.status === 'healing';

  const layerConfig = getLayerConfig(nodeData.layer, nodeData.type);

  const pulseColor = isCritical
    ? 'bg-destructive'
    : isSimulatedRisk
    ? 'bg-purple-400'
    : isHealing
    ? 'bg-sky-400'
    : 'bg-emerald-400';

  return (
    <div
      className={cn(
        "relative rounded-lg bg-card/95 backdrop-blur-sm p-3.5 shadow-sm border transition-all duration-150 min-w-[215px] max-w-[250px] select-none cursor-pointer",
        getStatusBorderAndGlow(nodeData.status, nodeData.isBlastRadius, nodeData.isRootCause),
        selected && "ring-2 ring-primary border-primary shadow-md scale-[1.02]"
      )}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-primary/80 !border-2 !border-background shadow-xs pointer-events-auto"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-primary/80 !border-2 !border-background shadow-xs pointer-events-auto"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-primary/80 !border-2 !border-background shadow-xs pointer-events-auto"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-primary/80 !border-2 !border-background shadow-xs pointer-events-auto"
      />

      {/* Header with Icon, Status Dot, and Health Indicator */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className={cn("relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border shadow-xs", layerConfig.bg)}>
            {layerConfig.icon}
            <span className={cn("absolute -top-0.5 -right-0.5 inline-flex rounded-full h-2 w-2 ring-2 ring-card", pulseColor)} />
          </div>

          <div className="overflow-hidden">
            <h4 className="font-heading font-semibold text-xs truncate leading-tight text-foreground" title={nodeData.label}>
              {nodeData.label}
            </h4>
            <span className={cn("text-[10px] uppercase tracking-wider font-mono font-semibold", layerConfig.labelColor)}>
              {nodeData.type}
            </span>
          </div>
        </div>

        {/* Status Badges */}
        {isCritical && (
          <Badge variant="destructive" className="px-1.5 py-0 text-[10px] flex items-center gap-1 font-semibold animate-pulse">
            <AlertTriangle className="h-3 w-3" /> FAULT
          </Badge>
        )}
        {isHealing && (
          <Badge variant="secondary" className="px-1.5 py-0 text-[10px] flex items-center gap-1 font-semibold text-sky-400 bg-sky-950/60 border-sky-800">
            <RefreshCw className="h-3 w-3 animate-spin" /> HEAL
          </Badge>
        )}
        {isSimulatedRisk && (
          <Badge variant="secondary" className="px-1.5 py-0 text-[10px] flex items-center gap-1 font-semibold text-purple-300 bg-purple-950/60 border-purple-800">
            RISK {nodeData.impactWeight ? `(${Math.round(nodeData.impactWeight * 100)}%)` : ''}
          </Badge>
        )}
        {isHealthy && !isSimulatedRisk && (
          <div className="flex items-center text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Metrics Row with Live Telemetry */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px]">
        <div className="flex flex-col">
          <span className="text-[9px] text-muted-foreground font-mono">LATENCY (P99)</span>
          <span className={cn(
            "font-mono font-semibold",
            (nodeData.responseTimeMs ?? 0) > 500 ? "text-destructive font-bold animate-pulse" : "text-foreground"
          )}>
            {nodeData.responseTimeMs ? `${nodeData.responseTimeMs}ms` : '—'}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[9px] text-muted-foreground font-mono">ERROR RATE</span>
          <span className={cn(
            "font-mono font-semibold",
            (nodeData.errorRate ?? 0) > 0.05 ? "text-destructive font-bold animate-pulse" : "text-foreground"
          )}>
            {nodeData.errorRate !== undefined ? `${(nodeData.errorRate * 100).toFixed(1)}%` : '0.0%'}
          </span>
        </div>
      </div>
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
