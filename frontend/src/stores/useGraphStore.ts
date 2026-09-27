import { create } from 'zustand';
import { Node, Edge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from '@xyflow/react';
import { GraphNodeData, GraphEdgeData, GraphLayer, NodeHealthStatus } from '@/types/graph';
import rawSeedGraph from '@/lib/mock/seedGraph.json';

export interface GraphState {
  nodes: Node<GraphNodeData>[];
  edges: Edge<GraphEdgeData>[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  activeLayerFilter: GraphLayer | 'all';
  searchQuery: string;
  isSimulating: boolean;
  isHealing: boolean;
  highlightedNodeIds: Set<string>;
  rootCauseNodeId: string | null;

  // Actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  selectNode: (nodeId: string | null) => void;
  selectEdge: (edgeId: string | null) => void;
  setLayerFilter: (layer: GraphLayer | 'all') => void;
  setSearchQuery: (query: string) => void;
  updateNodeStatus: (nodeId: string, status: NodeHealthStatus, telemetry?: Partial<GraphNodeData>) => void;
  setBlastRadiusHighlights: (impactedNodeIds: Array<{ nodeId: string; impactWeight: number; depth: number }>) => void;
  setRootCause: (nodeId: string | null) => void;
  resetGraphToHealthy: () => void;
  setNodesAndEdges: (nodes: Node<GraphNodeData>[], edges: Edge<GraphEdgeData>[]) => void;
}

const initialNodes: Node<GraphNodeData>[] = (rawSeedGraph.nodes as unknown as Node<GraphNodeData>[]).map((node) => ({
  ...node,
  type: 'custom',
}));

const initialEdges: Edge<GraphEdgeData>[] = (rawSeedGraph.edges as unknown as Edge<GraphEdgeData>[]).map((edge) => ({
  ...edge,
  type: 'custom',
  animated: false,
}));

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  selectedEdgeId: null,
  activeLayerFilter: 'all',
  searchQuery: '',
  isSimulating: false,
  isHealing: false,
  highlightedNodeIds: new Set(),
  rootCauseNodeId: null,

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as Node<GraphNodeData>[],
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges) as Edge<GraphEdgeData>[],
    });
  },

  selectNode: (nodeId: string | null) => {
    set({ selectedNodeId: nodeId, selectedEdgeId: null });
  },

  selectEdge: (edgeId: string | null) => {
    set({ selectedEdgeId: edgeId, selectedNodeId: null });
  },

  setLayerFilter: (layer: GraphLayer | 'all') => {
    set({ activeLayerFilter: layer });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  updateNodeStatus: (nodeId: string, status: NodeHealthStatus, telemetry?: Partial<GraphNodeData>) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              status,
              ...telemetry,
            },
          };
        }
        return node;
      }),
    });
  },

  setBlastRadiusHighlights: (impactedNodeIds) => {
    const impactedMap = new Map(impactedNodeIds.map((item) => [item.nodeId, item]));
    const idSet = new Set(impactedNodeIds.map((item) => item.nodeId));

    set({
      highlightedNodeIds: idSet,
      isSimulating: true,
      nodes: get().nodes.map((node) => {
        const impactInfo = impactedMap.get(node.id);
        if (impactInfo) {
          return {
            ...node,
            data: {
              ...node.data,
              status: 'simulated-risk',
              isBlastRadius: true,
              impactWeight: impactInfo.impactWeight,
              depth: impactInfo.depth,
            },
          };
        }
        return {
          ...node,
          data: {
            ...node.data,
            isBlastRadius: false,
            impactWeight: undefined,
            depth: undefined,
          },
        };
      }),
      edges: get().edges.map((edge) => {
        const isImpacted = idSet.has(edge.source) && idSet.has(edge.target);
        return {
          ...edge,
          animated: isImpacted,
          data: {
            ...edge.data,
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.data?.type || 'CALLS',
            isImpacted,
          },
        };
      }),
    });
  },

  setRootCause: (nodeId: string | null) => {
    set({
      rootCauseNodeId: nodeId,
      nodes: get().nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isRootCause: node.id === nodeId,
        },
      })),
    });
  },

  resetGraphToHealthy: () => {
    set({
      isSimulating: false,
      isHealing: false,
      highlightedNodeIds: new Set(),
      rootCauseNodeId: null,
      nodes: initialNodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          status: 'healthy',
          isBlastRadius: false,
          isRootCause: false,
          impactWeight: undefined,
          depth: undefined,
        },
      })),
      edges: initialEdges.map((e) => ({
        ...e,
        animated: false,
        data: {
          ...e.data,
          id: e.id,
          source: e.source,
          target: e.target,
          type: e.data?.type || 'CALLS',
          isImpacted: false,
          isDegraded: false,
        },
      })),
    });
  },

  setNodesAndEdges: (nodes, edges) => {
    set({ nodes, edges });
  },
}));
