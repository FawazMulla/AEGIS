# MAJOR PROJECT --- PROPOSAL CUM FUNCTIONAL REQUIREMENTS DOCUMENT (FRD)

## AEGIS

**Autonomous Engineering Graph & Intelligence System** \> "See every
risk before it ships. Heal every failure after it lands."

## 1. Abstract

AEGIS is a single engineering intelligence platform that removes the
biggest blind spot in modern software delivery: the gap between knowing
how a system is built and being able to act when it breaks. AEGIS
continuously builds a live Knowledge Graph of an organisation's entire
software ecosystem --- code, APIs, databases, infrastructure, and
Kubernetes resources --- and uses it for two connected purposes. Before
a change is deployed, AEGIS simulates it against the graph and predicts
what will fail. After deployment, an autonomous reasoning loop monitors
the live system, and when something goes wrong, an LLM agent diagnoses
the root cause by querying the same graph, plans a safe fix, executes it
with automatic rollback, and writes the outcome back into the graph. The
result is one system that gets safer to change and better at healing
itself with every release, instead of two disconnected tools --- a
static-analysis tool that cannot act, and a monitoring tool that cannot
reason about structure.

## 2. Problem Statement

Enterprise software today runs across hundreds of repositories,
thousands of APIs, multiple databases, and Kubernetes clusters where
everything depends on everything else. Engineers routinely cannot answer
basic questions --- which services depend on another, what will break
after a deployment, which customers are affected --- so failures are
discovered only after they happen in production, causing outages, failed
rollbacks, and lost engineering time. On the operations side, teams are
almost entirely reactive: they act only once an alert fires, tune and
scale systems by hand, and spend hours manually tracing root cause
across scattered logs and metrics, because existing monitoring tools
alert but never reason, decide, or act on their own.

  -----------------------------------------------------------------------
  Stage                               Core Gap
  ----------------------------------- -----------------------------------
  Before deployment                   No live model of dependencies
                                      exists, so the blast radius of a
                                      change is unknown until it fails in
                                      production.

  After deployment                    Diagnosis is manual and slow, and
                                      no closed feedback loop lets the
                                      system act on its own alerts.
  -----------------------------------------------------------------------

Crucially, no existing tool bridges the two: structural tools (code
scanners, service catalogues) never reach into live decision-making, and
monitoring/AIOps tools have no structural model of the system to reason
with. This is the gap AEGIS is built to close.

## 3. Research Gap & Objectives

No existing platform uses a live, continuously-updated structural
knowledge graph as the grounding substrate for an autonomous
self-healing agent's root-cause reasoning, and none closes the loop by
feeding healing outcomes back into that same graph to sharpen future
risk prediction. This dual gap --- prediction without memory, and
reasoning without structure --- is what AEGIS's single shared graph is
designed to remove.

### Objectives

-   Continuously discover and graph every engineering entity --- code,
    APIs, databases, infrastructure, Kubernetes --- into one live
    Knowledge Graph.

-   Simulate proposed deployments against the graph and predict failure
    risk, affected services, and rollback complexity before release.

-   Monitor the live system and detect anomalies in real time.

-   Ground an LLM reasoning agent's root-cause diagnosis directly in the
    graph rather than raw logs alone.

-   Plan and simulate candidate fixes, execute them through safe,
    rollback-capable actuators, and re-verify recovery.

-   Write every incident and outcome back into the graph so future
    predictions improve automatically.

## 4. Proposed Solution --- The AEGIS Loop

AEGIS operates as one continuous loop rather than two separate tools:

1.  PREDICT --- scanners build and update the Knowledge Graph; the
    Simulation Engine scores proposed changes for risk before they ship.

2.  DEPLOY --- the change ships, informed or gated by that risk score.

3.  MONITOR --- live telemetry (metrics, logs, traces) is continuously
    collected from the same services already modelled in the graph.

4.  DIAGNOSE --- on an anomaly, the LLM agent queries the graph for the
    affected service's dependencies and past incidents before forming a
    hypothesis --- this graph-grounded reasoning is AEGIS's central
    novelty.

5.  PLAN & HEAL --- candidate fixes are simulated, the safest is
    executed through guarded actuators, with automatic rollback if
    health worsens.

6.  LEARN --- the incident, diagnosis, action, and outcome are written
    back into the graph, so the next risk prediction is sharper than the
    last.

This closed predict-diagnose-heal-learn loop, built on one shared graph
instead of two disconnected models, is what distinguishes AEGIS from a
static-analysis tool bolted onto a monitoring tool.

## 5. System Architecture

  -----------------------------------------------------------------------
  Layer                               Function
  ----------------------------------- -----------------------------------
  Data Source Layer                   Git repositories, databases, cloud
                                      infrastructure (AWS/Azure/GCP),
                                      Kubernetes, CI/CD, OpenTelemetry.

  Collector Layer                     Repository, static-code,
                                      API-discovery, database,
                                      infrastructure, and Kubernetes
                                      scanners; runtime telemetry
                                      collector.

  Knowledge Graph Layer               A single Neo4j graph storing
                                      structural entities (services,
                                      APIs, databases) and runtime
                                      entities (incidents, decisions,
                                      actions) together.

  Predictive Layer                    Change Impact Analyzer, Deployment
                                      Simulation Engine, Drift Detector,
                                      Rollback Planner, Technical Debt &
                                      Cost Analyzers.

  Adaptive Reasoning Layer            LLM agent performing graph-grounded
                                      Monitor → Analyze → Plan reasoning.

  Execution Layer                     Guarded, rollback-safe actuators
                                      applying scaling, restarts, config
                                      changes, and rollbacks via
                                      Kubernetes.

  Presentation Layer                  Unified dashboard (architecture
                                      graph, risk heatmap, incident
                                      timeline, decision log) and a REST
                                      API.
  -----------------------------------------------------------------------

A single architectural rule governs safety throughout: the reasoning
layer --- whether the simulation engine or the LLM agent --- never
touches production directly. Every action is mediated by the guarded
Execution Layer, keeping reasoning and acting separate and auditable.

## 6. Core Modules

  -----------------------------------------------------------------------
  Module                              Role
  ----------------------------------- -----------------------------------
  Repository & Static Code Scanner    Builds the call graph and
                                      dependency graph from source code.

  API, Database & Infrastructure      Maps REST/GraphQL/gRPC APIs,
  Discovery                           database schemas, and
                                      cloud/Kubernetes resources into the
                                      graph.

  Knowledge Graph Service             Stores and continuously updates
                                      every structural and runtime entity
                                      in one schema.

  Change Impact Analyzer & Simulation Predicts affected services and
  Engine                              produces a risk score for a
                                      proposed change, and later reuses
                                      the same engine to score candidate
                                      runtime fixes.

  Drift, Rollback & Technical Debt    Detect architecture drift, plan
  Analyzers                           safe rollbacks, and surface
                                      circular dependencies and dead
                                      code.

  Monitoring & Telemetry Collector    Continuously gathers metrics, logs,
                                      and traces from the live system.

  Graph-Grounded RCA Agent            LLM agent that queries the
                                      Knowledge Graph (dependency
                                      neighbourhood, blast radius,
                                      similar past incidents) to diagnose
                                      anomalies.

  Execution & Rollback Actuator       Applies the chosen fix safely and
                                      reverts automatically if health
                                      worsens.

  Feedback Writer                     Writes every incident, decision,
                                      and outcome back into the graph,
                                      closing the loop.

  Dashboard & REST API                Unified visibility and third-party
                                      integration.
  -----------------------------------------------------------------------

## 7. Key Functional Requirements

### Discovery & Knowledge Graph

FR-KG-1 The system shall scan repositories, APIs, databases,
infrastructure, and Kubernetes resources and represent them as nodes and
typed edges in a single graph.

FR-KG-2 The system shall update the graph continuously as code,
infrastructure, and runtime conditions change.

FR-KG-3 The system shall expose graph queries (shortest path, blast
radius, incident similarity) as an internal API used by both prediction
and diagnosis.

### Prediction & Simulation

FR-PS-1 The system shall simulate a proposed change against the graph
and produce a risk score, affected-service list, and rollback-complexity
estimate before deployment.

FR-PS-2 The system shall detect architectural drift, circular
dependencies, and estimated cost impact for a proposed change.

### Monitoring, Diagnosis & Healing

FR-MH-1 The system shall continuously monitor live metrics, logs, and
traces and raise an event on anomaly detection.

FR-MH-2 On an anomaly, the LLM agent shall query the graph for the
affected service's dependencies and past incidents before proposing a
root cause.

FR-MH-3 The system shall simulate and score candidate remediation
actions before executing any of them.

FR-MH-4 The system shall execute the selected action through guarded,
rollback-capable actuators only, and automatically roll back if
post-action health worsens.

FR-MH-5 The system shall log every prediction, diagnosis, decision, and
action with a human-readable reasoning trace.

FR-MH-6 The system shall write every incident and its outcome back into
the graph to inform future risk scoring.

### Presentation

FR-UI-1 The system shall provide a dashboard showing the architecture
graph, a risk heatmap, live incidents, and the decision log.

FR-UI-2 The system shall expose a REST API for third-party integration.

## 8. Technology Stack

  -----------------------------------------------------------------------
  Category                            Tools
  ----------------------------------- -----------------------------------
  Frontend                            React, TypeScript, Cytoscape.js

  Backend                             Go / Spring Boot for scanners and
                                      APIs; Python for the agent and
                                      orchestration

  Agent / LLM Layer                   LLM API + agent/tool-calling
                                      framework

  Graph Database                      Neo4j (unified Knowledge Graph)

  Structured & Vector Storage         PostgreSQL; a vector store for
                                      incident-similarity search

  Messaging                           Kafka or RabbitMQ

  Observability                       Prometheus, Grafana, OpenTelemetry,
                                      Jaeger/Zipkin

  Infrastructure                      Docker, Kubernetes, AWS (with
                                      Azure/GCP scanner support)
  -----------------------------------------------------------------------

## 9. Novelty & Research Contribution

Graph-Grounded Self-Healing --- root-cause reasoning is anchored to live
graph queries rather than raw logs, a gap explicitly unaddressed in
current LLM-agent and AIOps literature.

Closed Predict-Heal Loop --- every healing outcome is written back into
the same graph used for pre-deployment risk scoring, so predictions
improve with every incident resolved.

Shared Simulation Substrate --- one simulation engine scores both
pre-deployment changes and runtime remediation actions.

Safety-grounded autonomy --- every autonomous action is simulated,
scored, and rollback-capable before it ever touches production.

Explainable, auditable decision log --- every prediction and healing
action is traceable to the reasoning that produced it.

## 10. Sandbox Demonstration & Evaluation Plan

AEGIS is demonstrated end-to-end on a controlled, containerised testbed
rather than real production infrastructure, so the full
predict-diagnose-heal-learn loop can be shown safely and repeatably.

### Testbed Setup

Deploy a small multi-service demo application (5-10 microservices with
realistic dependencies --- e.g. an e-commerce or banking-style sample
app) on a local Kubernetes cluster (kind/minikube).

Instrument every service with OpenTelemetry, Prometheus, and Grafana so
metrics, logs, and traces are collected exactly as they would be in
production.

Point AEGIS's scanners at the testbed's repositories, APIs, databases,
and Kubernetes resources to build the baseline Knowledge Graph.

### Experiment Steps

1.  Predict --- submit a controlled code change (e.g. one that alters a
    shared API or adds a slow database call) and have the Simulation
    Engine score its risk and predicted blast radius before it is
    deployed.

2.  Deploy --- release the change into the sandbox cluster.

3.  Inject a fault --- use a chaos-engineering tool (e.g. Chaos Mesh or
    Litmus) to trigger a realistic failure: a pod crash, CPU spike,
    latency injection, or database timeout.

4.  Observe the loop --- confirm the Monitor stage detects the anomaly,
    the graph-grounded RCA agent diagnoses the cause by querying the
    Knowledge Graph, the Planner proposes and simulates a fix, and the
    Execution layer applies it with rollback safety if needed.

5.  Verify healing --- confirm the service returns to a healthy state
    and the action is logged with its reasoning trace.

6.  Close the loop --- confirm the Feedback Writer records the incident
    in the graph, then re-run the same pre-deployment simulation from
    Step 1 and show the risk score has changed, demonstrating that the
    system learned from the incident.

### Evaluation Metrics

Time-to-detect, time-to-diagnose, and time-to-heal for each injected
fault.

Diagnosis accuracy --- whether the agent's root cause matches the fault
actually injected.

Prediction accuracy before vs. after the Feedback Writer updates the
graph, to quantify the learning effect.

A head-to-head comparison against a manual response and a simple
rule-based alerting baseline on the same injected faults.

## 11. Work Plan

  -----------------------------------------------------------------------
  Phase                               Focus
  ----------------------------------- -----------------------------------
  Phase 1                             Requirement analysis, Knowledge
                                      Graph schema design, testbed setup.

  Phase 2                             Scanners and graph population;
                                      monitoring layer wired to the same
                                      testbed.

  Phase 3                             Simulation Engine, risk scoring,
                                      and the graph-grounded reasoning
                                      agent.

  Phase 4                             Execution layer with rollback
                                      safety; Feedback Writer closing the
                                      loop.

  Phase 5                             Full integration, evaluation
                                      against manual/rule-based
                                      baselines, and reporting.
  -----------------------------------------------------------------------

## 12. Deliverables

  -----------------------------------------------------------------------
  Category                            Items
  ----------------------------------- -----------------------------------
  Documentation                       SRS, System Design Document, UML &
                                      ER diagrams, Knowledge Graph
                                      schema, Research paper

  Software                            Scanners, Knowledge Graph service,
                                      Simulation Engine, RCA agent,
                                      Execution layer, Dashboard, REST
                                      API

  Evaluation                          Containerised sandbox testbed,
                                      fault-injection benchmark,
                                      evaluation dataset, evaluation
                                      report vs. manual/rule-based
                                      baselines

  Presentation                        Working prototype, demonstration
                                      video, final report, presentation
                                      deck
  -----------------------------------------------------------------------

## 13. Conclusion

AEGIS aims to show that engineering intelligence and self-healing are
not two separate problems but one continuous loop, built on a single,
ever-improving Knowledge Graph. By predicting risk before a change ships
and grounding autonomous healing in that same structural knowledge after
it ships, AEGIS moves an organisation from being merely monitored to
being genuinely self-aware --- closing the gap between knowing a system
and being able to safely act on it.

### AEGIS Loop --- Diagram Representation

> The source document contains the AEGIS loop as a numbered textual
> workflow rather than an embedded diagram. The Mermaid diagram below
> represents that same six-step loop without adding new system behavior.

``` mermaid
flowchart LR
    A[PREDICT<br/>Build/update Knowledge Graph<br/>Score proposed change] --> B[DEPLOY<br/>Release change]
    B --> C[MONITOR<br/>Metrics, logs, traces]
    C --> D[DIAGNOSE<br/>Graph-grounded RCA]
    D --> E[PLAN & HEAL<br/>Simulate fix<br/>Execute with rollback]
    E --> F[LEARN<br/>Write incident, action & outcome<br/>back into graph]
    F --> A
```

### Document Visuals / Diagrams

No embedded image/diagram objects were present in the DOCX. The source's
architecture and module visuals are represented by the Markdown tables
above, and the textual AEGIS loop is additionally represented as Mermaid
for Markdown viewers that support it.
