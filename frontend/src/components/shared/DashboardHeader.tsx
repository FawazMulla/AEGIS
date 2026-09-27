import React from 'react';
import { Shield, Sparkles, Radio, Zap, LayoutDashboard, Network, SplitSquareVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useHealingStore } from '@/stores/useHealingStore';
import { cn } from '@/lib/utils';

export type MainPageView = 'dashboard' | 'graph' | 'studio';

export interface DashboardHeaderProps {
  currentView: MainPageView;
  onViewChange: (view: MainPageView) => void;
  activeMode: 'simulation' | 'healing';
  onModeChange: (mode: 'simulation' | 'healing') => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentView,
  onViewChange,
  activeMode,
  onModeChange,
}) => {
  const { isAutoPilotEnabled, toggleAutoPilot } = useHealingStore();

  const navigationTabs: Array<{ id: MainPageView; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
    { id: 'graph', label: 'Topology Graph', icon: <Network className="h-3.5 w-3.5" /> },
    { id: 'studio', label: 'Interactive Studio', icon: <SplitSquareVertical className="h-3.5 w-3.5" /> },
  ];

  return (
    <header className="w-full bg-card/90 backdrop-blur-md border-b border-border sticky top-0 z-40 px-4 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Main Primary Navigation */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-cyan-500 to-tertiary shadow-md glow-cyan">
              <Shield className="h-4 w-4 text-background font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-heading text-base sm:text-lg font-bold tracking-tight text-foreground">
                  AEGIS
                </h1>
                <Badge variant="secondary" className="text-[9px] font-mono font-bold bg-primary/10 text-primary border-primary/30 py-0">
                  v2.0
                </Badge>
              </div>
            </div>
          </div>

          {/* Primary View Navigation Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-muted/80 border border-border">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onViewChange(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 text-xs font-heading font-bold rounded-lg transition-all active:scale-95",
                  currentView === tab.id
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Section: Mode Switcher, OCI Badge, Autopilot */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {/* Sub-mode selector (when on studio) */}
          {currentView === 'studio' && (
            <div className="flex items-center p-0.5 rounded-lg bg-muted/60 border border-border/80 text-xs">
              <button
                onClick={() => onModeChange('simulation')}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-heading font-semibold transition-all",
                  activeMode === 'simulation'
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sparkles className="h-3 w-3" />
                <span>Pre-Deploy</span>
              </button>

              <button
                onClick={() => onModeChange('healing')}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-heading font-semibold transition-all",
                  activeMode === 'healing'
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Zap className="h-3 w-3" />
                <span>Self-Healing</span>
              </button>
            </div>
          )}

          {/* OCI Provider Status Badge */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 border border-border text-[10px] font-mono">
            <Radio className="h-2.5 w-2.5 text-emerald-400 animate-pulse" />
            <span className="font-semibold text-foreground">Cohere Command R+ (OCI)</span>
          </div>

          {/* Autopilot Switch */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-muted/40 border border-border/70">
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-muted-foreground font-semibold">AUTOPILOT</span>
              <span className={cn("text-[10px] font-mono font-bold", isAutoPilotEnabled ? "text-emerald-400" : "text-amber-400")}>
                {isAutoPilotEnabled ? 'AUTO' : 'HITL'}
              </span>
            </div>
            <Switch
              checked={isAutoPilotEnabled}
              onCheckedChange={toggleAutoPilot}
              aria-label="Toggle autonomous healing autopilot mode"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
