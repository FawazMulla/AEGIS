import React, { useState } from 'react';
import { DashboardHeader } from '@/components/shared/DashboardHeader';
import { KPIBar } from '@/components/shared/KPIBar';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { PreShipPanel } from '@/components/simulation/PreShipPanel';
import { PostDeployPanel } from '@/components/healing/PostDeployPanel';

export const Page: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'simulation' | 'healing'>('simulation');

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      {/* 1. Header */}
      <DashboardHeader activeMode={activeMode} onModeChange={setActiveMode} />

      {/* 2. Mission Control KPI Bar */}
      <KPIBar />

      {/* 3. Main Topology & Intelligence Work Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-4 overflow-hidden">
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
      </main>
    </div>
  );
};
