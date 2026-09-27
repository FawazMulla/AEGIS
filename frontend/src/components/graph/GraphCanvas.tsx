import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Node,
  NodeMouseHandler,
  NodeTypes,
  EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useGraphStore } from '@/stores/useGraphStore';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge';
import { GraphControls } from './GraphControls';
import { GraphNodeData } from '@/types/graph';

export const GraphCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    selectNode,
    activeLayerFilter,
    searchQuery,
  } = useGraphStore();

  const nodeTypes: NodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  const edgeTypes: EdgeTypes = useMemo(() => ({ custom: CustomEdge }), []);

  const filteredNodes = useMemo(() => {
    return nodes.map((node) => {
      const data = node.data;
      const matchesLayer = activeLayerFilter === 'all' || data.layer === activeLayerFilter;
      const matchesSearch =
        !searchQuery ||
        data.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        data.id.toLowerCase().includes(searchQuery.toLowerCase());

      const isVisible = matchesLayer && matchesSearch;

      return {
        ...node,
        hidden: !isVisible,
      };
    });
  }, [nodes, activeLayerFilter, searchQuery]);

  const onNodeClick: NodeMouseHandler<Node<GraphNodeData>> = useCallback(
    (_, node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const getNodeMiniMapColor = useCallback((n: Node) => {
    const data = n.data as unknown as GraphNodeData;
    if (!data) return '#3b82f6';
    if (data.isRootCause || data.status === 'critical') return '#f43f5e';
    if (data.status === 'healing') return '#3b82f6';
    if (data.isBlastRadius || data.status === 'simulated-risk') return '#818cf8';
    return '#10b981';
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-lg overflow-hidden border border-border bg-card/40 backdrop-blur-sm shadow-sm">
      <GraphControls />

      <ReactFlow
        nodes={filteredNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{
          padding: 0.18,
          minZoom: 0.5,
          maxZoom: 1.4,
        }}
        minZoom={0.25}
        maxZoom={2.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
        className="touch-none"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={28}
          size={1}
          color="hsl(var(--muted-foreground) / 0.12)"
        />
        <Controls
          className="!bg-card !border-border !rounded-md !shadow-sm [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground"
        />
        <div className="absolute bottom-3 right-3 z-10 hidden sm:flex flex-col items-end pointer-events-none">
          {/* Radar HUD Header Badge */}
          <div className="mb-1.5 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-card border border-border text-[9px] font-mono text-muted-foreground shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-foreground">TOPOLOGY RADAR</span>
            <span className="text-muted-foreground">54N</span>
          </div>

          <div className="pointer-events-auto">
            <MiniMap
              nodeColor={getNodeMiniMapColor}
              nodeStrokeColor="rgba(255, 255, 255, 0.25)"
              nodeStrokeWidth={1}
              nodeBorderRadius={4}
              zoomable
              pannable
              maskColor="hsl(var(--background) / 0.75)"
              className="!relative !bottom-0 !right-0 !m-0 !w-[180px] !h-[120px]"
            />
          </div>
        </div>
      </ReactFlow>
    </div>
  );
};
