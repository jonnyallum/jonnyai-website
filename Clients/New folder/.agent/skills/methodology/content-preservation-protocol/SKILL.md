---
# Methodology Skill Card — Jai.OS 5.0
name: "content-preservation-protocol"
version: "1.0.0"
type: methodology
description: "Content Preservation & Asset Protocol (AgOS 3.0)"
category: marketing
complexity: high
domains: ["marketing"]
updated: "2026-03-01"
---
## Description

Zero-placeholder mandate ensuring all content is preserved during design and migration operations.

## Implementation Instructions

Follow the phased approach below: Pre-Design Archiving, Asset Verification, Quality Scan, and Incident Response.

# Content Preservation & Asset Protocol (AgOS 3.0)
> *"Placeholders are lies. Lies destroy brand conviction."*

---

## 🚫 THE ZERO-PLACEHOLDER MANDATE

**Rule**: The use of Unsplash, Lorem Ipsum, or generic stock photos (the "scrubs lady") is strictly prohibited for production deployments. 

If real client assets do not exist:
1. **FLAG** the missing asset to the USER.
2. **HALT** the deployment gate.
3. **WAIT** for real verified content.

---

## 📦 PHASE 1: PRE-DESIGN ARCHIVING

Before ANY UI redesign or build starts, **@Genesis** or **@Archivist** must:
1. **Original Extraction**: Download and archive ALL existing site images to `Clients/[name]/assets/originals/`.
2. **Handle Mapping**: Document all official social media handles (Instagram, FB, TikTok) in `Clients/[name]/docs/CLIENT_BRIEF.md`.
3. **Photo Audit**: Check for "Real Humans" vs "Stock Humans". Any stock humans detected in the current site must be flagged for replacement, NOT carried over.

---

## 📸 PHASE 2: ASSET VERIFICATION

**@Rowan (The Beast)** must execute the **Truth-Lock** on all visuals:
- [ ] Are these photos of the actual client/business?
- [ ] Is the copy verified against real business data?
- [ ] Do embedded socials point to the actual client account?

**FAILED GATE:** If `@Rowan` cannot verify the identity of a person in a photo, the **CONTENT GATE** fails.

---

## 🛠️ PHASE 3: QUALITY SCAN

**@Vigil (The Eye)** must perform a pre-flight URL scan:
- [ ] Scan for `unsplash.com`, `images.pexels.com`, or common placeholder patterns.
- [ ] Scan for `Lorem Ipsum` or `Coming Soon` placeholders.
- [ ] Verify `script.js` links to live client data.

---

## 🚨 INCIDENT RESPONSE (Self-Annealing)

If a placeholder bypasses the gates:
1. **Immediate Rollback**: Revert to the last known "Truth-Confirmed" state.
2. **Agent Audit**: The Agent who signed off on the gate (usually @Priya or @Rowan) must run a **Learning Sprint**.
3. **Skill Patch**: Update the agent's `SKILL.md` with the specific failure pattern.

---

*Protocol Created: 2026-02-05*  
*Enforcement Level: ABSOLUTE*  
*Owner: @Marcus (Conductor)*


## Constraints

- **DO NOT** allow any placeholder content to ship to production.
- **ALWAYS** archive existing content before starting any redesign.
- **DO NOT** skip the quality scan phase even under deadline pressure.
