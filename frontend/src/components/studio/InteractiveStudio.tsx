import React from 'react';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { PreShipPanel } from '@/components/simulation/PreShipPanel';
import { PostDeployPanel } from '@/components/healing/PostDeployPanel';

export interface InteractiveStudioProps {
  activeMode: 'simulation' | 'healing';
}

export const InteractiveStudio: React.FC<InteractiveStudioProps> = ({ activeMode }) => {
  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-4 overflow-hidden h-[calc(100vh-130px)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
        {/* Left Column: Knowledge Graph Topology Canvas (7 cols) */}
        <div className="lg:col-span-7 h-full min-h-[450px]">
          <GraphCanvas />
        </div>

        {/* Right Column: Dual-Mode Intelligence Panel (5 cols) */}
        <div className="lg:col-span-5 h-full overflow-hidden">
          {activeMode === 'simulation' ? <PreShipPanel /> : <PostDeployPanel />}
        </div>
      </div>
    </div>
  );
};
