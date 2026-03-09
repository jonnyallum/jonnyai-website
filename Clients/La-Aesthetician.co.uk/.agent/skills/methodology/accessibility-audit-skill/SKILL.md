# Accessibility Audit Skill

## Description
Performs comprehensive WCAG 2.1 accessibility audits on web components and pages, identifying violations and providing remediation code.

## Goal
Identify accessibility issues in HTML, React, or Vue components and provide specific fixes to achieve WCAG 2.1 AA or AAA compliance.

## Implementation Instructions
1.  **Analyze Component Structure:** Scan the provided code for specific issues, including:
    *   Missing alt text for images.
    *   Inadequate color contrast (Text/Background).
    *   Missing form labels.
    *   Non-semantic HTML usage (e.g., using `<div>` for buttons).
    *   Inaccessible interactive elements (tab order, focus states).
2.  **Report Violations:** Categorize issues as Critical, Serious, Moderate, or Minor.
3.  **Provide Remediation:** Generate the corrected code snippet that resolves each issue while maintaining functionality.

## Constraints
*   Always reference the specific WCAG success criterion being violated.
*   Prioritize fixes that have the highest impact on screen reader users.
*   Do not suggest "aria-label" when semantic HTML (e.g., `<button>`) can solve the problem naturally.
