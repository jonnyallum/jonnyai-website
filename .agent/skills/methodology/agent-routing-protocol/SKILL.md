---
# Methodology Skill Card — Jai.OS 5.0
name: "agent-routing-protocol"
version: "1.0.0"
type: methodology
description: "Agent Routing Protocol (AgOS 3.0)"
category: betting
complexity: high
domains: ["ai", "analytics", "automation", "backend", "web"]
updated: "2026-03-01"
---
## Description

Protocol for intelligent routing of tasks to the correct agent based on domain, capability, and workload.

## Implementation Instructions

See the detailed routing matrix and decision tree below.

# Agent Routing Protocol (AgOS 3.0)
> *"Every agent was created for a reason. Use them all."*

---

## The Delegation Mandate

**Rule**: Before acting on ANY task, @Conductor MUST:
1. Analyze the task domain
2. Identify ALL relevant specialists
3. Route to the MOST specialized agent
4. Never default to generic "I'll handle it" mode

---

## Domain → Agent Routing Matrix

### 🗄️ Database & API Issues

| Symptom | Primary Agent | Secondary Agents | Rationale |
|:--------|:--------------|:-----------------|:----------|
| Supabase API errors (PGRST###) | **@Steve** | @Diana, @Sebastian | Steve specializes in PostgREST |
| Database schema design | **@Diana** | @Steve, @Sebastian | Diana owns schema architecture |
| RLS policy issues | **@Steve** | @Diana, @Sam | Steve knows Supabase RLS + API interaction |
| SQL optimization | **@Diana** | @Steve | Diana is the SQL expert |
| Migration failures | **@Diana** | @Steve, @Derek | Diana owns migrations |

### 🎨 Frontend & Design

| Symptom | Primary Agent | Secondary Agents | Rationale |
|:--------|:--------------|:-----------------|:----------|
| UI/UX design | **@Priya** | @Nina | Priya is "The Perfectionist" |
| Component architecture | **@Sebastian** | @Priya | Sebastian owns React architecture |
| Animation/Framer Motion | **@Priya** | @Sebastian | Priya specializes in motion |
| Responsive design | **@Priya** | @Sebastian | Priya owns visual polish |
| Accessibility issues | **@Priya** | @Sam | Priya + Sam for WCAG compliance |

### 🔒 Security & Authentication

| Symptom | Primary Agent | Secondary Agents | Rationale |
|:--------|:--------------|:-----------------|:----------|
| Auth flow issues | **@Sam** | @Steve, @Victor | Sam is "The Gatekeeper" |
| API key management | **@Victor** | @Sam | Victor is "The Locksmith" |
| OAuth configuration | **@Steve** | @Sam, @Victor | Steve knows Supabase Auth |
| Security audits | **@Sam** | @Victor, @Luna | Sam owns security gates |
| GDPR/compliance | **@Luna** | @Sam | Luna is "The Shield" |

### 🚀 Deployment & Infrastructure

| Symptom | Primary Agent | Secondary Agents | Rationale |
|:--------|:--------------|:-----------------|:----------|
| Hostinger deployment | **@Owen** | @Derek | Owen is "The Hornet" |
| CI/CD pipeline | **@Owen** | @Alex, @Derek | Owen owns zero-downtime shipping |
| Environment variables | **@Derek** | @Victor | Derek is "The Engine" |
| Build failures | **@Daniel** | @Owen, @Sebastian | Daniel is "The Detective" |
| Cloud hosting | **@Derek** | @Owen | Derek owns infrastructure |

### 📱 Mobile Development

| Symptom | Primary Agent | Secondary Agents | Rationale |
|:--------|:--------------|:-----------------|:----------|
| React Native issues | **@Sebastian** | @Daniel | Sebastian owns React |
| Android build errors | **@Daniel** | @Sebastian | Daniel is mobile specialist |
| iOS build errors | **@Daniel** | @Sebastian | Daniel debugs native builds |
| Expo configuration | **@Daniel** | @Sebastian | Daniel knows Expo internals |

### 📈 Growth & Marketing

| Symptom | Primary Agent | Secondary Agents | Rationale |
|:--------|:--------------|:-----------------|:----------|
| SEO optimization | **@Grace** | @Elena | Grace is "The Ranker" |
| Copywriting | **@Elena** | @Rowan | Elena is "The Voice" |
| Content strategy | **@Rowan** | @Elena, @Nina | Rowan is "The Beast" |
| Video editing | **@Carlos** | @Blaise | Carlos is "The Hook" |
| Funnel design | **@Blaise** | @Felix, @Maya | Blaise is "The Funnel" |
| Monetization strategy | **@Felix** | @Blaise, @Maya | Felix is "The Alchemist" |
| Analytics/tracking | **@Maya** | @Blaise | Maya is "The Oracle" |

### 🔍 Research & Intelligence

| Symptom | Primary Agent | Secondary Agents | Rationale |
|:--------|:--------------|:-----------------|:----------|
| Web research | **@Sophie** | @Patrick | Sophie is "The Hawk" |
| Data extraction | **@Patrick** | @Sophie | Patrick is "The Surgeon" |
| Competitor analysis | **@Jasper** | @Sophie | Jasper is "The Tracker" |
| Documentation | **@Arthur** | @Rowan | Arthur is "The Librarian" |

### 🤖 Automation & Tools

| Symptom | Primary Agent | Secondary Agents | Rationale |
|:--------|:--------------|:-----------------|:----------|
| Workflow automation | **@Alex** | @Mason | Alex is "The Machine" |
| MCP server integration | **@Adrian** | @Mason | Adrian is "The Welder" |
| Tool discovery | **@Mason** | @Adrian, @Alex | Mason is "The Bridgemaster" |
| Script creation | **@Alex** | @Sebastian | Alex owns automation |

### 🎰 Specialized Domains

| Domain | Primary Agent | Notes |
|:-------|:--------------|:------|
| Sports betting | **@Sterling** | "The Odds Engineer" |
| Football analysis | **@Gareth** | "The Tactician" |
| Horse racing | **@Harry** | "The Form Master" |
| Formula 1 | **@Pietro** | "The Strategist" |
| MotoGP | **@Julian** | "The Doctor" |
| Darts | **@Terry** | "The 180 King" |
| Roulette | **@Monty** | "The Mathematician" |
| Dropshipping | **@Winston** | "Whiz" |
| Trading systems | **@Trotter** | "The Trader" |
| Project initialization | **@Genesis** | "The Cloner" |

---

## Routing Decision Tree

### Step 1: Identify Primary Domain
```
Is this a:
├─ Database/API issue? → Check Database Matrix
├─ Frontend/Design issue? → Check Frontend Matrix
├─ Security issue? → Check Security Matrix
├─ Deployment issue? → Check Deployment Matrix
├─ Mobile issue? → Check Mobile Matrix
├─ Growth/Marketing? → Check Growth Matrix
├─ Research needed? → Check Research Matrix
├─ Automation needed? → Check Automation Matrix
└─ Specialized domain? → Check Specialized Matrix
```

### Step 2: Route to Specialist
```
1. Identify PRIMARY agent from matrix
2. Identify SECONDARY agents for collaboration
3. Check agent's SKILL.md for current capabilities
4. Assign task with clear deliverables
5. Set up handoff protocol with secondary agents
```

### Step 3: Multi-Domain Tasks
```
If task spans multiple domains:
1. Break into subtasks by domain
2. Assign each subtask to domain specialist
3. Define handoff points between agents
4. Set @Conductor as orchestrator
5. Create task dependency map
```

---

## Routing Examples

### Example 1: "Website form not working"
**Analysis**:
- Frontend issue? Check UI
- API issue? Check network
- Database issue? Check data layer

**Routing**:
1. **@Sebastian**: Verify frontend code
2. **@Steve**: Check Supabase API (if Supabase involved)
3. **@Diana**: Verify database schema
4. **@Sam**: Check auth if login-related

**Orchestration**: @Conductor coordinates handoffs

### Example 2: "Need to improve SEO"
**Analysis**: Growth/Marketing domain

**Routing**:
1. **@Grace**: Primary - SEO strategy
2. **@Elena**: Secondary - Meta descriptions and copy
3. **@Rowan**: Tertiary - Content depth

### Example 3: "Build failing on Android"
**Analysis**: Mobile domain

**Routing**:
1. **@Daniel**: Primary - Mobile build specialist
2. **@Sebastian**: Secondary - React Native architecture
3. **@Owen**: Tertiary - CI/CD if pipeline issue

---

## Anti-Patterns (What NOT to Do)

### ❌ Generic Routing
```
USER: "The database isn't working"
BAD: "Let me check the database..."
GOOD: "Routing to @Diana (database specialist) and @Steve (Supabase specialist)"
```

### ❌ Single-Agent Bias
```
USER: "We need to deploy and fix SEO"
BAD: "I'll handle both..."
GOOD: "@Owen for deployment, @Grace for SEO, @Conductor orchestrating"
```

### ❌ Ignoring Specialists
```
USER: "Supabase API returning 404"
BAD: "Let me debug the API..."
GOOD: "@Steve - this is a PostgREST issue, your domain"
```

---

## Conductor's Routing Checklist

Before acting on ANY task:
- [ ] What is the primary domain?
- [ ] Who is the specialist for this domain?
- [ ] Have I checked their SKILL.md?
- [ ] Are there secondary agents needed?
- [ ] Is this a multi-domain task requiring orchestration?
- [ ] Have I documented the routing decision?

---

## Routing Accountability

### Metrics to Track
1. **Specialist Utilization Rate**: % of tasks routed to correct specialist
2. **First-Time Resolution**: % of tasks solved by first agent assigned
3. **Routing Time**: Time from task receipt to specialist assignment
4. **Agent Idle Rate**: % of agents never utilized

### Target KPIs
- Specialist Utilization: >90%
- First-Time Resolution: >80%
- Routing Time: <2 minutes
- Agent Idle Rate: <10%

---

## Learning Loop

After every task:
1. **Did we route correctly?** If not, why?
2. **Was there a specialist we missed?** Update matrix
3. **Did the agent have the right skills?** Update SKILL.md
4. **Could we have been faster?** Optimize routing logic

---

*Protocol Version: 1.0*  
*Created: 2026-02-05*  
*Owner: @Marcus (Conductor)*  
*Review Cycle: Monthly*


## Constraints

- **DO NOT** route tasks to agents outside their declared domain expertise.
- **ALWAYS** check agent availability and circuit breaker status before routing.
- **DO NOT** bypass the routing protocol for convenience — all tasks must be formally routed.
