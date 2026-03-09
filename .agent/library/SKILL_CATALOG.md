# Antigravity Skill Catalog

> **Jai.OS 5.0** | Separate from agent files — this is the shared capability library.
> Agents reference skills from this catalog. Skills here can be composed, assigned, and versioned independently of any single agent.
>
> **To assign a skill to an agent:** Add the skill handle to the agent's `allowed_tools` YAML field and reference the SOP in their SKILL.md.

---

## What Is a Skill?

A **Skill** is a discrete, composable capability — a set of SOPs, tools, and domain knowledge that can be activated by any qualifying agent. Unlike agent identities (which are fixed), skills are portable and reusable across the Orchestra.

---

## Skill Registry

### Development Skills

| Skill Handle                      | Domain          | Description                                                           | Owned By             |
| :-------------------------------- | :-------------- | :-------------------------------------------------------------------- | :------------------- |
| `web-design-standards`            | Frontend        | Responsive design, accessibility, CSS architecture                    | @priya, @sebastian   |
| `api-documentation-generator`     | Backend         | OpenAPI spec generation, endpoint documentation                       | @sebastian, @arthur  |
| `database-migration-generator`    | Database        | Safe schema migrations with rollback                                  | @diana, @steve       |
| `database-schema-optimizer`       | Database        | Query performance, indexing strategies                                | @diana, @steve       |
| `environment-variable-manager`    | DevOps          | .env structure, Vercel env binding, secrets audit                     | @derek, @victor      |
| `dockerfile-optimization`         | Infrastructure  | Container optimization, multi-stage builds                            | @derek               |
| `git-branch-strategy-advisor`     | Version Control | Branching models, PR workflows                                        | @derek, @owen        |
| `git-commit-formatter`            | Version Control | Conventional commits, changelog generation                            | @derek               |
| `css-architecture-refactor`       | Frontend        | BEM, utility-first, design token migration                            | @priya, @sebastian   |
| `react-component-test-generator`  | Testing         | Jest, React Testing Library component tests                           | @sam                 |
| `test-driven-bug-fix`             | QA              | TDD workflow for bug resolution                                       | @sam                 |
| `test-driven-development`         | Dev Excellence  | Comprehensive TDD: Iron Law, Red-Green-Refactor, anti-patterns        | @sam                 |
| `debugging-strategies`            | Dev Excellence  | Systematic debugging: scientific method, binary search, git bisect    | @sam, @sebastian     |
| `pricing-strategy`                | Growth          | Value-based pricing, Van Westendorp, tier design, enterprise pricing  | @felix, @boyce       |
| `analytics-tracking`              | Growth          | Measurement Readiness Index, event taxonomy, GA4/GTM, UTM discipline  | @maya                |
| `memory-leak-detective`           | Performance     | Heap profiling, event listener audits                                 | @milo                |
| `performance-regression-debugger` | Performance     | Lighthouse regression analysis, bundle analysis                       | @milo                |
| `web-performance-audit`           | Performance     | Core Web Vitals, Lighthouse, INP optimization                         | @milo                |
| `llm-evaluation-harness`          | AI Engineering  | Golden-set evals, regression scoring, release gates for LLM workflows | @sam, @vigil         |
| `agent-observability-telemetry`   | AI Engineering  | Tracing, metrics, and failure analytics for multi-agent systems       | @milo, @alex         |
| `mcp-gateway-operations`          | Infrastructure  | MCP gateway auth, routing, rate limits, and tool-usage monitoring     | @adrian, @mason      |
| `prompt-version-control`          | AI Engineering  | Prompt repository management, diffing, rollback, and test gating      | @sebastian, @sam     |
| `model-routing-optimization`      | AI Engineering  | Dynamic model selection by cost, latency, and quality policies        | @sebastian, @milo    |
| `synthetic-test-data-generator`   | QA              | Creation of realistic edge-case datasets for agent and API testing    | @sam, @patrick       |
| `agent-memory-architecture`       | AI Engineering  | Short/long-term memory design, retrieval strategy, and decay policies | @sebastian, @diana   |
| `tool-contract-testing`           | Testing         | Schema-contract tests for MCP/tool inputs, outputs, and failures      | @sam, @adrian        |
| `workflow-simulation-lab`         | QA              | Pre-production workflow simulation for multi-agent task graphs        | @qualityguard, @alex |
| `context-window-optimization`     | AI Engineering  | Context compression, prioritization, and retrieval packing strategies | @sebastian, @parser  |
| `prompt-caching-strategy`         | AI Engineering  | Prompt/response caching design to reduce latency and spend            | @milo, @sebastian    |
| `inference-cost-profiler`         | FinOps          | Profiling token and inference cost per workflow and endpoint          | @finops, @milo       |
| `api-contract-evolution-planner`  | Backend         | Versioned API contract evolution with compatibility guarantees        | @steve, @sebastian   |
| `schema-drift-monitor`            | Database        | Automated detection of schema and contract drift across environments  | @diana, @steve       |
| `vector-index-lifecycle-manager`  | AI Engineering  | Index build, refresh, archival, and quality governance for vectors    | @steve, @patrick     |
| `edge-runtime-optimization`       | Infrastructure  | Latency and cold-start optimization for edge deployments              | @owen, @milo         |
| `ci-pipeline-flakiness-hunter`    | QA              | Detection and remediation of flaky tests and unstable CI steps        | @sam, @alex          |
| `dependency-risk-auditor`         | Security        | Dependency vulnerability and licensing risk analysis                  | @victor, @hugo       |
| `feature-flag-governance`         | Engineering     | Feature flag lifecycle, expiry, and blast-radius controls             | @sebastian, @sam     |
| `realtime-streaming-architecture` | Backend         | Design patterns for resilient realtime event/data streaming           | @sebastian, @derek   |
| `data-pipeline-backfill-planner`  | Data            | Safe historical backfill strategy for analytics and ops pipelines     | @patrick, @nina      |
| `frontend-bundle-budget-enforcer` | Frontend        | Enforces JS/CSS bundle budgets with CI guardrails                     | @milo, @priya        |
| `test-suite-prioritization`       | Testing         | Risk-based test selection and execution prioritization                | @sam, @qualityguard  |
| `release-candidate-hardening`     | Reliability     | Final-stage hardening checks before production release                | @owen, @sam          |

### Intelligence & Research Skills

| Skill Handle                        | Domain       | Description                                                      | Owned By               |
| :---------------------------------- | :----------- | :--------------------------------------------------------------- | :--------------------- |
| `content-preservation-protocol`     | Research     | Verified content, no hallucination, source-locked                | @scholar, @vigil       |
| `api-rate-limiter-design`           | Backend      | Rate limiting patterns, quota management                         | @sebastian, @steve     |
| `integration-debugging-coordinator` | Debugging    | Cross-service debugging, API integration fixes                   | @mason, @adrian        |
| `skills-matrix-gap-detection`       | Intelligence | Identifying missing skills across the Orchestra                  | @vigil, @intelhub      |
| `team-deep-dive`                    | Intelligence | Full team capability audit and skills mapping                    | @vigil, @marcus        |
| `improvement-scanning`              | Quality      | Continuous quality drift detection                               | @vigil, @watcher       |
| `hallucination-detection-pipeline`  | Research     | Multi-source claim checking and hallucination scoring workflows  | @sophie, @vigil        |
| `source-confidence-scoring`         | Research     | Source quality rating, provenance tagging, confidence tiers      | @sophie, @scholar      |
| `retrieval-quality-audit`           | Research     | RAG retrieval precision/recall audits and chunking diagnostics   | @scholar, @steve       |
| `multimodal-content-qc`             | Quality      | QA checks for image/text/video coherence and brand compliance    | @qualityguard, @carlos |
| `competitive-intel-signal-mining`   | Intelligence | Detection of competitor moves, shifts, and narrative signals     | @intelhub, @sophie     |
| `evidence-trace-graphing`           | Research     | Claim-to-source graph mapping for faster verification and audits | @patrick, @scholar     |
| `market-sentiment-fusion`           | Intelligence | Merges social/news/industry sentiment into strategic insight     | @intelhub, @maya       |
| `contradiction-detection-engine`    | Research     | Detects contradiction across multi-source claims and summaries   | @vigil, @scholar       |
| `source-bias-audit`                 | Research     | Bias pattern analysis and mitigation planning for source sets    | @scholar, @luna        |
| `forecast-scenario-modeling`        | Intelligence | Multi-scenario forecasting with assumptions and confidence bands | @nina, @scholar        |
| `narrative-gap-analysis`            | Intelligence | Identifies messaging gaps between market demand and brand claims | @elena, @sophie        |
| `weak-signal-tracking`              | Intelligence | Tracks early trend signals before mainstream adoption            | @intelhub, @hugo       |
| `benchmark-intelligence-synthesis`  | Research     | Synthesizes competitor benchmark data into actionable insights   | @hugo, @nina           |
| `legal-change-monitoring`           | Compliance   | Monitoring legal/regulatory updates and operational impact       | @luna, @victor         |
| `partner-landscape-mapping`         | Intelligence | Maps strategic partners/vendors and dependency opportunities     | @jasper, @quinn        |
| `decision-quality-retrospective`    | Quality      | Post-decision review framework to improve future choices         | @vigil, @marcus        |

### Operations & Automation Skills

| Skill Handle                       | Domain         | Description                                                         | Owned By                |
| :--------------------------------- | :------------- | :------------------------------------------------------------------ | :---------------------- |
| `project-structure-initializer`    | Operations     | New project scaffolding, file structure, boilerplate                | @genesis, @sebastian    |
| `deadline-tracking`                | Operations     | Deadline registry, alert thresholds, sprint cadence                 | @chronos, @julian       |
| `resource-management`              | Operations     | Agent workload balancing, capacity planning                         | @quartermaster, @julian |
| `agent-routing-protocol`           | Orchestration  | Task routing, handoff patterns, NEXT_HOP logic                      | @marcus, @alex          |
| `continual-learning-scheduler`     | Memory         | Learning propagation cycles, Shared Brain sync scheduling           | @vigil, @alex           |
| `error-handling-strategy`          | Engineering    | Graceful degradation, retry logic, circuit breakers                 | @sebastian, @sam        |
| `interactive-debugger-assistant`   | Debugging      | Step-through debugging, root cause analysis                         | @sam, @sebastian        |
| `policy-as-code-guardrails`        | Governance     | Runtime policy checks, action boundaries, and escalation rules      | @sam, @victor           |
| `agent-runbook-incident-response`  | Reliability    | Incident triage, rollback playbooks, and postmortem templates       | @watcher, @julian       |
| `ai-agent-security-hardening`      | Security       | Secret handling, permission scoping, and attack-surface reduction   | @victor, @sam           |
| `skill-supply-chain-vetting`       | Security       | Validation and trust controls for imported skills and automations   | @victor, @watcher       |
| `cost-anomaly-detection`           | FinOps         | Detecting abnormal token/tool/cloud spend and triggering alerts     | @finops, @maya          |
| `compliance-evidence-packager`     | Compliance     | Building audit-ready evidence bundles for legal/regulatory reviews  | @luna, @arthur          |
| `execution-risk-scoring`           | Governance     | Risk scoring for planned actions with auto-escalation thresholds    | @riskguard, @sam        |
| `automation-rollback-orchestrator` | Reliability    | Controlled rollback sequencing across dependent workflows           | @watcher, @owen         |
| `sla-slo-policy-management`        | Reliability    | Definition and enforcement of SLA/SLO targets across services       | @chronos, @derek        |
| `queue-backpressure-orchestration` | Infrastructure | Queue pressure handling, throttling, and consumer scaling strategy  | @derek, @alex           |
| `incident-communication-protocol`  | Operations     | Structured stakeholder communication during incidents               | @julian, @hannah        |
| `runbook-quality-audit`            | Quality        | Audits runbook completeness, clarity, and operational accuracy      | @arthur, @watcher       |
| `chaos-testing-orchestration`      | Reliability    | Controlled failure-injection exercises for resilience validation    | @sam, @derek            |
| `credential-rotation-automation`   | Security       | Automated credential rotation workflow and expiry enforcement       | @victor, @alex          |
| `backup-restore-validation`        | Reliability    | Scheduled recovery drills and restore verification checks           | @derek, @sam            |
| `change-impact-analysis`           | Operations     | Dependency-aware impact assessment for planned system changes       | @theo, @julian          |
| `cross-team-handoff-standardizer`  | Operations     | Standardized handoff protocol, artifacts, and accountability        | @julian, @marcus        |
| `objective-kpi-tree-design`        | Strategy       | KPI tree architecture linking goals, signals, and interventions     | @nina, @quinn           |
| `capacity-stress-testing`          | Reliability    | Capacity and saturation tests for peak and burst workloads          | @milo, @derek           |
| `governance-review-cadence`        | Governance     | Periodic governance review cycle design and decision logging        | @riskguard, @marcus     |
| `shadow-deployment-orchestration`  | Deployment     | Shadow-release orchestration with diff monitoring                   | @owen, @sam             |
| `rollback-readiness-check`         | Reliability    | Pre-release rollback readiness and dependency safety verification   | @owen, @watcher         |
| `postmortem-action-tracker`        | Operations     | Tracks postmortem remediations to closure with owner accountability | @watcher, @arthur       |

### Marketing & Growth Skills

| Skill Handle                       | Domain | Description                                                        | Owned By        |
| :--------------------------------- | :----- | :----------------------------------------------------------------- | :-------------- |
| `seo-meta-tag-optimizer`           | SEO    | Meta tags, structured data, canonical URLs                         | @grace          |
| `accessibility-audit-skill`        | UX     | WCAG compliance, screen reader testing, ARIA                       | @milo, @priya   |
| `conversion-funnel-diagnostics`    | Growth | Funnel-stage leak detection and conversion hypothesis generation   | @felix, @maya   |
| `offer-positioning-lab`            | Growth | Positioning experiment framework for offer-market fit refinement   | @felix, @elena  |
| `pricing-experiment-orchestration` | Growth | Controlled pricing tests with guardrails and confidence analysis   | @felix, @maya   |
| `lifecycle-email-optimization`     | Growth | Lifecycle campaign sequencing, trigger logic, and uplift testing   | @elena, @maya   |
| `audience-segmentation-strategy`   | Growth | Segmentation framework for creative, channel, and offer tailoring  | @maya, @grace   |
| `social-proof-experimentation`     | Growth | Evidence-led social proof placement and conversion experimentation | @carlos, @felix |

### Design Skills

| Skill Handle                      | Domain         | Description                                                     | Owned By                |
| :-------------------------------- | :------------- | :-------------------------------------------------------------- | :---------------------- |
| `canvas-design`                   | Design         | Canvas/Figma design system skills                               | @priya, @blaise         |
| `theme-factory`                   | Design         | Design token generation, theme system creation                  | @priya, @blaise         |
| `mcp-builder`                     | Infrastructure | Custom MCP server scaffolding                                   | @adrian, @mason         |
| `design-system-drift-detection`   | Design         | Detects divergence from approved brand/design system patterns   | @design-manager, @priya |
| `ux-friction-heatmapping`         | UX             | Journey friction mapping and prioritization of usability fixes  | @priya, @milo           |
| `accessibility-first-prototyping` | UX             | Prototype workflows with accessibility constraints from start   | @priya, @milo           |
| `brand-message-consistency-audit` | Brand          | Cross-touchpoint brand voice and message consistency auditing   | @vivienne, @elena       |
| `design-token-governance`         | Design Systems | Token lifecycle management, review, and adoption compliance     | @design-manager, @priya |
| `motion-system-rationalization`   | Design         | Motion pattern standardization for clarity, performance, and UX | @priya, @blaise         |

### Betting & Sports Skills

| Skill Handle                        | Domain          | Description                                                               | Owned By             |
| :---------------------------------- | :-------------- | :------------------------------------------------------------------------ | :------------------- |
| `football-value-betting`            | Sports Betting  | Tactical analysis, team form, and value identification for football bets  | @gareth, @sterling   |
| `horse-racing-form-analysis`        | Sports Betting  | Form, going, handicap, trainer/jockey intelligence for race selections    | @harry, @sterling    |
| `roulette-probability-engine`       | Casino          | Roulette probability modeling, edge calculation, and system evaluation    | @monty               |
| `lay-back-arbitrage`                | Sports Betting  | Lay-back strategy, exchange arbitrage, and market position management     | @redeye, @sterling   |
| `f1-strategy-analysis`              | Sports Betting  | Formula 1 race strategy, pitstop windows, and driver performance intel    | @pietro              |
| `darts-checkout-calculator`         | Sports Betting  | Darts averages, checkout route probability, and tournament form analysis  | @terry               |
| `motogp-race-analysis`              | Sports Betting  | MotoGP telemetry interpretation, race pace analysis, and betting lines    | @daniel              |
| `odds-movement-tracker`             | Sports Betting  | Real-time odds movement detection, line value identification, and timing  | @sterling, @redeye   |
| `multi-market-bet-coordination`     | Sports Betting  | Multi-sport, multi-market coordination, bankroll and stake sizing         | @redeye              |
| `expected-value-calculator`         | Casino          | EV calculation, Kelly Criterion stake sizing, and edge quantification     | @monty, @gareth      |

### BI & Dashboard Skills

| Skill Handle                        | Domain   | Description                                                                   | Owned By            |
| :---------------------------------- | :------- | :---------------------------------------------------------------------------- | :------------------ |
| `kpi-engineering-intake`            | BI       | KPI definition, source mapping, calculation specs, and cadence design         | @dashboard          |
| `supabase-kpi-views`                | Database | Supabase materialized views and query optimization for BI KPI panels          | @dashboard, @diana  |
| `dashboard-visual-hierarchy`        | BI       | Five-second layout design, chart type selection, and panel hierarchy rules    | @dashboard          |
| `executive-scorecard-design`        | BI       | Executive-level scorecard design with strategic KPI focus and mobile layout   | @dashboard, @nina   |
| `five-second-clarity-test`          | BI       | Dashboard clarity validation — decision legibility in five seconds            | @dashboard, @vigil  |
| `realtime-dashboard-subscriptions`  | Database | Supabase Realtime subscription design and performance for live dashboards     | @dashboard, @steve  |

### Education & Course Design Skills

| Skill Handle                        | Domain    | Description                                                                    | Owned By                 |
| :---------------------------------- | :-------- | :----------------------------------------------------------------------------- | :----------------------- |
| `curriculum-backwards-design`       | Education | Backwards design from learning outcomes to module structure and assessments    | @coursewright            |
| `pilot-cohort-protocol`             | Education | Pilot cohort design, feedback collection cycles, and curriculum iteration      | @coursewright            |
| `module-completion-optimization`    | Education | Engagement optimization for course modules, retention hooks, and checkpoints   | @coursewright, @maya     |
| `platform-selection-matrix`         | Education | Course platform evaluation: Teachable, Kajabi, Circle, and custom builds       | @coursewright            |
| `assessment-design-framework`       | Education | Quiz, project, and assessment design aligned to stated learning outcomes       | @coursewright            |
| `course-sales-funnel-design`        | Growth    | Funnel architecture for course landing pages, email sequences, and conversions | @coursewright, @felix    |

### Client Success Skills

| Skill Handle                        | Domain         | Description                                                                   | Owned By                 |
| :---------------------------------- | :------------- | :---------------------------------------------------------------------------- | :----------------------- |
| `glasbox-onboarding-flow`           | Client Success | Glass Box client onboarding protocol, portal setup, and handoff sequence      | @successbot, @hannah     |
| `churn-risk-detection`              | Client Success | Client churn risk scoring, early warning signals, and intervention playbooks  | @successbot, @hannah     |
| `nps-collection-automation`         | Client Success | NPS survey automation, response collection, and escalation routing            | @successbot, @maya       |
| `client-status-report-generation`   | Client Success | Automated client status report generation, delivery, and audit trail          | @successbot, @arthur     |
| `project-health-scoring`            | Client Success | Real-time project health scoring and client transparency dashboards           | @successbot, @nina       |
| `client-escalation-protocol`        | Client Success | Structured escalation framework for at-risk clients and critical issues       | @hannah, @julian         |

---

## Methodology Skills (Reusable SOPs)

> Full SOP documents live at `.agent/skills/methodology/[skill-name]/SKILL.md`

| Methodology Handle                  | Description                                              |
| :---------------------------------- | :------------------------------------------------------- |
| `api-documentation-generator`       | Step-by-step API doc generation with OpenAPI             |
| `api-rate-limiter-design`           | Rate limiting design patterns                            |
| `content-preservation-protocol`     | Truth-lock and content verification protocol             |
| `css-architecture-refactor`         | CSS refactor methodology                                 |
| `database-migration-generator`      | Safe DB migration workflow                               |
| `database-schema-optimizer`         | Query and index optimization SOP                         |
| `deadline-tracking`                 | Deadline registry and escalation SOP                     |
| `dockerfile-optimization`           | Container optimization methodology                       |
| `environment-variable-manager`      | Environment variable management SOP                      |
| `error-handling-strategy`           | Error handling design patterns                           |
| `git-branch-strategy-advisor`       | Branch strategy advisory SOP                             |
| `git-commit-formatter`              | Conventional commit formatting SOP                       |
| `improvement-scanning`              | Continuous improvement scanning SOP                      |
| `integration-debugging-coordinator` | Cross-service debugging SOP                              |
| `memory-leak-detective`             | Memory profiling and leak resolution SOP                 |
| `performance-regression-debugger`   | Performance regression analysis SOP                      |
| `project-structure-initializer`     | New project scaffolding SOP                              |
| `react-component-test-generator`    | Component test generation SOP                            |
| `resource-management`               | Resource allocation and capacity SOP                     |
| `skills-matrix-gap-detection`       | Skills gap analysis SOP                                  |
| `team-deep-dive`                    | Team capability audit SOP                                |
| `test-driven-bug-fix`               | TDD bug resolution SOP                                   |
| `web-design-standards`              | Web design standards and guidelines                      |
| `web-performance-audit`             | Performance audit methodology                            |
| `llm-evaluation-harness`            | LLM quality regression harnesses and release gates       |
| `agent-observability-telemetry`     | Agent tracing, telemetry, and reliability diagnostics    |
| `mcp-gateway-operations`            | MCP gateway operations, auth, and rate policy            |
| `prompt-version-control`            | Prompt lifecycle, versioning, and rollback SOP           |
| `hallucination-detection-pipeline`  | Claim verification and hallucination detection workflows |
| `source-confidence-scoring`         | Source trust scoring and provenance SOP                  |
| `policy-as-code-guardrails`         | Codified action policies and enforcement SOP             |
| `agent-runbook-incident-response`   | Agent incident response and recovery SOP                 |
| `ai-agent-security-hardening`       | Agent security baseline and hardening SOP                |
| `skill-supply-chain-vetting`        | Skill/package intake security and trust checks           |
| `model-routing-optimization`        | Model routing policy and optimization SOP                |
| `synthetic-test-data-generator`     | Synthetic dataset generation and validation SOP          |
| `retrieval-quality-audit`           | RAG retrieval quality and chunking audit SOP             |
| `multimodal-content-qc`             | Cross-modal quality assurance SOP                        |
| `cost-anomaly-detection`            | Spend anomaly detection and escalation SOP               |
| `compliance-evidence-packager`      | Compliance evidence collection and packaging SOP         |
| `agent-memory-architecture`         | Agent memory lifecycle and retrieval architecture SOP    |
| `tool-contract-testing`             | Tool and schema contract testing SOP                     |
| `workflow-simulation-lab`           | Workflow simulation and preflight validation SOP         |
| `competitive-intel-signal-mining`   | Competitive signal extraction and tracking SOP           |
| `evidence-trace-graphing`           | Evidence graph construction and verification SOP         |
| `execution-risk-scoring`            | Action risk scoring and escalation SOP                   |
| `automation-rollback-orchestrator`  | Multi-workflow rollback coordination SOP                 |
| `conversion-funnel-diagnostics`     | Funnel diagnostics and optimization SOP                  |
| `design-system-drift-detection`     | Design system drift detection and correction SOP         |
| `context-window-optimization`       | Context optimization and retrieval packing SOP           |
| `prompt-caching-strategy`           | Prompt/response caching and invalidation SOP             |
| `inference-cost-profiler`           | Inference cost profiling and optimization SOP            |
| `api-contract-evolution-planner`    | API contract evolution and compatibility SOP             |
| `schema-drift-monitor`              | Schema drift monitoring and response SOP                 |
| `vector-index-lifecycle-manager`    | Vector index lifecycle governance SOP                    |
| `edge-runtime-optimization`         | Edge runtime performance optimization SOP                |
| `ci-pipeline-flakiness-hunter`      | CI flakiness detection and remediation SOP               |
| `dependency-risk-auditor`           | Dependency risk auditing and mitigation SOP              |
| `feature-flag-governance`           | Feature flag governance and cleanup SOP                  |
| `realtime-streaming-architecture`   | Realtime streaming architecture SOP                      |
| `data-pipeline-backfill-planner`    | Data backfill planning and safety SOP                    |
| `frontend-bundle-budget-enforcer`   | Frontend bundle budget enforcement SOP                   |
| `test-suite-prioritization`         | Test prioritization strategy SOP                         |
| `release-candidate-hardening`       | Release candidate hardening SOP                          |
| `market-sentiment-fusion`           | Market sentiment fusion and interpretation SOP           |
| `contradiction-detection-engine`    | Contradiction detection workflow SOP                     |
| `source-bias-audit`                 | Source bias auditing and correction SOP                  |
| `forecast-scenario-modeling`        | Scenario modeling and forecast quality SOP               |
| `narrative-gap-analysis`            | Narrative gap analysis and messaging SOP                 |
| `weak-signal-tracking`              | Weak-signal tracking and escalation SOP                  |
| `benchmark-intelligence-synthesis`  | Competitive benchmark synthesis SOP                      |
| `legal-change-monitoring`           | Legal change monitoring and impact SOP                   |
| `partner-landscape-mapping`         | Partner landscape mapping SOP                            |
| `decision-quality-retrospective`    | Decision quality retrospective SOP                       |
| `sla-slo-policy-management`         | SLA/SLO policy management SOP                            |
| `queue-backpressure-orchestration`  | Queue backpressure and scaling SOP                       |
| `incident-communication-protocol`   | Incident communication protocol SOP                      |
| `runbook-quality-audit`             | Runbook quality audit SOP                                |
| `chaos-testing-orchestration`       | Chaos testing orchestration SOP                          |
| `credential-rotation-automation`    | Credential rotation automation SOP                       |
| `backup-restore-validation`         | Backup and restore validation SOP                        |
| `change-impact-analysis`            | Change impact analysis SOP                               |
| `cross-team-handoff-standardizer`   | Cross-team handoff standardization SOP                   |
| `objective-kpi-tree-design`         | KPI tree design and governance SOP                       |
| `capacity-stress-testing`           | Capacity stress testing SOP                              |
| `governance-review-cadence`         | Governance review cadence SOP                            |
| `shadow-deployment-orchestration`   | Shadow deployment orchestration SOP                      |
| `rollback-readiness-check`          | Rollback readiness verification SOP                      |
| `postmortem-action-tracker`         | Postmortem action tracking SOP                           |
| `offer-positioning-lab`             | Offer positioning experimentation SOP                    |
| `pricing-experiment-orchestration`  | Pricing experiment orchestration SOP                     |
| `lifecycle-email-optimization`      | Lifecycle email optimization SOP                         |
| `audience-segmentation-strategy`    | Audience segmentation strategy SOP                       |
| `social-proof-experimentation`      | Social proof experimentation SOP                         |
| `ux-friction-heatmapping`           | UX friction heatmapping and prioritization SOP           |
| `accessibility-first-prototyping`   | Accessibility-first prototyping SOP                      |
| `brand-message-consistency-audit`   | Brand message consistency audit SOP                      |
| `design-token-governance`           | Design token governance SOP                              |
| `motion-system-rationalization`     | Motion system rationalization SOP                        |
| `canvas-design`                     | Canvas and Figma design system SOP                       |
| `theme-factory`                     | Design token generation and theme system SOP             |
| `mcp-builder`                       | Custom MCP server scaffolding and build SOP              |
| `football-value-betting`            | Football value betting and tactical analysis SOP         |
| `horse-racing-form-analysis`        | Horse racing form and handicap analysis SOP              |
| `roulette-probability-engine`       | Roulette probability modeling and edge calculation SOP   |
| `lay-back-arbitrage`                | Lay-back arbitrage strategy SOP                          |
| `f1-strategy-analysis`              | Formula 1 race strategy and betting intelligence SOP     |
| `darts-checkout-calculator`         | Darts checkout probability and tournament form SOP       |
| `motogp-race-analysis`              | MotoGP race analysis and betting line SOP                |
| `odds-movement-tracker`             | Odds movement detection and value timing SOP             |
| `multi-market-bet-coordination`     | Multi-market betting coordination and bankroll SOP       |
| `expected-value-calculator`         | EV and Kelly Criterion stake sizing SOP                  |
| `kpi-engineering-intake`            | KPI definition and intake interview SOP                  |
| `supabase-kpi-views`                | Supabase KPI view design and optimization SOP            |
| `dashboard-visual-hierarchy`        | Dashboard visual hierarchy and layout SOP                |
| `executive-scorecard-design`        | Executive scorecard design SOP                           |
| `five-second-clarity-test`          | Dashboard five-second clarity test SOP                   |
| `realtime-dashboard-subscriptions`  | Realtime dashboard subscription design SOP               |
| `curriculum-backwards-design`       | Curriculum backwards design from outcomes SOP            |
| `pilot-cohort-protocol`             | Pilot cohort design and iteration SOP                    |
| `module-completion-optimization`    | Course module engagement optimization SOP                |
| `platform-selection-matrix`         | Course platform selection and evaluation SOP             |
| `assessment-design-framework`       | Assessment and quiz design SOP                           |
| `course-sales-funnel-design`        | Course sales funnel architecture SOP                     |
| `glasbox-onboarding-flow`           | Glass Box client onboarding and setup SOP                |
| `churn-risk-detection`              | Client churn risk detection and intervention SOP         |
| `nps-collection-automation`         | NPS automation and escalation routing SOP                |
| `client-status-report-generation`   | Client status report generation SOP                      |
| `project-health-scoring`            | Project health scoring and transparency SOP              |
| `client-escalation-protocol`        | Client escalation protocol SOP                           |

---

## Adding New Skills

To add a new skill to the catalog:

1. Create the SOP document at `.agent/skills/methodology/[skill-handle]/SKILL.md`
2. Add an entry to the registry table above (correct domain, owned by)
3. Update the `allowed_tools` YAML field for the owning agent(s)
4. Run `python execution/sync_skill_catalog.py` to push the updated catalog to the Shared Brain `skills` table

---

## Using the jonnyai-mcp to Query Skills

The Antigravity Brain MCP (`jonnyai-mcp`) can be used to query this catalog:

```
Tool: query_brain
Query: "what skills are available for database work?"
```

The Shared Brain indexes all agent `philosophy` columns (SKILL.md content), so querying for a capability will return the agents and skills that handle it.

---

_Jai.OS 5.0 | The Antigravity Orchestra | Last Updated: 2026-02-23_
