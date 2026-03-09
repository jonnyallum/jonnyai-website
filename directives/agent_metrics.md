---
description: CLV-style performance tracking for all Antigravity agents. Defines universal metrics, targets, and review cadence.
---

# Agent Performance Metrics (Jai.OS 5.0)

Every agent is measured. Metrics drive Training Days, promotions, and skill gap detection.

---

## 📊 Universal Metrics (All Agents)

| Metric                     | Definition                                         | Target | Logged In             |
| :------------------------- | :------------------------------------------------- | :----- | :-------------------- |
| **Task Success Rate**      | % of assigned tasks completed without rollback     | ≥90%   | `agent-health.json`   |
| **Quality Gate Pass Rate** | % of outputs passing @Vigil/@Sam review first time | ≥85%   | `agent-health.json`   |
| **Handoff Clarity**        | % of NEXT_HOP packets with valid PAYLOAD_PATH      | 100%   | `chatroom.md` audit   |
| **Learning Velocity**      | New learnings logged per sprint (2-week cycle)     | ≥2     | SKILL.md Learning Log |
| **Collaboration Score**    | # of successful cross-agent handoffs per sprint    | ≥3     | `task-history.json`   |

---

## 🎯 Tier-Specific Metrics

### Development Tier (@Sebastian, @Diana, @Steve, @Adrian, @Owen, @Derek, @Sam, @Milo)

| Metric                 | Target                            |
| :--------------------- | :-------------------------------- |
| Build Success Rate     | ≥95% (zero broken builds shipped) |
| Code Review Turnaround | <2 hours from NEXT_HOP assignment |
| Test Coverage          | ≥80% on critical paths            |

### Design & Creative Tier (@Priya, @Vivienne, @Blaise, @Elena)

| Metric                          | Target                        |
| :------------------------------ | :---------------------------- |
| Client Revision Rounds          | ≤2 rounds to approval         |
| Aesthetic Score (self-assessed) | ≥8/10 per delivery            |
| Brand Consistency               | 100% adherence to style guide |

### Growth & Marketing Tier (@Felix, @Grace, @Carlos, @Maya)

| Metric                | Target                       |
| :-------------------- | :--------------------------- |
| Conversion Impact     | Measurable uplift per sprint |
| SEO Score Improvement | ≥5 points per audit cycle    |
| Analytics Coverage    | 100% of pages tracked        |

### Betting Ecosystem Tier (@Gareth, @Monty, @Sterling, @Pietro, @Terry, @Harry, @Daniel, @Redeye)

| Metric              | Target                           |
| :------------------ | :------------------------------- |
| Prediction Accuracy | ≥60% edge-positive selections    |
| ROI per Sprint      | Positive net return              |
| Risk Management     | Zero breaches of bankroll limits |

### Education Tier (@Coursewright)

| Metric                 | Target   |
| :--------------------- | :------- |
| Course Completion Rate | ≥70%     |
| Student NPS            | ≥8/10    |
| Time to First Value    | <2 hours |

---

## 📅 Review Cadence

| Review                      | Frequency      | Owner            | Action                                             |
| :-------------------------- | :------------- | :--------------- | :------------------------------------------------- |
| **Sprint Review**           | Every 2 weeks  | @Marcus          | Review metrics, flag underperformers               |
| **Training Day**            | Monthly        | @Marcus + @Vigil | Deep audit, skill gap detection, parallel learning |
| **Quarterly Retrospective** | Every 3 months | @Jonny + @Marcus | Strategic realignment, agent promotions/retirement |

---

## 🔄 Self-Assessment Protocol

After every major task, agents self-score:

```
SPEED:      [1-10] How fast was delivery?
QUALITY:    [1-10] How clean was the output?
INNOVATION: [1-10] Did I introduce a novel approach?
```

Logged in SKILL.md Learning Log with `SCORE:` field.

---

_Jai.OS 5.0 | The Antigravity Orchestra | Performance-Driven Culture_
