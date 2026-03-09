"""
execution/call_local_llm.py
Direct HTTP call to pi-llm-01 Ollama — no MCP dependency.
Use from execution scripts and orchestration.
"""
import requests

OLLAMA_PI_URL = "http://pi-llm-01.local:11434"


def ask_local(
    prompt: str,
    system: str = "",
    model: str = "qwen2.5:1.5b",
    temperature: float = 0.0,
    max_tokens: int = 200,
) -> str:
    """
    Call local Ollama on pi-llm-01. Returns response text or raises on failure.
    """
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    resp = requests.post(
        f"{OLLAMA_PI_URL}/api/chat",
        json={
            "model":    model,
            "messages": messages,
            "stream":   False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
                "num_ctx":     2048,
            },
        },
        timeout=45,
    )
    resp.raise_for_status()
    return resp.json()["message"]["content"].strip()


def smart_complete(
    prompt: str,
    system: str = "",
    token_budget: int = 400,
    task_type_str: str = "unknown",
) -> str:
    """
    Route-aware completion: try Ollama first, fall back to Claude API.
    Requires ANTHROPIC_API_KEY in environment.
    """
    import logging
    from execution.local_router import route_task, LocalTask, TaskType
    import anthropic

    logger = logging.getLogger(__name__)

    try:
        task_type = TaskType(task_type_str)
    except ValueError:
        task_type = TaskType.UNKNOWN

    decision = route_task(LocalTask(
        task_type=task_type,
        prompt=prompt,
        token_budget=token_budget,
    ))

    if decision.use_local:
        try:
            return ask_local(
                prompt=prompt,
                system=system,
                model=decision.model,
                temperature=0.0,
                max_tokens=token_budget,
            )
        except Exception as e:
            logger.warning(f"Ollama failed ({e}), falling back to Claude API")

    client = anthropic.Anthropic()
    msg = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=token_budget,
        system=system,
        messages=[{"role": "user", "content": prompt}],
    )
    return msg.content[0].text
