import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGraphStore } from '@/stores/useGraphStore';
import { useHealingStore } from '@/stores/useHealingStore';
import { useSimulationStore } from '@/stores/useSimulationStore';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Server,
  Activity,
  Zap,
  Sparkles,
  ShieldCheck,
  Flame,
  ArrowUpRight,
  Database,
  Cloud,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Sample time-series latency & incident telemetry data
const telemetryTrendData = [
  { time: '14:00', p99: 38, p50: 16, threshold: 200 },
  { time: '14:15', p99: 42, p50: 18, threshold: 200 },
  { time: '14:30', p99: 45, p50: 17, threshold: 200 },
  { time: '14:45', p99: 3420, p50: 890, threshold: 200 },
  { time: '15:00', p99: 180, p50: 45, threshold: 200 },
  { time: '15:15', p99: 39, p50: 15, threshold: 200 },
  { time: '15:30', p99: 36, p50: 14, threshold: 200 },
  { time: '15:45', p99: 40, p50: 16, threshold: 200 },
  { time: '16:00', p99: 37, p50: 15, threshold: 200 },
];

const mttrComparisonData = [
  { metric: 'Manual SRE Ops', time: 2700, fill: '#475569' },
  { metric: 'Rule-Based Runbooks', time: 720, fill: '#64748b' },
  { metric: 'AEGIS Autopilot', time: 38, fill: '#3b82f6' },
];

const incidentDistribution = [
  { name: 'DB Pool Exhaustion', value: 42, color: '#3b82f6' },
  { name: 'Breaking API Contract', value: 28, color: '#818cf8' },
  { name: 'Pod Memory Pressure', value: 18, color: '#64748b' },
  { name: 'Network Partition', value: 12, color: '#475569' },
];

export interface OverviewDashboardProps {
  onNavigateToGraph: () => void;
  onNavigateToStudio: (mode?: 'simulation' | 'healing') => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigateToGraph,
  onNavigateToStudio,
}) => {
  const { nodes, selectNode } = useGraphStore();
  const { kpis, injectChaos } = useHealingStore();
  const { runSimulation } = useSimulationStore();
  const [selectedLayer, setSelectedLayer] = useState<string>('all');

  const healthyNodesCount = nodes.filter((n) => n.data.status === 'healthy').length;
  const filteredNodes = nodes.filter(
    (n) => selectedLayer === 'all' || n.data.layer === selectedLayer
  );

  const handleQuickChaos = async () => {
    toast.error("Triggering quick chaos test on payment-service...");
    await injectChaos({
      targetServiceId: 'payment-service',
      chaosType: 'LATENCY_SPIKE',
      intensityPercent: 85,
      durationSeconds: 60,
    });
    onNavigateToStudio('healing');
  };

  const handleQuickSim = async () => {
    toast.success("Running pre-ship risk analysis on PR-1082...");
    await runSimulation();
    onNavigateToStudio('simulation');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-6 overflow-y-auto pb-12">
      {/* 1. Executive Summary & Status Hero */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-lg bg-card border border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Mission Control Overview
            </h2>
            <Badge variant="secondary" className="text-[10px] font-mono">
              54 Nodes Monitored
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl">
            Real-time telemetry and graph reasoning across 54 microservices, databases, and infrastructure dependencies.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleQuickSim}
            size="sm"
            className="h-8 px-3 text-xs font-heading font-semibold"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Test Pre-Ship PR
          </Button>

          <Button
            onClick={handleQuickChaos}
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs font-heading font-semibold"
          >
            <Flame className="h-3.5 w-3.5 mr-1.5" />
            Inject Chaos Fault
          </Button>

          <Button
            onClick={onNavigateToGraph}
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs font-heading font-semibold"
          >
            View Topology
            <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {/* 2. Primary Telemetry Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Latency & Anomaly Signal Trend (7 cols) */}
        <Card className="lg:col-span-7 bg-card border border-border rounded-lg shadow-sm p-4">
          <CardHeader className="p-0 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span>Real-Time P99 Latency & Anomaly Signal (ms)</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Telemetry stream showing baseline vs spike anomaly vs automated rollback recovery
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                P99 vs P50
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="p99Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="p99"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#p99Grad)"
                  name="P99 Latency (ms)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* MTTR Benchmark Comparison (5 cols) */}
        <Card className="lg:col-span-5 bg-card border border-border rounded-lg shadow-sm p-4">
          <CardHeader className="p-0 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>MTTR Benchmark Comparison</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Mean Time to Remediate: Manual vs AEGIS (Seconds)
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-[10px] font-mono text-emerald-400">
                -98.6% FASTER
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mttrComparisonData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis dataKey="metric" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={110} />
                <RechartsTooltip
                  formatter={(val) => [`${val} seconds`, 'Recovery Time']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="time" radius={[0, 4, 4, 0]}>
                  {mttrComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 3. Service Fleet Health Matrix Grid */}
      <Card className="bg-card border border-border rounded-lg shadow-sm">
        <CardHeader className="p-4 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <Server className="h-4 w-4 text-primary" />
                <span>Knowledge Graph Fleet Matrix ({nodes.length} Nodes)</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {healthyNodesCount} of {nodes.length} services and resources operating at normal SLA
              </CardDescription>
            </div>

            {/* Layer Filter Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['all', 'gateway', 'services', 'databases', 'cloud'].map((layer) => (
                <button
                  key={layer}
                  onClick={() => setSelectedLayer(layer)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-heading font-medium rounded-md transition-all active:scale-95",
                    selectedLayer === layer
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {layer.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {filteredNodes.map((node) => {
              const data = node.data;
              const isCritical = data.status === 'critical' || data.isRootCause;
              const isSimulatedRisk = data.status === 'simulated-risk';

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    selectNode(node.id);
                    onNavigateToGraph();
                  }}
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50 shadow-xs",
                    isCritical
                      ? "bg-destructive/10 border-destructive/60"
                      : isSimulatedRisk
                      ? "bg-secondary/70 border-border"
                      : "bg-card border-border hover:bg-secondary/30"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 truncate">
                      {data.layer === 'databases' ? (
                        <Database className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      ) : data.layer === 'cloud' ? (
                        <Cloud className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      ) : (
                        <Server className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      )}
                      <span className="font-heading font-semibold text-xs truncate text-foreground" title={data.label}>
                        {data.label}
                      </span>
                    </div>
                    <Badge
                      variant={isCritical ? 'destructive' : isSimulatedRisk ? 'secondary' : 'outline'}
                      className="text-[9px] px-1.5 py-0 uppercase"
                    >
                      {data.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/40">
                    <div>
                      <span>P99: </span>
                      <strong className={cn((data.responseTimeMs ?? 0) > 500 ? "text-destructive" : "text-foreground")}>
                        {data.responseTimeMs ?? 24}ms
                      </strong>
                    </div>
                    <div className="text-right">
                      <span>ERR: </span>
                      <strong className={cn((data.errorRate ?? 0) > 0.05 ? "text-destructive" : "text-foreground")}>
                        {data.errorRate !== undefined ? `${(data.errorRate * 100).toFixed(1)}%` : '0.0%'}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 4. Incident Distribution & RCA Knowledge Memory Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* RCA Failure Distribution (5 cols) */}
        <Card className="lg:col-span-5 bg-card border border-border rounded-lg shadow-sm p-4">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Causal Anomaly Classification</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Historical failure modes diagnosed by Cohere Command R+
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-2 h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incidentDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={4}
                >
                  {incidentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-border/40">
            {incidentDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground truncate">{item.name}</span>
                <span className="font-mono font-bold ml-auto text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Live Incident & Resolution Memory Ledger (7 cols) */}
        <Card className="lg:col-span-7 bg-card border border-border rounded-lg shadow-sm p-4">
          <CardHeader className="p-0 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Autonomous Resolution Memory Ledger</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Graph updates committed to OCI Memory Graph for continuous learning
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                {kpis.totalIncidentsHealed} INCIDENTS HEALED
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0 pt-1 space-y-2.5 max-h-64 overflow-y-auto pr-1">
            <div className="p-3 rounded-lg bg-secondary/40 border border-border text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  INC-9104: PaymentService DB Pool Exhaustion
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">Today, 15:02 IST</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Applied Dynamic Connection Pool Scaling (120 conns) + Rolling Pod Restart. MTTR: 34.2s. Zero human intervention.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-secondary/40 border border-border text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  INC-8942: OrderService Cascading Latency Spike
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">Yesterday, 18:44 IST</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Tripped upstream circuit breaker on non-critical analytics topic to shed 15% traffic. Latency returned to 38ms.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-secondary/40 border border-border text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  PRE-7721: Blocked Breaking Stripe Schema PR-1082
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">26 Sep 2026</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Pre-deployment guard detected 4 impacted upstream services with Risk Score 82/100. Prevented cascading outage.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
