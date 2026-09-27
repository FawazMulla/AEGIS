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
  const protocol = edgeData?.protocol?.toUpperCase() || 'HTTP';
  const edgeType = edgeData?.type || 'CALLS';

  // Dynamic colors based on protocol and state
  const getEdgeStyle = () => {
    if (isDegraded) {
      return {
        stroke: "!stroke-destructive !stroke-[2.5px] stroke-dasharray-4",
        color: '#f43f5e',
        speed: '1.2s',
      };
    }
    if (isImpacted) {
      return {
        stroke: "!stroke-purple-500 !stroke-[2.5px] stroke-dasharray-4",
        color: '#c084fc',
        speed: '1.5s',
      };
    }
    if (edgeType === 'DEPENDS_ON' || protocol === 'DATABASE' || protocol === 'KAFKA') {
      return {
        stroke: "!stroke-amber-500/60 hover:!stroke-amber-400 !stroke-[2px] stroke-dasharray-2",
        color: '#fbbf24',
        speed: '2.8s',
      };
    }
    if (protocol === 'GRPC') {
      return {
        stroke: "!stroke-indigo-500/60 hover:!stroke-indigo-400 !stroke-[1.8px]",
        color: '#818cf8',
        speed: '2.2s',
      };
    }
    return {
      stroke: "!stroke-sky-500/50 hover:!stroke-sky-400 !stroke-[1.8px]",
      color: '#38bdf8',
      speed: '2.5s',
    };
  };

  const styleConfig = getEdgeStyle();
  const beatColor = styleConfig.color;
  const beatSpeed = styleConfig.speed;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        className={cn(
          "transition-all duration-300",
          styleConfig.stroke,
          selected && "!stroke-primary !stroke-[3px]"
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
