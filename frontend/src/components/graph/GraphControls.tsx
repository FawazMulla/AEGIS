import React from 'react';
import { Search, RotateCcw, Layers } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGraphStore } from '@/stores/useGraphStore';
import { GraphLayer } from '@/types/graph';
import { cn } from '@/lib/utils';

export const GraphControls: React.FC = () => {
  const {
    activeLayerFilter,
    setLayerFilter,
    searchQuery,
    setSearchQuery,
    resetGraphToHealthy,
    nodes,
    edges,
  } = useGraphStore();

  const layers: Array<{ id: GraphLayer | 'all'; label: string }> = [
    { id: 'all', label: 'All Layers' },
    { id: 'gateway', label: 'Gateway' },
    { id: 'services', label: 'Microservices' },
    { id: 'databases', label: 'Databases & Queues' },
    { id: 'cloud', label: 'OCI Cloud' },
  ];

  const healthyCount = nodes.filter((n) => n.data.status === 'healthy').length;
  const abnormalCount = nodes.length - healthyCount;

  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
      {/* Search and Filters Container */}
      <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-card/90 backdrop-blur-md p-2 rounded-2xl border border-border shadow-lg">
        <div className="relative w-48 sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search 54 nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-background/80"
          />
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-1 border-l border-border/80 pl-2">
          <Layers className="h-3.5 w-3.5 text-muted-foreground hidden sm:block me-1" />
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setLayerFilter(layer.id)}
              className={cn(
                "px-2.5 py-1 text-[11px] font-heading font-semibold rounded-lg transition-all active:scale-95",
                activeLayerFilter === layer.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status & Reset Action */}
      <div className="flex items-center gap-2 pointer-events-auto bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-border shadow-lg">
        <Badge variant={abnormalCount > 0 ? "destructive" : "secondary"} className="text-xs">
          {abnormalCount > 0 ? `${abnormalCount} Degraded` : `${healthyCount}/${nodes.length} Nodes Healthy`}
        </Badge>
        
        <span className="text-[11px] text-muted-foreground hidden sm:inline">
          {edges.length} Edges
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={resetGraphToHealthy}
          className="h-7 px-2 text-xs flex items-center gap-1"
          title="Reset graph health and highlights"
        >
          <RotateCcw className="h-3 w-3" />
          <span className="hidden md:inline">Reset</span>
        </Button>
      </div>
    </div>
  );
};
