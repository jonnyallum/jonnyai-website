---
# Methodology Skill Card — Jai.OS 5.0
name: "git-branch-strategy-advisor"
version: "1.0.0"
type: methodology
description: "Recommends optimal Git branching strategies and provides workflow commands based on project type, team size, and depl..."
category: devops
complexity: medium
domains: ["automation"]
updated: "2026-03-01"
---

# Git Branch Strategy Advisor

## Description
Recommends optimal Git branching strategies and provides workflow commands based on project type, team size, and deployment requirements.

## Implementation Instructions
1.  **Analyze Context:** Determine team size, experience level, deployment frequency, and environment setup.
2.  **Select Strategy:** Recommend the appropriate strategy:
    *   **Git Flow:** For feature, develop, release, and hotfix branches.
    *   **GitHub Flow:** For main + feature branches.
    *   **GitLab Flow:** For environment branches.
    *   **Trunk-based development:** For CI/CD contexts.
3.  **Define Conventions:** Provide specific branch naming conventions.
4.  **Generate Workflow:** Create workflow commands for common scenarios (new feature, hotfix, release).
5.  **Establish Governance:** Include PR/MR templates and branch protection recommendations.

## Constraints
*   Do not recommend complex strategies for small teams.
*   Do not suggest trunk-based development without discussing feature flags.
*   Always provide rollback procedures for production hotfixes.
*   Include branch protection rules to prevent accidental deletions.
