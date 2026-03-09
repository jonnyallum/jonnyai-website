# Video Production Pipeline — Jai.OS 5.0

> **Purpose:** This directive defines the end-to-end collaboration protocol for producing social media videos across the Antigravity Orchestra. It governs how agents hand off work, what deliverables are expected at each stage, and how quality gates prevent substandard content from shipping.

> **Trigger Types:** `[VIDEO]` tag in chatroom, content calendar item with `pillar: VIDEO`, or direct brief from @marcus.

---

## Pipeline Overview

```
BRIEF → SCRIPT → VOICE-OVER → VISUAL ASSETS → EDIT → QA → PUBLISH → ANALYTICS → LEARN
  ↓        ↓          ↓              ↓            ↓      ↓       ↓          ↓         ↓
marcus  contentforge  eleven       vivienne     carlos   sam   social    maya      all
        + elena                   + priya               engine
```

---

## Stage 0: Brief & Campaign Definition

**Owner:** @marcus
**Trigger:** New campaign, content calendar `VIDEO` item, or ad-hoc request from @jonny.

**Deliverable:** A Video Production Brief posted to chatroom with the following fields:

| Field | Description | Example |
|:---|:---|:---|
| `video_id` | Unique identifier | `VID-2026-03-01-001` |
| `project` | Which client/project this serves | `jonnyai` |
| `type` | `agent_spotlight` / `case_study` / `behind_scenes` / `product_demo` / `thought_leadership` / `client_testimonial` | `agent_spotlight` |
| `narrator` | Which agent's voice narrates (default: @marcus) | `@marcus` |
| `target_platform` | `reels` / `shorts` / `tiktok` / `all` | `all` |
| `duration` | Target length in seconds | `60` |
| `tone` | Emotional direction | `confident, warm, slightly mysterious` |
| `key_message` | The one thing the viewer must remember | `The Orchestra never sleeps` |
| `cta` | Call to action | `Visit jonnyai.co.uk` |
| `deadline` | When the final video must be published | `2026-03-03` |

**Broadcast:** `VIDEO BRIEF LOCKED — [video_id] — [type] — assigning pipeline — @marcus`

---

## Stage 1: Script & Hook Writing

**Owner:** @contentforge (Aria)
**Support:** @elena (brand voice polish)
**Input:** Video Production Brief from Stage 0
**Time Budget:** 2 hours from brief receipt

**Process:**

1. Read the Video Production Brief and the narrator's PERSONA.md (e.g., `.agent/skills/marcus/PERSONA.md`).
2. Write 3 hook variants for the opening 3 seconds — each must create a pattern interrupt.
3. Write the full script in the narrator's voice and character — pull catchphrases and tone from PERSONA.md.
4. Apply the **Characters Not Capabilities** doctrine — no technical details, no tool names, no stack references.
5. Include timing markers every 5 seconds for @carlos to use during editing.
6. Hand off to @elena for brand voice verification — @elena confirms the script sounds like the narrator, not like generic AI copy.

**Deliverable:** Script file at `.tmp/video/[video_id]/script.md` containing:

```markdown
# [video_id] Script
## Hook Variants
1. [Hook A — visual interrupt]
2. [Hook B — auditory interrupt]  
3. [Hook C — intellectual interrupt]

## Selected Hook
[The chosen hook with rationale]

## Full Script
[00:00] [Hook]
[00:03] [Transition line]
[00:05] [Core message begins]
...
[00:55] [CTA]
[00:58] [Sign-off — narrator's signature phrase]

## Voice Direction
Tone: [from brief]
Pace: [e.g., "measured, 140 WPM — pause before key lines"]
Emphasis: [words/phrases to stress]
Emotion Arc: [e.g., "calm authority → building energy → confident close"]
```

**Quality Gate:** @elena signs off: `SCRIPT APPROVED — voice-matched to [narrator] PERSONA — @elena`
**Broadcast:** `SCRIPT LOCKED — [video_id] — handing to @eleven for voice-over — @contentforge`

---

## Stage 2: Voice-Over Generation

**Owner:** @eleven (Sienna)
**Input:** Approved script from Stage 1 + narrator's PERSONA.md voice config
**Time Budget:** 1 hour from script approval

**Process:**

1. Load the narrator's voice configuration from `PERSONA.md` → `voice:` section (voice_id, model, stability, similarity_boost, style, speed).
2. Read the Voice Direction section from the script — map tone, pace, and emphasis to ElevenLabs parameters.
3. Generate the voice-over using the narrator's assigned ElevenLabs voice.
4. Apply @eleven's SOP-001 (Ultra-Low-Latency Voice Agent Setup) quality standards — even for pre-recorded content, the quality bar is production-grade.
5. Generate 3 takes with slight variation in emotional intensity (subtle, standard, energised).
6. Self-QA: Listen to all 3 takes. Rate on realism (1-10), emotional authenticity (1-10), and character consistency with PERSONA.md (1-10). Minimum 7/10 on all dimensions.
7. Select the best take. Export as high-quality WAV (48kHz, 24-bit) for editing, plus MP3 (320kbps) for preview.

**Deliverable:** Voice-over files at `.tmp/video/[video_id]/audio/`:

```
vo_[video_id]_take1.wav
vo_[video_id]_take2.wav
vo_[video_id]_take3.wav
vo_[video_id]_selected.wav    ← the chosen take
vo_[video_id]_selected.mp3    ← preview quality
vo_metadata.json              ← voice settings used, take ratings, selection rationale
```

**vo_metadata.json structure:**

```json
{
  "video_id": "VID-2026-03-01-001",
  "narrator": "@marcus",
  "voice_id": "...",
  "model": "eleven_flash_v2_5",
  "settings": {
    "stability": 0.72,
    "similarity_boost": 0.82,
    "style": 0.40,
    "speed": 0.95
  },
  "takes": [
    {"take": 1, "intensity": "subtle", "realism": 8, "emotion": 7, "character": 9},
    {"take": 2, "intensity": "standard", "realism": 9, "emotion": 8, "character": 9},
    {"take": 3, "intensity": "energised", "realism": 8, "emotion": 9, "character": 8}
  ],
  "selected_take": 2,
  "selection_rationale": "Best balance of warmth and authority — matches Marcus PERSONA perfectly",
  "duration_seconds": 58.4,
  "format": "WAV 48kHz 24-bit"
}
```

**Quality Gate:** @eleven signs off: `VOICE-OVER CERTIFIED — [narrator] voice verified, emotional range confirmed — @eleven`
**Broadcast:** `VOICE-OVER LOCKED — [video_id] — 3 takes generated, take [N] selected — handing to @carlos — @eleven`

---

## Stage 2b: Visual Assets & Brand Direction

**Owner:** @vivienne (brand direction) + @priya (motion assets)
**Input:** Video Production Brief + approved script
**Time Budget:** Runs in parallel with Stage 2 (voice-over)

**Process:**

1. @vivienne reviews the brief and script — provides a Visual Direction Sheet:
   - Colour palette for this specific video (from brand guidelines)
   - Typography selections for captions/overlays
   - Logo placement rules (transparent overlay, max 0.5s intro per @carlos's rules)
   - Mood board references (3-5 reference images/videos)
2. @priya creates any motion assets needed:
   - Animated text templates for key phrases
   - UI mockup recordings for product demos
   - Transition elements that match the brand motion language
3. All assets delivered to `.tmp/video/[video_id]/assets/`

**Deliverable:** Asset package at `.tmp/video/[video_id]/assets/`:

```
visual_direction.md           ← @vivienne's direction sheet
brand_palette.json            ← hex codes, gradients, overlay opacity
caption_style.json            ← font, size, animation type, colour
logo_overlay.png              ← transparent logo for watermark
motion_elements/              ← @priya's animated elements
  transition_01.mov
  text_template.json
  ...
```

**Quality Gate:** @vivienne signs off: `VISUAL DIRECTION APPROVED — brand-consistent for [project] — @vivienne`

---

## Stage 3: Video Production & Editing

**Owner:** @carlos
**Input:** Voice-over (Stage 2) + Visual Assets (Stage 2b) + Script (Stage 1)
**Time Budget:** 4 hours from receiving all inputs

**Process:**

1. Load the script with timing markers, the selected voice-over WAV, and all visual assets.
2. **Hook Assembly:** Build the first 3 seconds using the selected hook variant — this is the most critical part of the entire video. Apply @carlos's SOP-001 (Viral Hook Ideation) standards.
3. **Primary Cut:** Lay the voice-over on the timeline. Cut to timing markers. Remove any dead air.
4. **Layer 1 — Pattern Interrupts:** Apply visual zooms, B-roll switches, or SFX every 2.5 seconds per @carlos's SOP-002.
5. **Layer 2 — Captions:** Add high-impact animated captions using @vivienne's caption style spec. Every spoken word gets a caption — bold emphasis on key phrases.
6. **Layer 3 — Audio Design:** If music/SFX needed, request from @eleven (SOP for music generation) or use approved library. Ensure beat drops align with visual payoffs.
7. **Layer 4 — Brand Elements:** Apply logo overlay, colour grading per @vivienne's direction, end card with CTA.
8. **Platform Optimization:** Export in all required formats:
   - 9:16 vertical (Reels/Shorts/TikTok) — primary
   - 1:1 square (Feed posts) — secondary
   - 16:9 horizontal (YouTube/Website) — if requested
9. **Self-QA:** Watch the video 5 times. If the urge to check your phone arises at any point, that section is a failure — re-edit.

**Deliverable:** Final video files at `.tmp/video/[video_id]/final/`:

```
[video_id]_9x16.mp4           ← vertical (primary)
[video_id]_1x1.mp4            ← square (secondary)
[video_id]_16x9.mp4           ← horizontal (if requested)
[video_id]_thumbnail.png      ← custom thumbnail
edit_notes.md                 ← decisions made, hook variant used, retention predictions
```

**Quality Gate:** @carlos self-certifies: `VIDEO EDIT COMPLETE — [video_id] — hook locked, retention-optimised, platform-ready — @carlos`
**Broadcast:** `VIDEO LOCKED — [video_id] — sending to QA — @carlos`

---

## Stage 4: Quality Assurance

**Owner:** @sam (technical QA) + @marcus (creative approval)
**Input:** Final video files from Stage 3
**Time Budget:** 1 hour

**Process:**

1. @sam verifies technical specs: resolution, aspect ratio, file size, audio levels, caption readability on mobile.
2. @marcus watches the video as the final creative gate:
   - Does it sound like the narrator's character? (Check against PERSONA.md)
   - Does it follow the **Characters Not Capabilities** doctrine? (No tech stack, no tool names, no internal details)
   - Would he be proud to post this under the Antigravity brand?
   - Is the CTA clear and compelling?
3. If either gate fails, the video returns to the relevant stage with specific feedback.

**Quality Gate:** @marcus signs off: `VIDEO APPROVED — [video_id] — cleared for publish — @marcus`

---

## Stage 5: Publish

**Owner:** Social Engine (automated) or @contentforge (manual)
**Input:** Approved video + social copy
**Time Budget:** Immediate upon approval

**Process:**

1. @contentforge writes the social post copy to accompany the video — pulls from PERSONA.md for narrator voice.
2. Social Engine publishes to all target platforms (FB, IG, and future: LinkedIn, X, TikTok).
3. Post is logged to `social_posts` table in Supabase with `content_type: VIDEO`, `video_id`, and all metadata.

**Broadcast:** `VIDEO PUBLISHED — [video_id] — live on [platforms] — @contentforge`

---

## Stage 6: Analytics & Learning

**Owner:** @maya (analytics) + all pipeline agents
**Input:** Published video performance data
**Time Budget:** 24h check + 7d check

**Process:**

1. @maya pulls engagement metrics at 24h and 7d: views, retention curve, likes, shares, comments, click-through rate.
2. @maya identifies the exact second where the biggest viewer drop-off occurs — feeds this back to @carlos for the next edit.
3. @carlos logs the hook type, pacing pattern, and retention result to the "Viral Library" in Shared Brain.
4. @eleven logs voice settings and take selection against engagement — builds a model of which voice configurations perform best.
5. @contentforge logs which script structure and hook type drove the most engagement.
6. All learnings propagate to Shared Brain for the next video production cycle.

**Broadcast:** `VIDEO ANALYTICS — [video_id] — [views] views, [retention]% avg retention, [ctr]% CTR — learnings logged — @maya`

---

## Trigger Integration

The following chatroom tags trigger the video production pipeline:

| Tag | Action |
|:---|:---|
| `[VIDEO]` | @marcus receives brief, initiates full pipeline |
| `[AGENT_VIDEO]` | Agent spotlight video — @marcus narrates, subject agent featured |
| `[CASE_STUDY_VIDEO]` | Client case study video — @marcus narrates results |
| `[PRODUCT_VIDEO]` | Product demo video — @priya provides UI recordings |

Content calendar items with `pillar: VIDEO` or `pillar: AGENT_SPOTLIGHT` automatically trigger the pipeline at the scheduled time.

---

## File Structure Convention

All video production work lives under `.tmp/video/[video_id]/`:

```
.tmp/video/VID-2026-03-01-001/
├── brief.md                    ← Stage 0 output
├── script.md                   ← Stage 1 output
├── audio/
│   ├── vo_*_take1.wav
│   ├── vo_*_take2.wav
│   ├── vo_*_take3.wav
│   ├── vo_*_selected.wav
│   └── vo_metadata.json
├── assets/
│   ├── visual_direction.md
│   ├── brand_palette.json
│   ├── caption_style.json
│   ├── logo_overlay.png
│   └── motion_elements/
├── final/
│   ├── *_9x16.mp4
│   ├── *_1x1.mp4
│   ├── *_thumbnail.png
│   └── edit_notes.md
└── analytics/
    ├── 24h_report.json
    └── 7d_report.json
```

---

## Emergency Protocols

| Scenario | Action |
|:---|:---|
| Voice-over generation fails (ElevenLabs API down) | @eleven activates fallback voice. If all voices unavailable, @carlos produces text-only video with captions. |
| Script fails brand voice check | Returns to @contentforge with @elena's specific feedback. Max 2 revision cycles before @marcus intervenes. |
| Video fails QA | Returns to @carlos with timestamped feedback. If 3rd revision still fails, @marcus reassigns or simplifies the concept. |
| Deadline at risk | @marcus can authorise "Fast Track" — skip square/horizontal exports, reduce to single platform, accept first-pass voice-over. |

---

_Jai.OS 5.0 | The Antigravity Orchestra | Video Production Pipeline v1.0_
