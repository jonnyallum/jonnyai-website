"""
execution/local_router.py
Antigravity Local LLM Router — @Theo (The Architect)

Decides: can this task be handled by Ollama on pi-llm-01, or does it need Claude API?
"""
from __future__ import annotations
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional


class TaskType(str, Enum):
    # ALWAYS LOCAL
    ROUTING_DECISION    = "routing_decision"
    TASK_CLASSIFICATION = "task_classification"
    PRE_CHECK           = "pre_check"
    INTENT_PARSE        = "intent_parse"
    TASK_DECOMPOSITION  = "task_decomposition"
    BINARY_DECISION     = "binary_decision"
    FIELD_EXTRACTION    = "field_extraction"
    FORMAT_CHECK        = "format_check"
    # HYBRID
    SUMMARIZATION       = "summarization"
    CODE_REVIEW_SIMPLE  = "code_review_simple"
    COPY_EDITING        = "copy_editing"
    # ALWAYS CLAUDE
    CODE_GENERATION     = "code_generation"
    ARCHITECTURE        = "architecture"
    CREATIVE_WRITING    = "creative_writing"
    DEBUGGING           = "debugging"
    RESEARCH            = "research"
    LEGAL_COMPLIANCE    = "legal_compliance"
    FINANCIAL_ANALYSIS  = "financial_analysis"
    UNKNOWN             = "unknown"


LOCAL_TOKEN_HARD_LIMIT = 800
COMPLEXITY_SCORE_LIMIT = 6

ALWAYS_LOCAL: set[TaskType] = {
    TaskType.ROUTING_DECISION, TaskType.TASK_CLASSIFICATION,
    TaskType.PRE_CHECK, TaskType.INTENT_PARSE,
    TaskType.BINARY_DECISION, TaskType.FIELD_EXTRACTION,
    TaskType.FORMAT_CHECK,
}

ALWAYS_CLAUDE: set[TaskType] = {
    TaskType.CODE_GENERATION, TaskType.ARCHITECTURE,
    TaskType.CREATIVE_WRITING, TaskType.DEBUGGING,
    TaskType.RESEARCH, TaskType.LEGAL_COMPLIANCE,
    TaskType.FINANCIAL_ANALYSIS, TaskType.UNKNOWN,
}


@dataclass
class LocalTask:
    task_type:         TaskType
    prompt:            str
    token_budget:      int = 512
    agent_caller:      str = "unknown"
    production_flag:   bool = False
    requires_context:  bool = False
    custom_complexity: Optional[int] = None
    metadata:          dict = field(default_factory=dict)


@dataclass
class RoutingDecision:
    use_local:        bool
    model:            str
    reason:           str
    complexity_score: int
    estimated_tps:    float
    escalation_risk:  str
    local_url:        str = "http://pi-llm-01.local:11434"
    fallback_model:   str = "claude-sonnet-4-6"


def score_complexity(prompt: str, task_type: TaskType) -> int:
    score = 0
    text  = prompt.lower()
    words = len(prompt.split())

    if words > 300:   score += 3
    elif words > 150: score += 2
    elif words > 50:  score += 1

    complexity_signals = [
        (["architect", "design", "system", "infrastructure"],      2),
        (["debug", "root cause", "trace", "why is"],               2),
        (["write code", "implement", "build", "create function"],   3),
        (["analyse", "analyze", "evaluate", "compare", "critique"], 2),
        (["legal", "compliance", "gdpr", "contract"],               3),
        (["financial", "revenue", "p&l", "forecast"],               3),
        (["creative", "brand", "story", "narrative"],               2),
        (["research", "investigate", "synthesize"],                 2),
    ]
    for signals, weight in complexity_signals:
        if any(s in text for s in signals):
            score += weight

    simple_signals = [
        ["yes or no", "true or false", "which agent", "route to"],
        ["classify", "categorise", "categorize", "label"],
        ["extract", "parse", "find the", "what is the"],
        ["validate", "check if", "is this", "does this"],
    ]
    for signals in simple_signals:
        if any(s in text for s in signals):
            score = max(0, score - 1)

    base = {
        TaskType.ROUTING_DECISION: 0, TaskType.BINARY_DECISION: 0,
        TaskType.PRE_CHECK: 1, TaskType.FIELD_EXTRACTION: 1,
        TaskType.FORMAT_CHECK: 1, TaskType.INTENT_PARSE: 1,
        TaskType.TASK_CLASSIFICATION: 1, TaskType.TASK_DECOMPOSITION: 2,
        TaskType.SUMMARIZATION: 3, TaskType.COPY_EDITING: 3,
        TaskType.CODE_REVIEW_SIMPLE: 4, TaskType.CODE_GENERATION: 7,
        TaskType.DEBUGGING: 7, TaskType.ARCHITECTURE: 8,
        TaskType.RESEARCH: 7, TaskType.CREATIVE_WRITING: 6,
        TaskType.LEGAL_COMPLIANCE: 8, TaskType.FINANCIAL_ANALYSIS: 8,
        TaskType.UNKNOWN: 6,
    }
    return min(10, score + base.get(task_type, 3))


def select_local_model(task_type: TaskType, complexity: int, token_budget: int) -> tuple[str, float]:
    if task_type in (TaskType.BINARY_DECISION, TaskType.ROUTING_DECISION) and complexity <= 1:
        return "tinyllama", 25.0
    if complexity <= 3 and token_budget <= 300:
        return "qwen2.5:1.5b", 20.0
    if complexity <= 4 and token_budget <= 500:
        return "gemma2:2b", 15.0
    if complexity <= 5:
        return "phi3:mini", 11.0
    return "qwen2.5:1.5b", 20.0


def route_task(task: LocalTask) -> RoutingDecision:
    """Core router. Returns RoutingDecision with use_local bool and model selection."""
    if task.production_flag:
        return RoutingDecision(False, "claude-sonnet-4-6",
            "Production flag set — using Claude for reliability", 10, 0, "high")

    if task.task_type in ALWAYS_CLAUDE:
        return RoutingDecision(False, "claude-sonnet-4-6",
            f"Task type '{task.task_type.value}' requires Claude API",
            score_complexity(task.prompt, task.task_type), 0, "high")

    if task.task_type in ALWAYS_LOCAL:
        c = task.custom_complexity or score_complexity(task.prompt, task.task_type)
        m, tps = select_local_model(task.task_type, c, task.token_budget)
        return RoutingDecision(True, m,
            f"Task type '{task.task_type.value}' is always handled locally", c, tps, "low")

    if task.token_budget > LOCAL_TOKEN_HARD_LIMIT:
        return RoutingDecision(False, "claude-sonnet-4-6",
            f"Token budget {task.token_budget} exceeds local limit {LOCAL_TOKEN_HARD_LIMIT}",
            score_complexity(task.prompt, task.task_type), 0, "medium")

    if task.requires_context:
        return RoutingDecision(False, "claude-sonnet-4-6",
            "Task requires long context window — escalating",
            score_complexity(task.prompt, task.task_type), 0, "medium")

    c = task.custom_complexity or score_complexity(task.prompt, task.task_type)
    if c >= COMPLEXITY_SCORE_LIMIT:
        return RoutingDecision(False, "claude-sonnet-4-6",
            f"Complexity score {c}/10 exceeds threshold {COMPLEXITY_SCORE_LIMIT}",
            c, 0, "medium" if c < 8 else "high")

    m, tps = select_local_model(task.task_type, c, task.token_budget)
    return RoutingDecision(True, m,
        f"Complexity {c}/10, budget {task.token_budget} tokens — within local capability",
        c, tps, "low")
