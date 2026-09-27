import React from 'react';
import { Shield, Sparkles, Radio, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useHealingStore } from '@/stores/useHealingStore';

export interface DashboardHeaderProps {
  activeMode: 'simulation' | 'healing';
  onModeChange: (mode: 'simulation' | 'healing') => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeMode,
  onModeChange,
}) => {
  const { isAutoPilotEnabled, toggleAutoPilot } = useHealingStore();

  return (
    <header className="w-full bg-card/90 backdrop-blur-md border-b border-border sticky top-0 z-40 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-cyan-500 to-tertiary shadow-md glow-cyan">
              <Shield className="h-5 w-5 text-background font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  AEGIS
                </h1>
                <Badge variant="secondary" className="text-[10px] font-mono font-bold bg-primary/10 text-primary border-primary/30">
                  v2.0 PROTOTYPE
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Autonomous Engineering Graph & Intelligence System
              </p>
            </div>
          </div>

          {/* OCI Provider Status Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 border border-border text-[11px] font-mono">
            <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
            <span className="text-muted-foreground hidden lg:inline">AI Engine:</span>
            <span className="font-semibold text-foreground">Cohere Command R+ (OCI)</span>
          </div>
        </div>

        {/* Mode Switcher & Autopilot Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Dual-Mode Selector */}
          <div className="flex items-center p-1 rounded-xl bg-muted/80 border border-border">
            <button
              onClick={() => onModeChange('simulation')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all active:scale-95 ${
                activeMode === 'simulation'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-tertiary" />
              <span>Pre-Deploy Guard</span>
            </button>

            <button
              onClick={() => onModeChange('healing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all active:scale-95 ${
                activeMode === 'healing'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span>Self-Healing Loop</span>
            </button>
          </div>

          {/* Autopilot Switch */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/40 border border-border/70">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-muted-foreground font-semibold">AUTOPILOT</span>
              <span className={`text-[11px] font-mono font-bold ${isAutoPilotEnabled ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isAutoPilotEnabled ? 'AUTO-HEAL' : 'HITL'}
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
