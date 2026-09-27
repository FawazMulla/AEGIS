import { Shield, Sparkles, Zap, LayoutDashboard, Network, SplitSquareVertical } from 'lucide-react';
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

  const navigationTabs: Array<{
    id: MainPageView;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      id: 'graph',
      label: 'Topology Graph',
      icon: <Network className="h-4 w-4" />,
    },
    {
      id: 'studio',
      label: 'Interactive Studio',
      icon: <SplitSquareVertical className="h-4 w-4" />,
    },
  ];

  return (
    <header className="w-full bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-40 px-4 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Main Primary Navigation */}
        <div className="flex flex-wrap items-center gap-5 w-full md:w-auto justify-between md:justify-start">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => onViewChange('dashboard')}>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background shadow-xs">
              <Shield className="h-3.5 w-3.5 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-heading text-sm sm:text-base font-bold tracking-tight text-foreground">
                  AEGIS
                </h1>
                <span className="text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.2 rounded">
                  v2.0
                </span>
              </div>
            </div>
          </div>

          {/* Primary View Navigation Tabs */}
          <nav aria-label="Main Navigation" className="flex items-center p-1 rounded-lg bg-card border border-border gap-1">
            {navigationTabs.map((tab) => {
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onViewChange(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-xs font-heading rounded-md transition-colors select-none",
                    isActive
                      ? "bg-secondary text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 font-medium"
                  )}
                >
                  <span className={cn(isActive ? "text-foreground" : "text-muted-foreground")}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Mode Switcher & Autonomous Healing Switch */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {/* Sub-mode selector (when on studio) */}
          {currentView === 'studio' && (
            <div className="flex items-center p-0.5 rounded-lg bg-card border border-border text-xs">
              <button
                onClick={() => onModeChange('simulation')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-heading font-medium transition-colors",
                  activeMode === 'simulation'
                    ? "bg-secondary text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sparkles className="h-3 w-3" />
                <span>Pre-Deploy</span>
              </button>

              <button
                onClick={() => onModeChange('healing')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-heading font-medium transition-colors",
                  activeMode === 'healing'
                    ? "bg-secondary text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Zap className="h-3 w-3" />
                <span>Self-Healing</span>
              </button>
            </div>
          )}

          {/* Autonomous Healing Switch */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-card border border-border">
            <span className="text-xs text-muted-foreground font-medium select-none">
              Autonomous Healing
            </span>
            <Switch
              checked={isAutoPilotEnabled}
              onCheckedChange={toggleAutoPilot}
              aria-label="Toggle autonomous healing mode"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
