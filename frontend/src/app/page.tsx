import React, { useState } from 'react';
import { DashboardHeader, MainPageView } from '@/components/shared/DashboardHeader';
import { KPIBar } from '@/components/shared/KPIBar';
import { OverviewDashboard } from '@/components/dashboard/OverviewDashboard';
import { FullGraphPage } from '@/components/graph/FullGraphPage';
import { InteractiveStudio } from '@/components/studio/InteractiveStudio';

export const Page: React.FC = () => {
  const [currentView, setCurrentView] = useState<MainPageView>('dashboard');
  const [activeMode, setActiveMode] = useState<'simulation' | 'healing'>('simulation');

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background text-foreground">
      {/* 1. Header with Primary View Navigation */}
      <DashboardHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        activeMode={activeMode}
        onModeChange={setActiveMode}
      />

      {/* 2. Mission Control KPI Bar (always visible across all views) */}
      <KPIBar />

      {/* 3. Dynamic Page View */}
      <div className="flex-1 overflow-hidden">
        {currentView === 'dashboard' && (
          <OverviewDashboard
            onNavigateToGraph={() => setCurrentView('graph')}
            onNavigateToStudio={(mode) => {
              if (mode) setActiveMode(mode);
              setCurrentView('studio');
            }}
          />
        )}

        {currentView === 'graph' && <FullGraphPage />}

        {currentView === 'studio' && (
          <InteractiveStudio activeMode={activeMode} />
        )}
      </div>
    </div>
  );
};
