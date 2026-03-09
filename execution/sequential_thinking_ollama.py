"""
sequential_thinking_ollama.py — Sequential Thinking via Ollama
================================================================
Jai.OS 5.0 | Bridges the MCP Sequential Thinking pattern with
the local Ollama llama3:8b model on the VM.

Implements the same structured thinking process as
@modelcontextprotocol/server-sequential-thinking but uses
Ollama for inference instead of Claude.

Usage:
  python sequential_thinking_ollama.py "How should we architect the n8n automation pipeline?"
  python sequential_thinking_ollama.py --file problem.txt
  python sequential_thinking_ollama.py --interactive

Can also be imported:
  from sequential_thinking_ollama import SequentialThinker
  thinker = SequentialThinker()
  result = thinker.think("Break down the problem of...")
"""

import sys
import os
import json
import argparse
import requests
from datetime import datetime

# ── Configuration ─────────────────────────────────────────────────────────────

OLLAMA_BASE = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3:8b")


class SequentialThinker:
    """Implements the MCP Sequential Thinking pattern using Ollama."""

    def __init__(self, model=None, base_url=None):
        self.model = model or OLLAMA_MODEL
        self.base_url = base_url or OLLAMA_BASE
        self.thoughts = []
        self.branches = {}
        self.current_branch = "main"

    def _call_ollama(self, prompt, system=None):
        """Call the Ollama API for a single completion."""
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.7, "num_predict": 500}
        }
        if system:
            payload["system"] = system

        try:
            resp = requests.post(
                f"{self.base_url}/api/generate",
                json=payload,
                timeout=120
            )
            if resp.status_code == 200:
                return resp.json().get("response", "").strip()
            return f"[Ollama error: {resp.status_code}]"
        except Exception as e:
            return f"[Ollama connection error: {e}]"

    def think(self, problem, max_thoughts=5):
        """Run a full sequential thinking session on a problem."""
        self.thoughts = []
        self.branches = {"main": []}

        system_prompt = """You are a structured sequential thinker. 
Your job is to break down complex problems step by step.
For each thought:
1. State what you're analyzing
2. Provide your reasoning
3. Indicate if you need to revise or branch
4. Suggest if more thoughts are needed

Be concise but thorough. Each thought should build on previous ones."""

        # Thought 1: Initial analysis
        prompt = f"""Problem: {problem}

This is thought 1 of approximately {max_thoughts}.
Break down this problem. What are the key components?
Respond with your analysis."""

        thought1 = self._call_ollama(prompt, system_prompt)
        self._record_thought(1, thought1, max_thoughts)

        # Subsequent thoughts
        for i in range(2, max_thoughts + 1):
            context = "\n".join([
                f"Thought {t['number']}: {t['content'][:200]}"
                for t in self.thoughts
            ])

            prompt = f"""Problem: {problem}

Previous thoughts:
{context}

This is thought {i} of {max_thoughts}.
Build on the previous analysis. Go deeper or explore a new angle.
If you've reached a conclusion, state it clearly.
Respond with your analysis."""

            thought = self._call_ollama(prompt, system_prompt)
            needs_more = i < max_thoughts and "[NEEDS_MORE]" in thought
            self._record_thought(i, thought, max_thoughts, needs_more=needs_more)

        # Final synthesis
        all_thoughts = "\n".join([
            f"Thought {t['number']}: {t['content'][:300]}"
            for t in self.thoughts
        ])

        synthesis_prompt = f"""Problem: {problem}

All thoughts:
{all_thoughts}

Synthesize these thoughts into a clear, actionable conclusion.
What is the recommended approach? List specific next steps."""

        synthesis = self._call_ollama(synthesis_prompt, system_prompt)
        self._record_thought(max_thoughts + 1, f"[SYNTHESIS] {synthesis}", max_thoughts + 1, is_synthesis=True)

        return self.get_result()

    def _record_thought(self, number, content, total, is_revision=False,
                        revises=None, branch_from=None, branch_id=None,
                        needs_more=False, is_synthesis=False):
        """Record a thought in the thinking chain."""
        thought = {
            "number": number,
            "content": content,
            "total_thoughts": total,
            "is_revision": is_revision,
            "revises_thought": revises,
            "branch_from_thought": branch_from,
            "branch_id": branch_id or self.current_branch,
            "needs_more_thoughts": needs_more,
            "is_synthesis": is_synthesis,
            "timestamp": datetime.utcnow().isoformat()
        }
        self.thoughts.append(thought)
        self.branches.setdefault(self.current_branch, []).append(thought)
        return thought

    def get_result(self):
        """Get the full thinking result."""
        return {
            "problem": self.thoughts[0]["content"][:100] if self.thoughts else "",
            "total_thoughts": len(self.thoughts),
            "thoughts": self.thoughts,
            "branches": list(self.branches.keys()),
            "synthesis": next(
                (t["content"] for t in reversed(self.thoughts) if t.get("is_synthesis")),
                "No synthesis generated"
            )
        }

    def to_json(self):
        """Export as JSON."""
        return json.dumps(self.get_result(), indent=2)


# ── CLI ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Sequential Thinking via Ollama")
    parser.add_argument("problem", nargs="?", help="Problem to analyze")
    parser.add_argument("--file", help="Read problem from file")
    parser.add_argument("--model", default=OLLAMA_MODEL, help="Ollama model")
    parser.add_argument("--thoughts", type=int, default=5, help="Max thoughts")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    parser.add_argument("--interactive", action="store_true", help="Interactive mode")
    args = parser.parse_args()

    problem = args.problem
    if args.file:
        with open(args.file) as f:
            problem = f.read().strip()

    if args.interactive:
        print("Sequential Thinking (Ollama) — Interactive Mode")
        print("Type your problem and press Enter. Type 'quit' to exit.\n")
        thinker = SequentialThinker(model=args.model)
        while True:
            problem = input("Problem> ").strip()
            if problem.lower() in ("quit", "exit", "q"):
                break
            result = thinker.think(problem, max_thoughts=args.thoughts)
            print(f"\n{'='*60}")
            print(f"SYNTHESIS: {result['synthesis']}")
            print(f"{'='*60}\n")
        return

    if not problem:
        parser.print_help()
        sys.exit(1)

    thinker = SequentialThinker(model=args.model)

    print(f"Sequential Thinking via Ollama ({args.model})")
    print(f"Problem: {problem[:100]}...")
    print(f"Max thoughts: {args.thoughts}")
    print(f"{'='*60}\n")

    result = thinker.think(problem, max_thoughts=args.thoughts)

    if args.json:
        print(thinker.to_json())
    else:
        for t in result["thoughts"]:
            prefix = "SYNTHESIS" if t.get("is_synthesis") else f"Thought {t['number']}"
            print(f"[{prefix}]")
            print(t["content"])
            print()

        print(f"{'='*60}")
        print(f"Total thoughts: {result['total_thoughts']}")
        print(f"Branches: {result['branches']}")


if __name__ == "__main__":
    main()
