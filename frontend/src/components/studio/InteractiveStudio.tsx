import React, { useState } from 'react';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { PreShipPanel } from '@/components/simulation/PreShipPanel';
import { PostDeployPanel } from '@/components/healing/PostDeployPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
  Zap,
  Columns,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InteractiveStudioProps {
  activeMode: 'simulation' | 'healing';
}

export type StudioLayoutMode = 'split' | 'floating' | 'canvas-only';

export const InteractiveStudio: React.FC<InteractiveStudioProps> = ({ activeMode }) => {
  const [layoutMode, setLayoutMode] = useState<StudioLayoutMode>('split');
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  return (
    <div className="relative w-full h-[calc(100vh-130px)] px-3 sm:px-6 pb-4 flex flex-col overflow-hidden">
      {/* Top Studio Toolbar with Layout Modes */}
      <div className="flex items-center justify-between py-1.5 mb-1.5">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-mono text-cyan-400 border-cyan-800/60 bg-cyan-950/20">
            INTERACTIVE GRAPH STUDIO
          </Badge>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {activeMode === 'simulation' ? 'Pre-Deployment Risk Guard Active' : 'Autonomous Self-Healing Loop Active'}
          </span>
        </div>

        {/* Layout Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 rounded-lg bg-muted/60 border border-border text-xs">
            <button
              onClick={() => {
                setLayoutMode('split');
                setIsPanelOpen(true);
              }}
              title="Wide Split View (70% Graph / 30% Panel)"
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-heading font-semibold transition-all",
                layoutMode === 'split' && isPanelOpen
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Columns className="h-3 w-3" />
              <span className="hidden md:inline">Split View</span>
            </button>

            <button
              onClick={() => {
                setLayoutMode('floating');
                setIsPanelOpen(true);
              }}
              title="Floating Dock View (100% Graph with Floating Intelligence Panel)"
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-heading font-semibold transition-all",
                layoutMode === 'floating' && isPanelOpen
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="h-3 w-3" />
              <span className="hidden md:inline">Floating Dock</span>
            </button>

            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              title={isPanelOpen ? "Collapse Intelligence Panel" : "Expand Intelligence Panel"}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-heading font-semibold transition-all",
                !isPanelOpen
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isPanelOpen ? <PanelRightClose className="h-3 w-3" /> : <PanelRightOpen className="h-3 w-3" />}
              <span className="hidden sm:inline">{isPanelOpen ? "Hide Panel" : "Open Panel"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="relative flex-1 w-full h-full rounded-2xl overflow-hidden border border-border shadow-xl">
        {/* Layout 1: Wide Split Mode (70% Graph / 30% Panel with clean wide proportions) */}
        {layoutMode === 'split' && isPanelOpen ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-full p-2 bg-background/50">
            {/* Expanded 8-column or 7.5-column Graph Canvas */}
            <div className="lg:col-span-8 h-full min-h-[450px]">
              <GraphCanvas />
            </div>

            {/* Compact 4-column Intelligence Panel */}
            <div className="lg:col-span-4 h-full overflow-hidden flex flex-col">
              {activeMode === 'simulation' ? <PreShipPanel /> : <PostDeployPanel />}
            </div>
          </div>
        ) : (
          /* Layout 2: 100% Full-Width Immersive Canvas with Floating Sliding Dock */
          <div className="relative w-full h-full">
            <GraphCanvas />

            {/* Floating Sliding Intelligence Drawer */}
            {isPanelOpen && (
              <div className="absolute top-3 right-3 bottom-3 z-30 w-[440px] max-w-[92vw] rounded-2xl bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl p-3.5 flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-300">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    {activeMode === 'simulation' ? (
                      <Sparkles className="h-4 w-4 text-tertiary" />
                    ) : (
                      <Zap className="h-4 w-4 text-primary" />
                    )}
                    <h3 className="font-heading font-bold text-xs sm:text-sm text-foreground">
                      {activeMode === 'simulation' ? 'Pre-Deployment Risk Guard' : 'Autonomous Self-Healing Loop'}
                    </h3>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPanelOpen(false)}
                    className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                    title="Collapse Dock"
                  >
                    <PanelRightClose className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto pr-1">
                  {activeMode === 'simulation' ? <PreShipPanel /> : <PostDeployPanel />}
                </div>
              </div>
            )}

            {/* Floating Quick Opener Button when dock is collapsed */}
            {!isPanelOpen && (
              <button
                onClick={() => setIsPanelOpen(true)}
                className="absolute top-4 right-4 z-30 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-xs shadow-xl glow-cyan hover:scale-105 active:scale-95 transition-all"
              >
                <PanelRightOpen className="h-4 w-4" />
                <span>Open {activeMode === 'simulation' ? 'Risk Guard' : 'Self-Healing'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
