# Antigravity Workspace Guide

Welcome to your Antigravity workspace. This environment is designed for **agentic collaboration**, where specialized AI agents working for **Jonny** work together to achieve complex goals.

## How to Get Optimum Results

The key to success is using the **Workspace Orchestrator** to manage complex tasks, and calling specific **Domain Specialists** for focused work.

### 1. The 3-Layer Architecture

We follow a strict separation of concerns to ensure reliability:
1.  **Directive (What)**: High-level SOPs and instructions (in `directives/`).
2.  **Orchestration (Planning)**: The **Workspace Orchestrator** plans the work and routes it to skills.
3.  **Execution (Doing)**: Python scripts (in `execution/`) or specialized Agents perform the actual work (writing code, files, etc.).

### 2. Using the Orchestrator

The Orchestrator is your project manager. It has three modes:

*   **Planner Mode (Default)**: "Plan a mission to..."
    *   Safe. It designs a plan and waits for your approval.
    *   Use this when you are exploring a new idea.
*   **Advisor Mode**: "Review the current state..."
    *   Read-only. It inspects and advises but touches nothing.
    *   Use this for code reviews or "sanity checks".
*   **Loki Mode**: "Run in Loki mode: Fix all lint errors..."
    *   **Autonomous**. It plans and executes without asking for every step.
    *   Use this for clear, well-defined tasks (e.g., "Refactor this folder", "Generate unit tests").

### 3. Workflow for Complex Projects

For a big project (e.g., "Launch a new SaaS product"), follow this flow:

1.  **Discovery**: Ask the Orchestrator to "Audit the current workspace" or "Plan the MVP".
2.  **Phase Approval**: The Orchestrator will give you a list of phases. Approve them.
3.  **Execution**: The Orchestrator will call agents like `expo-mobile-builder` or `frontend-design`.
4.  **Review**: Use `webapp-testing` or manual review to verify.

### 4. Tips for Success

*   **Be Specific with Personas**: If you want a specific style, invoke the skill directly. E.g., "Use @saas-marketing-redesign to update the home page."
*   **Use Declarative Goals**: Instead of "Write a file", say "Ensure the home page converts at 5%." Let the SEO and Design agents figure out the "How".
*   **Leverage Metrics**: Ask the SEO agent to "Audit for E-E-A-T" to get a quantitative report.
*   **Keep Context Clean**: The Orchestrator helps manage context by only loading the skills you need.

### 5. Team Rituals (Huddles)

For high-risk or multi-surface missions, use these structured meetings:

*   **Ten at 10 (Pre-mission)**: Run *before* the Orchestrator starts work. Every relevant agent (SEO, Backend, QA, etc.) weighs in on the plan and flags risks.
*   **Team Talk (Issue Resolution)**: Run when a mission hits a blocker, a quality gate fails, or "something feels wrong." It prevents siloed fixes and ensures the whole team aligns on the solution.

## Directory Structure

*   `.agent/skills/`: The brain. Contains all agent personas (SKILL.md) and their tools.
*   `docs/`: Documentation for humans and agents.
*   `execution/`: Python scripts for deterministic tasks.
*   `directives/`: SOPs and high-level rules.
*   `[root]`: Your application code.
