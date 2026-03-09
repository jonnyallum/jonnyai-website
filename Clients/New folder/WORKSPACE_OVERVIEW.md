# Workspace Overview & Guide

This workspace is designed around a **3-layer architecture** and a modular **Skills system** to ensure reliable, high-quality execution of complex tasks. This document explains the core components, how to use them, and when to trigger specific capabilities.

---

## 🏗️ The 3-Layer Architecture

The workspace follows a strict separation of concerns to maximize reliability:

1.  **Layer 1: Directives (What to do)**
    *   **Location**: `directives/`
    *   **Purpose**: Natural language SOPs (Standard Operating Procedures) that define goals, inputs, and edge cases.
    *   **Usage**: Read these first when performing a task to understand the "business logic" and required steps.

2.  **Layer 2: Orchestration (Decision making)**
    *   **Location**: The AI Agent (You)
    *   **Purpose**: Intelligent routing between intent and execution. You read directives, call tools in order, and handle errors.
    *   **Usage**: The glue that connects directives to deterministic scripts.

3.  **Layer 3: Execution (Doing the work)**
    *   **Location**: `execution/`
    *   **Purpose**: Deterministic Python/Bash scripts that handle API calls, data processing, and file operations.
    *   **Usage**: Call these scripts to perform the actual work.

---

## 📜 Instruction Sets (Rules)

The core behavior of the AI agent is governed by three mirrored files. These are the "Rules of Engagement":

*   **`GEMINI.md` / `CLAUDE.md` / `AGENTS.md`**: These files contain the fundamental operating principles, including the self-annealing loop (fixing broken scripts), file organization rules, and the 3-layer architecture workflow.

---

## 🛠️ Skills Library

Skills are specialized packages that provide domain expertise, workflows, and tools. Each skill lives in its own directory and is defined by a `SKILL.md` file.

### 🎨 Design & Branding
*   **`brand-guidelines`**
    *   **What**: Applies Anthropic's official visual identity (colors and typography).
    *   **When**: Use when creating artifacts that need a professional "Anthropic" look-and-feel.
    *   **Colors**: Dark (`#141413`), Light (`#faf9f5`), Orange (`#d97757`), Blue (`#6a9bcc`).
*   **`canvas-design`**
    *   **What**: Creates museum-quality visual art and posters.
    *   **When**: Use for static designs, art pieces, or high-end visual communication.
    *   **Workflow**: 1. Create a "Visual Philosophy" (.md) → 2. Express it on a canvas (.png/.pdf).
*   **`theme-factory`**
    *   **What**: A library of 10 curated themes (e.g., *Ocean Depths*, *Midnight Galaxy*).
    *   **When**: Use to style slides, reports, or documents quickly with professional palettes.
    *   **How**: Show `theme-showcase.pdf`, pick a theme, and apply its styles.

### 💻 Web & Frontend
*   **`frontend-design`**
    *   **What**: Builds distinctive, production-grade frontend interfaces.
    *   **When**: Building websites, dashboards, or React components that must avoid "AI-generic" looks.
    *   **Focus**: Bold typography, atmospheric backgrounds, and orchestrated motion.
*   **`webapp-testing`**
    *   **What**: Automated testing for web apps using Playwright.
    *   **When**: Debugging UI behavior, verifying functionality, or capturing screenshots of local servers.
    *   **Helper**: Use `scripts/with_server.py` to manage server lifecycles automatically.

### 📄 Document Management
*   **`docx`**
    *   **What**: Deep integration with Microsoft Word files.
    *   **When**: Creating new documents, editing with tracked changes, or extracting text from complex .docx files.
    *   **Tools**: Uses `pandoc` (reading), `docx-js` (creating), and a Python OOXML library (editing).

### ⚙️ Development & Extensibility
*   **`mcp-builder`**
    *   **What**: Comprehensive guide for building Model Context Protocol (MCP) servers.
    *   **When**: When you need to connect the LLM to an external service or API.
    *   **Output**: High-quality TS/Python MCP servers with rigorous evaluations.
*   **`skill-creator`**
    *   **What**: The "Meta-Skill" for building new skills.
    *   **When**: Use when the user wants to add a new specialized capability to this workspace.
    *   **Process**: Init → Edit (SKILL.md + resources) → Package.

---

## 📁 Workspace Organization

*   **`.tmp/`**: Contains intermediate files. Everything here is transient and can be regenerated.
*   **`.env`**: Stores sensitive API keys and environment variables.
*   **`directives/`**: Stores the SOPs for Layer 1.
*   **`execution/`**: Stores deterministic scripts for Layer 3.
*   **`credentials.json` / `token.json`**: Google OAuth credentials (if applicable).

## 🚀 How to Use This Workspace

1.  **Understand the Goal**: Identify which Layer 1 Directive or Skill applies.
2.  **Check Tools**: Look in `execution/` or the skill's `scripts/` folder for existing tools.
3.  **Execute & iterate**: Run tools, handle errors, and update the workspace (Directives/Skills) as you learn.
