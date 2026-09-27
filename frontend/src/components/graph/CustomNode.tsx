import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Shield, Server, Database, Cloud, AlertTriangle, CheckCircle2, RefreshCw, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GraphNodeData } from '@/types/graph';
import { Badge } from '@/components/ui/badge';

const getLayerIcon = (layer: string, type: string) => {
  if (layer === 'gateway') return <Radio className="h-4 w-4 text-cyan-400" />;
  if (layer === 'databases') return <Database className="h-4 w-4 text-amber-400" />;
  if (layer === 'cloud') return <Cloud className="h-4 w-4 text-purple-400" />;
  if (type === 'Microservice') return <Server className="h-4 w-4 text-sky-400" />;
  return <Shield className="h-4 w-4 text-cyan-400" />;
};

const getStatusBorderAndGlow = (status: string, isBlastRadius?: boolean, isRootCause?: boolean) => {
  if (isRootCause) {
    return 'border-destructive ring-2 ring-destructive ring-offset-2 ring-offset-background animate-pulse glow-red shadow-[0_0_25px_rgba(244,63,94,0.4)]';
  }
  if (status === 'critical') {
    return 'border-destructive ring-1 ring-destructive glow-red shadow-[0_0_20px_rgba(244,63,94,0.3)]';
  }
  if (status === 'warning') {
    return 'border-warning ring-1 ring-warning shadow-[0_0_15px_rgba(245,158,11,0.25)]';
  }
  if (status === 'healing') {
    return 'border-primary ring-2 ring-primary animate-pulse glow-cyan shadow-[0_0_25px_rgba(6,182,212,0.4)]';
  }
  if (status === 'simulated-risk' || isBlastRadius) {
    return 'border-tertiary ring-1 ring-tertiary glow-purple shadow-[0_0_20px_rgba(192,132,252,0.35)]';
  }
  return 'border-border/80 hover:border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_22px_rgba(6,182,212,0.25)]';
};

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as GraphNodeData;
  const isHealthy = nodeData.status === 'healthy';
  const isCritical = nodeData.status === 'critical' || nodeData.isRootCause;
  const isSimulatedRisk = nodeData.status === 'simulated-risk' || nodeData.isBlastRadius;
  const isHealing = nodeData.status === 'healing';

  const pulseColor = isCritical
    ? 'bg-destructive'
    : isSimulatedRisk
    ? 'bg-purple-400'
    : isHealing
    ? 'bg-primary'
    : 'bg-cyan-400';

  return (
    <div
      className={cn(
        "relative rounded-2xl bg-card/95 p-3.5 shadow-md border transition-all duration-300 min-w-[210px] max-w-[245px] select-none cursor-pointer",
        getStatusBorderAndGlow(nodeData.status, nodeData.isBlastRadius, nodeData.isRootCause),
        selected && "ring-2 ring-primary shadow-xl scale-105",
        "backdrop-blur-md"
      )}
    >
      {/* 1. Ingress / Egress Live Beat Handle Halo Rings */}
      {/* Top Handle with Ingress Beat Ping */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
        <span className={cn("animate-ping absolute h-3.5 w-3.5 rounded-full opacity-60", pulseColor)} />
        <Handle
          type="target"
          position={Position.Top}
          className="!relative !left-0 !top-0 !translate-x-0 !translate-y-0 !w-2.5 !h-2.5 !bg-cyan-400 !border-2 !border-background shadow-xs pointer-events-auto"
        />
      </div>

      {/* Bottom Handle with Egress Beat Ping */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
        <span className={cn("animate-ping absolute h-3.5 w-3.5 rounded-full opacity-60", pulseColor)} style={{ animationDelay: '0.6s' }} />
        <Handle
          type="source"
          position={Position.Bottom}
          className="!relative !left-0 !top-0 !translate-x-0 !translate-y-0 !w-2.5 !h-2.5 !bg-cyan-400 !border-2 !border-background shadow-xs pointer-events-auto"
        />
      </div>

      {/* Left Handle */}
      <div className="absolute top-1/2 -left-1 -translate-y-1/2 flex items-center justify-center pointer-events-none">
        <span className={cn("animate-ping absolute h-3 w-3 rounded-full opacity-40", pulseColor)} style={{ animationDelay: '0.3s' }} />
        <Handle
          type="target"
          position={Position.Left}
          className="!relative !left-0 !top-0 !translate-x-0 !translate-y-0 !w-2 !h-2 !bg-cyan-400 !border-2 !border-background shadow-xs pointer-events-auto"
        />
      </div>

      {/* Right Handle */}
      <div className="absolute top-1/2 -right-1 -translate-y-1/2 flex items-center justify-center pointer-events-none">
        <span className={cn("animate-ping absolute h-3 w-3 rounded-full opacity-40", pulseColor)} style={{ animationDelay: '0.9s' }} />
        <Handle
          type="source"
          position={Position.Right}
          className="!relative !left-0 !top-0 !translate-x-0 !translate-y-0 !w-2 !h-2 !bg-cyan-400 !border-2 !border-background shadow-xs pointer-events-auto"
        />
      </div>

      {/* Header with Icon, Live Beat Dot, and Health Indicator */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/80 border border-border">
            {getLayerIcon(nodeData.layer, nodeData.type)}
            {/* Live active traffic heartbeat dot */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", pulseColor)} />
              <span className={cn("relative inline-flex rounded-full h-2 w-2", pulseColor)} />
            </span>
          </div>

          <div className="overflow-hidden">
            <h4 className="font-heading font-bold text-xs truncate leading-tight text-foreground" title={nodeData.label}>
              {nodeData.label}
            </h4>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
              {nodeData.type}
            </span>
          </div>
        </div>

        {/* Status Badges */}
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

      {/* Metrics Row with Live Telemetry */}
      <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-border/50 text-[11px]">
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
