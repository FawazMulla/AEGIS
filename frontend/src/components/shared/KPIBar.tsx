import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timer, Zap, AlertTriangle, Network, ShieldCheck } from 'lucide-react';
import { useHealingStore } from '@/stores/useHealingStore';

export const KPIBar: React.FC = () => {
  const { kpis } = useHealingStore();

  const metrics = [
    {
      id: 'mttd',
      label: 'MTTD (Detection)',
      value: `${kpis.mttdSeconds}s`,
      target: 'Target: < 5s',
      status: kpis.mttdSeconds < 5 ? 'success' : 'warning',
      icon: <Timer className="h-4 w-4 text-sky-400" />,
      subtext: 'eBPF real-time probe',
    },
    {
      id: 'mttr',
      label: 'MTTR (Remediation)',
      value: `${kpis.mttrSeconds}s`,
      target: 'Target: < 45s',
      status: kpis.mttrSeconds < 45 ? 'success' : 'warning',
      icon: <Zap className="h-4 w-4 text-emerald-400" />,
      subtext: '8-step autonomous loop',
    },
    {
      id: 'cfr',
      label: 'Change Failure Rate',
      value: `${kpis.changeFailureRatePercent}%`,
      target: 'Industry Avg: 15%',
      status: 'success',
      icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
      subtext: 'Pre-ship guard prevented',
    },
    {
      id: 'graph-latency',
      label: 'Graph Causal Latency',
      value: `${kpis.graphQueryLatencyMs}ms`,
      target: 'Target: < 12ms',
      status: 'success',
      icon: <Network className="h-4 w-4 text-purple-400" />,
      subtext: '54 nodes • 142 edges',
    },
    {
      id: 'heal-rate',
      label: 'Autopilot Success',
      value: `${kpis.autonomousHealSuccessRate}%`,
      target: `${kpis.totalIncidentsHealed} Healed`,
      status: 'success',
      icon: <ShieldCheck className="h-4 w-4 text-primary" />,
      subtext: 'Zero-downtime fixes',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {metrics.map((m) => (
          <Card
            key={m.id}
            className="p-3 bg-card/75 backdrop-blur-md border-border hover:border-primary/50 transition-colors shadow-xs"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-heading font-semibold text-muted-foreground truncate">
                {m.label}
              </span>
              <div className="p-1 rounded-lg bg-muted/70">{m.icon}</div>
            </div>

            <div className="flex items-baseline justify-between gap-1">
              <span className="font-mono text-base sm:text-lg font-bold text-foreground">
                {m.value}
              </span>
              <Badge
                variant={m.status === 'success' ? 'default' : 'destructive'}
                className="text-[9px] px-1.5 py-0 font-mono"
              >
                {m.target}
              </Badge>
            </div>

            <p className="text-[10px] text-muted-foreground/80 mt-1 truncate">
              {m.subtext}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};
