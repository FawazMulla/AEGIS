import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useHealingStore } from '@/stores/useHealingStore';
import { ChaosType } from '@/types/chaos';
import { CandidateFix } from '@/types/healing';
import {
  Flame,
  Zap,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const PostDeployPanel: React.FC = () => {
  const {
    activeChaos,
    activeSession,
    isInjectingChaos,
    isStreaming,
    isAutoPilotEnabled,
    selectedCandidateFix,
    selectCandidateFix,
    injectChaos,
    applyFixAction,
    resetIncident,
  } = useHealingStore();

  const [selectedService, setSelectedService] = useState('payment-service');
  const [selectedChaosType, setSelectedChaosType] = useState<ChaosType>('LATENCY_SPIKE');
  const [intensity, setIntensity] = useState(80);

  const handleInjectChaos = async () => {
    toast.error(`Injecting ${selectedChaosType} into ${selectedService} (${intensity}% intensity)...`);
    await injectChaos({
      targetServiceId: selectedService,
      chaosType: selectedChaosType,
      intensityPercent: intensity,
      durationSeconds: 60,
    });
  };

  const handleApplyFix = async (fix: CandidateFix) => {
    toast.success(`Applying Fix: ${fix.name} (Safety Score: ${fix.safetyScore}/100)...`);
    await applyFixAction(fix);
  };

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
      {/* Chaos Injection Control Card */}
      <Card className="bg-card/90 border-border backdrop-blur-md shadow-md">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-destructive/10 border border-destructive/20">
                <Flame className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-sm sm:text-base">Chaos Fault Injection Engine</CardTitle>
                <CardDescription className="text-xs">
                  Trigger synthetic production failures to observe autonomous graph self-healing
                </CardDescription>
              </div>
            </div>
            <Badge variant="destructive" className="text-[10px] font-mono">
              FAULT GENERATOR
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Target Service */}
            <div>
              <label className="text-[11px] font-heading font-semibold text-muted-foreground mb-1 block">
                Target Microservice
              </label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment-service">Payment Service</SelectItem>
                  <SelectItem value="order-service">Order Service</SelectItem>
                  <SelectItem value="auth-service">Auth Service</SelectItem>
                  <SelectItem value="inventory-service">Inventory Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fault Type */}
            <div>
              <label className="text-[11px] font-heading font-semibold text-muted-foreground mb-1 block">
                Anomaly Type
              </label>
              <Select
                value={selectedChaosType}
                onValueChange={(val) => setSelectedChaosType(val as ChaosType)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select fault" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LATENCY_SPIKE">Latency Spike (p99 &gt; 3s)</SelectItem>
                  <SelectItem value="PACKET_DROP">Packet Drop (5xx Spikes)</SelectItem>
                  <SelectItem value="POD_CRASH">Pod CrashLoopBackOff</SelectItem>
                  <SelectItem value="CONNECTION_POOL_EXHAUSTION">DB Pool Exhaustion</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Intensity Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Fault Intensity & Blast Magnitude</span>
              <span className="font-mono font-bold text-destructive">{intensity}%</span>
            </div>
            <Slider
              value={[intensity]}
              onValueChange={(vals) => setIntensity(vals[0] ?? 80)}
              min={20}
              max={100}
              step={5}
              aria-label="Fault intensity"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="destructive"
              onClick={handleInjectChaos}
              disabled={isInjectingChaos || isStreaming}
              className="flex-1 font-heading font-bold text-xs h-10 shadow-sm"
            >
              <Flame className="h-4 w-4 mr-1.5" />
              {isInjectingChaos ? "Injecting Fault..." : "Inject Chaos Anomaly"}
            </Button>
            {(activeChaos || activeSession) && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetIncident}
                className="h-10 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Autonomous Healing SSE Stream & Timeline Card */}
      {activeSession && (
        <Card className="bg-card/90 border-border backdrop-blur-md shadow-md animate-in fade-in-50 duration-300">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm sm:text-base">
                  8-Step Self-Healing Pipeline
                </CardTitle>
              </div>
              <Badge
                variant={
                  activeSession.stage === 'COMMITTED'
                    ? 'default'
                    : activeSession.stage === 'FAILED'
                    ? 'destructive'
                    : 'tertiary'
                }
                className="text-xs font-heading font-bold animate-pulse"
              >
                {activeSession.stage === 'COMMITTED' ? 'INCIDENT RESOLVED' : activeSession.stage}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Incident ID: {activeSession.incidentId} • Target: {activeSession.targetServiceName}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 pt-2 space-y-3">
            {/* Live SSE Stream Step Timeline */}
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {activeSession.steps.map((step, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-2.5 rounded-xl border text-xs transition-all duration-300",
                    step.stage === 'COMMITTED'
                      ? "bg-emerald-950/20 border-emerald-800/40 text-emerald-300"
                      : step.stage === 'ANOMALY_DETECTED'
                      ? "bg-destructive/10 border-destructive/30 text-rose-300"
                      : "bg-muted/30 border-border/50 text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-heading font-bold">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-mono">
                        {step.stepIndex}
                      </span>
                      <span>{step.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      Step {step.stepIndex}/{step.totalSteps}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed pl-5">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Candidate Fixes Safety Ranking Section (Algorithm 4) */}
            {activeSession.availableFixes && activeSession.availableFixes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-heading font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>Candidate Remediation Fixes (Safety Ranking - Alg 4)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    S_F = 0.40(SR) + 0.35(100-Risk) + 0.25(100-Comp)
                  </span>
                </div>

                <div className="space-y-2">
                  {activeSession.availableFixes.map((fix) => (
                    <div
                      key={fix.fixId}
                      onClick={() => selectCandidateFix(fix)}
                      className={cn(
                        "p-3 rounded-xl border transition-all cursor-pointer",
                        selectedCandidateFix?.fixId === fix.fixId
                          ? "bg-primary/10 border-primary shadow-xs ring-1 ring-primary"
                          : "bg-muted/30 border-border/60 hover:bg-muted/60"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-foreground">
                            {fix.name}
                          </span>
                          <Badge variant="outline" className="text-[9px]">
                            {fix.actionType}
                          </Badge>
                        </div>
                        <Badge
                          variant={fix.safetyScore >= 85 ? 'default' : 'secondary'}
                          className="text-xs font-mono font-bold"
                        >
                          Safety: {fix.safetyScore}/100
                        </Badge>
                      </div>

                      <p className="text-[11px] text-muted-foreground mb-2">
                        {fix.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/30">
                        <span>Success Rate: {fix.successRate}%</span>
                        <span>Side-Effect Risk: {fix.sideEffectRisk}%</span>
                        <span>Recovery: ~{fix.estimatedRecoveryTimeSec}s</span>
                      </div>

                      {/* Manual Trigger Button for HITL Mode */}
                      {!isAutoPilotEnabled && activeSession.stage !== 'COMMITTED' && (
                        <div className="pt-2 mt-2 border-t border-border/30 flex justify-end">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyFix(fix);
                            }}
                            className="h-7 text-xs bg-primary text-primary-foreground font-heading font-bold"
                          >
                            <Play className="h-3 w-3 mr-1" /> Execute This Fix
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
