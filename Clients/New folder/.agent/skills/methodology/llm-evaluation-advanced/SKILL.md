---
name: llm-evaluation-advanced
version: "1.0"
description: >
  Production-grade LLM-as-Judge evaluation methodology. Covers direct scoring,
  pairwise comparison, position bias mitigation, rubric generation, confidence
  calibration, Panel of LLMs (PoLL), and hierarchical evaluation strategies.
domain: ai-quality
owner: vigil
triggers:
  - evaluating LLM outputs automatically
  - comparing model responses
  - creating evaluation rubrics
  - mitigating evaluation bias
  - A/B testing prompts or models
  - building evaluation pipelines
  - assessing output quality at scale
source: sickn33/antigravity-awesome-skills (adapted for Jai.OS 5.0)
---

# Advanced LLM Evaluation (LLM-as-Judge)

> **Owner:** @Vigil (Truth Verification)
> **Consumers:** @Qualityguard, @Validator, @Sam, @Scholar
> **Related:** `llm-evaluation-harness`, `hallucination-detection-pipeline`, `contradiction-detection-engine`
> **Extends:** `llm-evaluation-harness` (foundational) — this adds operational depth

## Overview

Production-grade techniques for evaluating LLM outputs using LLMs as judges. LLM-as-Judge is a **family of approaches**, each suited to different evaluation contexts. Choosing the right approach and mitigating known biases is the core competency.

---

## Evaluation Taxonomy

### Direct Scoring

A single LLM rates one response on a defined scale.

- **Best for:** Objective criteria (factual accuracy, instruction following, format compliance)
- **Reliability:** Moderate to high for well-defined criteria
- **Failure mode:** Score calibration drift, inconsistent scale interpretation

### Pairwise Comparison

An LLM compares two responses and selects the better one.

- **Best for:** Subjective preferences (tone, style, persuasiveness, creativity)
- **Reliability:** Higher than direct scoring for preferences
- **Failure mode:** Position bias, length bias

### Decision Framework

```
Is there an objective ground truth?
├── Yes → Direct Scoring
│   └── Examples: factual accuracy, instruction following, format compliance
└── No → Is it a preference or quality judgment?
    ├── Yes → Pairwise Comparison
    │   └── Examples: tone, style, persuasiveness, creativity
    └── No → Reference-based evaluation
        └── Examples: summarization, translation
```

---

## Known Biases (Must Mitigate)

| Bias | Description | Mitigation |
|------|-------------|------------|
| **Position Bias** | First-position responses get preferential treatment | Evaluate twice with swapped positions, majority vote |
| **Length Bias** | Longer responses rated higher regardless of quality | Explicit prompting to ignore length, length-normalized scoring |
| **Self-Enhancement** | Models rate their own outputs higher | Use different models for generation vs evaluation |
| **Verbosity Bias** | Detailed explanations scored higher even when unnecessary | Criteria-specific rubrics penalizing irrelevant detail |
| **Authority Bias** | Confident tone rated higher regardless of accuracy | Require evidence citation, fact-checking layer |

---

## Direct Scoring Implementation

### Requirements

1. **Clear criteria** with descriptions and weights
2. **Calibrated scale** (1-3 binary+neutral, 1-5 Likert standard, 1-10 only with detailed rubrics)
3. **Structured output format** (JSON with scores, justifications, improvements)

### Chain-of-Thought Requirement

**Always require justification BEFORE scores.** Research shows this improves reliability by 15-25% compared to score-first approaches.

### Prompt Structure

```
You are an expert evaluator assessing response quality.

## Original Prompt
{prompt}

## Response to Evaluate
{response}

## Criteria
{for each: name, description, weight}

## Instructions
For each criterion:
1. Find specific evidence in the response
2. Score according to the rubric (1-{max} scale)
3. Justify your score with evidence
4. Suggest one specific improvement

## Output Format
JSON with scores, justifications, and summary.
```

---

## Pairwise Comparison Implementation

### Position Bias Mitigation Protocol (Mandatory)

1. **First pass:** Response A in first position, Response B in second
2. **Second pass:** Response B in first position, Response A in second
3. **Consistency check:** If passes disagree → return TIE with reduced confidence
4. **Final verdict:** Consistent winner with averaged confidence

**Single-pass comparison is corrupted by position bias. Never skip step 2.**

### Confidence Calibration

- Both passes agree: confidence = average of individual confidences
- Passes disagree: confidence = 0.5, verdict = TIE

### Prompt Structure

```
You are an expert evaluator comparing two AI responses.

## Critical Instructions
- Do NOT prefer responses because they are longer
- Do NOT prefer responses based on position (first vs second)
- Focus ONLY on quality according to the specified criteria
- Ties are acceptable when responses are genuinely equivalent

## Original Prompt
{prompt}

## Response A
{response_a}

## Response B
{response_b}

## Comparison Criteria
{criteria}

## Instructions
1. Analyze each response independently first
2. Compare on each criterion
3. Determine overall winner with confidence level

## Output Format
JSON with per-criterion comparison, overall winner, confidence (0-1), reasoning.
```

---

## Rubric Generation

Well-defined rubrics reduce evaluation variance by **40-60%**.

### Rubric Components

1. **Level descriptions** — Clear boundaries for each score level
2. **Characteristics** — Observable features defining each level
3. **Examples** — Representative text for each level (optional but valuable)
4. **Edge cases** — Guidance for ambiguous situations
5. **Scoring guidelines** — General principles for consistent application

### Strictness Calibration

- **Lenient:** Lower bar, encouraging iteration
- **Balanced:** Fair production expectations
- **Strict:** High standards for safety-critical evaluation

### Domain Adaptation

Rubrics must use **domain-specific terminology**. A "code readability" rubric mentions variables, functions, comments. A "medical accuracy" rubric references clinical evidence standards.

---

## Scaling Evaluation

### 1. Panel of LLMs (PoLL)

Use multiple models as judges, aggregate votes.

- Reduces individual model bias
- More expensive but more reliable for high-stakes decisions
- Recommended for quality gates on production deployments

### 2. Hierarchical Evaluation

Fast cheap model for screening, expensive model for edge cases.

- Cost-effective for large volumes
- Requires calibration of screening threshold

### 3. Human-in-the-Loop

Automated evaluation for clear cases, human review for low-confidence.

- Best reliability for critical applications
- Design feedback loop to improve automated evaluation over time

---

## Metric Selection

| Task Type | Primary Metrics | Secondary |
|-----------|----------------|-----------|
| Binary (pass/fail) | Recall, Precision, F1 | Cohen's κ |
| Ordinal (1-5) | Spearman's ρ, Kendall's τ | Cohen's κ (weighted) |
| Pairwise preference | Agreement rate, Position consistency | Confidence calibration |
| Multi-label | Macro-F1, Micro-F1 | Per-label precision/recall |

**Key insight:** High absolute agreement matters less than systematic disagreement patterns. A judge consistently wrong on specific criteria is worse than random noise.

---

## Common Anti-Patterns

| Anti-Pattern | Problem | Solution |
|-------------|---------|----------|
| Scoring without justification | Scores lack grounding, hard to debug | Always require evidence before score |
| Single-pass pairwise | Position bias corrupts results | Always swap positions + consistency check |
| Overloaded criteria | Multi-aspect criteria unreliable | One criterion = one measurable aspect |
| Missing edge case guidance | Ambiguous cases handled inconsistently | Include edge cases in rubrics |
| Ignoring confidence | High-confidence wrong is worse | Calibrate to consistency + evidence |

---

## Integration with Truth-Lock System

This methodology directly supports @Vigil's Truth-Lock verification:

1. **Pre-deployment evaluation:** Run pairwise comparison on candidate vs current production output
2. **Quality gate enforcement:** Direct scoring with strict rubrics blocks substandard output
3. **Continuous monitoring:** Hierarchical evaluation catches quality drift
4. **Training Day audits:** PoLL evaluations identify agents needing capability upgrades

---

## Validation Checklist

Before considering evaluation complete:

- [ ] Correct approach selected (direct vs pairwise vs reference-based)
- [ ] Criteria are single-aspect and clearly defined
- [ ] Rubric levels have distinct boundaries
- [ ] Position bias mitigated (pairwise: both passes run)
- [ ] Confidence scores calibrated to consistency
- [ ] Edge cases documented in rubric
- [ ] Results validated against human judgments (when available)

---

## References

- [MT-Bench — Judging LLM-as-Judge (Zheng et al., 2023)](https://arxiv.org/abs/2306.05685)
- [G-Eval: NLG Evaluation using GPT-4 (Liu et al., 2023)](https://arxiv.org/abs/2303.16634)
- [Large Language Models are not Fair Evaluators (Wang et al., 2023)](https://arxiv.org/abs/2305.17926)

---

## Learning Log

| Date | Learning | Source |
|:--|:--|:--|
| 2026-03-09 | Integrated from `sickn33/antigravity-awesome-skills` advanced-evaluation skill | Awesome Skills Evaluation Phase 2 |
