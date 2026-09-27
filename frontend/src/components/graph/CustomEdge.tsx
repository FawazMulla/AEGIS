import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath } from '@xyflow/react';
import { GraphEdgeData } from '@/types/graph';
import { cn } from '@/lib/utils';

export const CustomEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) => {
  const edgeData = data as unknown as GraphEdgeData;
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const isImpacted = edgeData?.isImpacted;
  const isDegraded = edgeData?.isDegraded;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        className={cn(
          "transition-all duration-300",
          isImpacted
            ? "!stroke-tertiary !stroke-[2.5px] stroke-dasharray-4 animate-pulse"
            : isDegraded
            ? "!stroke-destructive !stroke-[2.5px] stroke-dasharray-4"
            : "!stroke-muted-foreground/30 hover:!stroke-primary/70 !stroke-[1.5px]",
          selected && "!stroke-primary !stroke-[3px]"
        )}
      />
      {edgeData?.protocol && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className={cn(
              "nodrag nopan rounded-md px-1.5 py-0.5 text-[9px] font-mono font-semibold border shadow-xs transition-colors",
              isImpacted
                ? "bg-purple-950 text-purple-200 border-purple-800"
                : isDegraded
                ? "bg-destructive/90 text-destructive-foreground border-destructive"
                : "bg-background/90 text-muted-foreground border-border/80 hover:text-foreground"
            )}
          >
            {edgeData.protocol} {edgeData.p99LatencyMs ? `• ${edgeData.p99LatencyMs}ms` : ''}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

CustomEdge.displayName = 'CustomEdge';
