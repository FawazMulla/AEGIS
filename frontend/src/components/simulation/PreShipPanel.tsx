import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSimulationStore } from '@/stores/useSimulationStore';
import {
  Sparkles,
  GitPullRequest,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Network,
  ShieldAlert,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const PreShipPanel: React.FC = () => {
  const {
    availablePRs,
    selectedPR,
    selectPR,
    activeResult,
    isAnalyzing,
    runSimulation,
    clearSimulation,
    setCustomPR,
  } = useSimulationStore();

  const handleAnalyze = async () => {
    try {
      const result = await runSimulation();
      if (result.verdict === 'BLOCK') {
        toast.error(`Simulation Verdict: BLOCKED (Risk Score ${result.overallRiskScore}/100)`);
      } else if (result.verdict === 'WARNING') {
        toast.warning(`Simulation Verdict: WARNING (Risk Score ${result.overallRiskScore}/100)`);
      } else {
        toast.success(`Simulation Verdict: PROCEED (Risk Score ${result.overallRiskScore}/100)`);
      }
    } catch {
      toast.error("Failed to complete pre-deployment risk analysis.");
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
      {/* Simulation Trigger & Configuration Card */}
      <Card className="bg-card border border-border rounded-lg shadow-sm">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-secondary border border-border">
                <GitPullRequest className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <CardTitle className="text-sm sm:text-base">Pre-Deployment Risk Guard</CardTitle>
                <CardDescription className="text-xs">
                  Graph BFS Blast Radius (Alg 1) & Composite Risk Scoring (Alg 2)
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              CI/CD GATE
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-3">
          {/* PR Selector */}
          <div>
            <label className="text-[11px] font-heading font-semibold text-muted-foreground mb-1 block">
              Select Pull Request Scenario
            </label>
            <Select
              value={selectedPR?.prId || 'PR-1082'}
              onValueChange={(val) => selectPR(val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Choose a PR to simulate" />
              </SelectTrigger>
              <SelectContent>
                {availablePRs.map((pr) => (
                  <SelectItem key={pr.prId} value={pr.prId} className="text-xs">
                    <span className="font-mono font-bold text-primary mr-1.5">{pr.prId}</span>
                    <span className="truncate">{pr.title}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PR Details Summary Box */}
          {selectedPR && (
            <div className="p-3 rounded-lg bg-secondary/40 border border-border text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-mono text-[11px]">
                  Target: <strong className="text-foreground">{selectedPR.targetService}</strong>
                </span>
                <span className="text-muted-foreground font-mono text-[11px]">
                  Branch: <strong className="text-foreground">{selectedPR.branch}</strong>
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {selectedPR.diffSummary}
              </p>

              {/* Toggles */}
              <div className="flex items-center justify-between pt-1 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">Breaking Schema:</span>
                  <Switch
                    checked={selectedPR.hasBreakingApiChange}
                    onCheckedChange={(checked) => setCustomPR({ hasBreakingApiChange: checked })}
                    aria-label="Toggle breaking schema change"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">Database Alteration:</span>
                  <Switch
                    checked={selectedPR.hasSchemaChange}
                    onCheckedChange={(checked) => setCustomPR({ hasSchemaChange: checked })}
                    aria-label="Toggle database alteration"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex-1 bg-primary text-primary-foreground font-heading font-semibold text-xs h-9 shadow-xs"
            >
              <Sparkles className={cn("h-4 w-4 mr-1.5", isAnalyzing && "animate-spin")} />
              {isAnalyzing ? "Computing Graph BFS..." : "Run Blast Radius Analysis"}
            </Button>
            {activeResult && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearSimulation}
                className="h-9 text-xs"
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Simulation Result Card */}
      {activeResult && (
        <Card className="bg-card border border-border rounded-lg shadow-sm animate-in fade-in-50 duration-200">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-primary" />
                <span>Simulation Risk Verdict</span>
              </CardTitle>
              <Badge
                variant={
                  activeResult.verdict === 'BLOCK'
                    ? 'destructive'
                    : activeResult.verdict === 'WARNING'
                    ? 'warning'
                    : 'default'
                }
                className="px-2.5 py-1 text-xs font-heading font-bold"
              >
                {activeResult.verdict === 'BLOCK' && <XCircle className="h-3.5 w-3.5 mr-1 inline" />}
                {activeResult.verdict === 'WARNING' && <AlertTriangle className="h-3.5 w-3.5 mr-1 inline" />}
                {activeResult.verdict === 'PROCEED' && <CheckCircle2 className="h-3.5 w-3.5 mr-1 inline" />}
                {activeResult.verdict}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-2 space-y-3.5">
            {/* Overall Score Gauge */}
            <div className="p-3.5 rounded-lg bg-secondary/40 border border-border flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-mono text-muted-foreground">
                  COMPOSITE RISK SCORE (R)
                </p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className={cn(
                    "text-3xl font-mono font-bold tracking-tight",
                    activeResult.overallRiskScore >= 66
                      ? "text-destructive"
                      : activeResult.overallRiskScore >= 31
                      ? "text-warning"
                      : "text-emerald-400"
                  )}>
                    {activeResult.overallRiskScore}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">/ 100</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase font-mono text-muted-foreground">
                  TOPOLOGY BLAST RADIUS
                </p>
                <p className="text-sm font-mono font-bold text-foreground mt-1">
                  {activeResult.blastRadiusCount} of {activeResult.totalServicesCount} Services Impacted
                </p>
              </div>
            </div>

            {/* Verdict Explanation */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {activeResult.verdictReason}
            </p>

            {/* 4 Factor Breakdown */}
            <div className="space-y-2 pt-2 border-t border-border/50">
              <h4 className="text-[11px] font-heading font-bold text-foreground flex items-center justify-between">
                <span>Risk Component Attribution</span>
                <span className="font-mono text-[10px] text-muted-foreground">R = 0.35B + 0.30C + 0.15D + 0.20H</span>
              </h4>

              {/* Factor B */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Blast Radius Index (B, w=0.35)</span>
                  <span className="font-mono font-semibold">{activeResult.components.blastRadiusIndex}%</span>
                </div>
                <Progress value={activeResult.components.blastRadiusIndex} className="h-1.5" />
              </div>

              {/* Factor C */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Contract Breaking Severity (C, w=0.30)</span>
                  <span className="font-mono font-semibold">{activeResult.components.contractBreakingSeverity}/100</span>
                </div>
                <Progress
                  value={activeResult.components.contractBreakingSeverity}
                  className="h-1.5"
                  indicatorClassName={activeResult.components.contractBreakingSeverity > 0 ? "!bg-destructive" : ""}
                />
              </div>

              {/* Factor D */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Circular Dependency Penalty (D, w=0.15)</span>
                  <span className="font-mono font-semibold">{activeResult.components.circularDependencyPenalty}/100</span>
                </div>
                <Progress
                  value={activeResult.components.circularDependencyPenalty}
                  className="h-1.5"
                  indicatorClassName={activeResult.components.circularDependencyPenalty > 0 ? "!bg-destructive" : ""}
                />
              </div>

              {/* Factor H */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Historical Incident Factor (H, w=0.20)</span>
                  <span className="font-mono font-semibold">{activeResult.components.historicalIncidentFactor}%</span>
                </div>
                <Progress value={activeResult.components.historicalIncidentFactor} className="h-1.5" />
              </div>
            </div>

            {/* Impacted Services List */}
            <div className="space-y-2 pt-2 border-t border-border/50">
              <h4 className="text-[11px] font-heading font-bold text-foreground flex items-center gap-1.5">
                <Network className="h-3.5 w-3.5 text-primary" />
                <span>Impacted Graph Nodes ({activeResult.impactedNodes.length})</span>
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {activeResult.impactedNodes.map((n) => (
                  <div
                    key={n.nodeId}
                    className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border/40 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-foreground">{n.serviceName}</span>
                      <span className="text-[10px] text-muted-foreground">Depth {n.depth}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        Weight: {Math.round(n.impactWeight * 100)}%
                      </span>
                      <Badge
                        variant={n.criticality === 'CRITICAL' ? 'destructive' : 'secondary'}
                        className="text-[9px] px-1.5 py-0"
                      >
                        {n.criticality}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mitigation Recommendations */}
            {activeResult.mitigationRecommendations.length > 0 && (
              <div className="p-3 rounded-lg bg-secondary/50 border border-border text-xs space-y-1.5">
                <h4 className="font-heading font-semibold text-foreground flex items-center gap-1.5 text-[11px]">
                  <Lightbulb className="h-3.5 w-3.5 text-primary" /> Actionable Mitigation Recommendations
                </h4>
                <ul className="space-y-1 text-muted-foreground text-[11px]">
                  {activeResult.mitigationRecommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <ArrowRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
