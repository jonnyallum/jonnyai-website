# Antigravity Awesome Skills – Evaluation & Integration Runbook

**Owner:** Arthur (@Arthur)  
**Review Cadence:** Quarterly  
**Last Updated:** 2026-03-09  

> [!IMPORTANT]
> This runbook defines the "bulletproof" workflow for evaluating skills from `sickn33/antigravity-awesome-skills` for inclusion as methodology skills and/or agent capabilities in Jai.OS 4.0.

---

## 0. Setup and Roles

Assign roles for each evaluation run:

- **Marcus (@Marcus)** – Sponsor and final decision maker on what enters the Orchestra.
- **Neo (@Neo)** – Agent Creation Specialist for new/updated `SKILL.md` files; follows the [Neo's Build SOP].
- **Arthur (@Arthur)** – Catalog + Documentation owner; manages the index and notes.
- **Domain Leads** – Security (Sam/Victor), Infra (Derek), Product/Growth (Felix), QA (Quinn/Quinn Reyes), each reviewing skills in their lane.

---

## 1. Catalog and Triage

- **Clone and Index (Arthur):**
  - `git clone https://github.com/sickn33/antigravity-awesome-skills.git`
  - Generate a master catalog (`docs/skills_catalog.md`) with: handle, path, category, short description, and source (Official/Community).
- **Map to Orchestra Domains:** Assign each skill to a domain owner based on its category (Architecture, Security, Data & AI, Business, Testing, Workflow, etc.).
- **Set Priorities:** Mark each skill as **High** (gap, safety-critical, major leverage), **Medium** (nice-to-have, partial overlap), or **Low** (niche, already covered).
  - *Only High and Medium proceed to Phase 2.*

---

## 2. Domain Deep-Dive Review

For each domain (run in parallel by owners):

- **Shortlist:** Domain owner filters to High and Medium priority skills.
- **Read and Evaluate:**
  - Open each `SKILL.md` and skim its upstream sources if referenced.
  - Answer for each:
    - What concrete outcome does it produce?
    - Do we already have an equivalent methodology skill?
    - Should it be a Jai.OS methodology skill, an agent capability update, or purely a tool hint?
    - Any red flags (license, complexity, safety)?
- **Outcome:** A domain-specific shortlist of "worth integrating" skills with justifications.

---

## 3. Cross-Team Design Review

- **Consolidate (Arthur):** Merge domain notes into a single shortlist document for the Boardroom session.
- **Boardroom Session (Marcus, Neo, Sebastian, Domain Leads):**
  - **Bucket Triage:**
    - **A: Core to Orchestra** – Formalize as Jai.OS methodology or agent skills.
    - **B: Available but not core** – Installable but not deeply wired.
    - **C: Skip for now.**
  - **Target Form Definition:** For A-class skills, decide if it's a new methodology skill or an update to an agent, and assign the owning agent (e.g., Sam for security, Sophie for research).

---

## 4. Implementation via Neo's Method

For every A-class skill, Neo follows his Build SOP:

1. **Briefing:** Marcus creates a brief with Handle, Role (Methodology vs Agent), Domain, Tier, and External Skill reference.
2. **Neo’s Execution:**
   - Check Shared Brain/Existing agents to avoid duplication.
   - Run **Collaboration Gate** with Marcus + Sebastian for scope/toolset.
   - Use `perfectagenttemplate.md` to populate structure.
   - **Inject "Soul":** Add Vibe, Communication Style, and Working Style so the skill is not generic.
   - Define precise SOPs, Restrictions, and Metrics.
   - Run the **Perfect Agent Quality Checklist**.
   - Save to `.agents/skills/<handle>/SKILL.md` or `.agents/skills/methodology/`.
3. **Completion:** Post a **Deterministic State Packet** to `chatroom.md` and update AGENTREGISTRY.

---

## 5. Validation and Rollout

- **Structural Validation:** Run `python execution/validate_agents.py` to ensure template and directive compliance.
- **Behavioral Validation:** Domain leads test the skill in real sessions (e.g., a real security review with new methodology).
- **Feedback Loop:** Capture results in the skill's Learning Log.
- **System Integration:** Update orchestration docs (Marcus' `SKILL.md`, existing workflows) so the new skill becomes the default path for its domain.

---

## 6. Continuous Review

- **Quarterly Audit:** Align with the Doc Debt Audit to re-scan for new versions or categories in Awesome Skills.
- **Usage Check:** Deprecate dead weight (integrated skills that aren't used in real missions).
- **Feedback Feed:** Feed discoveries back to Neo for continuous improvement.
