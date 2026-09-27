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
import { NodeDetailModal } from './NodeDetailModal';
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

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-border bg-card/60 backdrop-blur-md shadow-lg">
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
        minZoom={0.2}
        maxZoom={2.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
        className="touch-none"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.2}
          color="hsl(var(--muted-foreground) / 0.15)"
        />
        <Controls
          className="!bg-card/90 !border-border !rounded-xl !shadow-md [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground"
        />
        <MiniMap
          nodeColor={(n) => {
            const status = (n.data as unknown as GraphNodeData)?.status;
            if (status === 'critical') return 'hsl(var(--destructive))';
            if (status === 'simulated-risk') return 'hsl(var(--tertiary))';
            if (status === 'healing') return 'hsl(var(--primary))';
            return 'hsl(var(--success))';
          }}
          maskColor="hsl(var(--background) / 0.8)"
          className="!bg-card/90 !border-border !rounded-xl !shadow-md !overflow-hidden hidden sm:block"
        />
      </ReactFlow>

      <NodeDetailModal />
    </div>
  );
};
