import { memo, useId } from 'react';
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
  const uniqueId = useId().replace(/:/g, '-');
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

  // Dynamic beat colors based on state
  const beatColor = isDegraded
    ? '#f43f5e' // Crimson red for degraded / chaos
    : isImpacted
    ? '#c084fc' // Electric purple for blast radius simulation
    : '#22d3ee'; // Cyber cyan for normal healthy live flow

  const beatSpeed = isDegraded ? "1.2s" : isImpacted ? "1.6s" : "2.5s";

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        className={cn(
          "transition-all duration-300",
          isImpacted
            ? "!stroke-purple-500/80 !stroke-[2px] stroke-dasharray-4"
            : isDegraded
            ? "!stroke-destructive !stroke-[2px] stroke-dasharray-4"
            : "!stroke-cyan-500/30 hover:!stroke-cyan-400 !stroke-[1.5px]",
          selected && "!stroke-primary !stroke-[2.5px]"
        )}
      />

      {/* SVG Filters for Beat Glow */}
      <defs>
        <filter id={`beat-glow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Primary Live Beat Particle (Forward Stream) */}
      <circle
        r="4"
        fill={beatColor}
        filter={`url(#beat-glow-${uniqueId})`}
        className="pointer-events-none"
      >
        <animateMotion
          dur={beatSpeed}
          repeatCount="indefinite"
          path={edgePath}
          rotate="auto"
        />
      </circle>

      {/* Secondary Staggered Beat Particle (Continuous Stream Wave) */}
      <circle
        r="2.5"
        fill={beatColor}
        opacity="0.8"
        filter={`url(#beat-glow-${uniqueId})`}
        className="pointer-events-none"
      >
        <animateMotion
          dur={beatSpeed}
          begin={`-${parseFloat(beatSpeed) / 2}s`}
          repeatCount="indefinite"
          path={edgePath}
          rotate="auto"
        />
      </circle>

      {/* Protocol Label */}
      {edgeData?.protocol && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className={cn(
              "nodrag nopan rounded-md px-1.5 py-0.5 text-[9px] font-mono font-semibold border shadow-xs transition-colors backdrop-blur-xs",
              isImpacted
                ? "bg-purple-950/90 text-purple-200 border-purple-800"
                : isDegraded
                ? "bg-destructive/90 text-destructive-foreground border-destructive"
                : "bg-background/90 text-cyan-400/90 border-cyan-900/50 hover:text-cyan-300"
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
