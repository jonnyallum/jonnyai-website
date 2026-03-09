# Reel Production SOP — Jai.OS 5.0

> **Owner:** @carlos (Video) & @eleven (Audio)
> **Goal:** Produce high-retention vertical Reels narrated by @marcus (or other agents).

## 1. Trigger

- Chatroom tag `[REEL]` or `[VIDEO]`.
- Content calendar item with type `REEL`.

## 2. Scripting (Stage 1)

- **Agent:** @contentforge + @elena
- **Rule:** Hook in first 1.5 seconds.
- **Tone:** Narrator's PERSONA.md (e.g., Marcus - authoritative, warm).
- **Length:** 30-60 seconds (~75-150 words).

## 3. Audio (Stage 2)

- **Agent:** @eleven
- **Process:** Use ElevenLabs Marcus voice (`ytcsltLTtCHxNn1vC76H`).
- **Output:** High-quality WAV to `.tmp/video/[video_id]/audio/`.

## 4. Visuals (Stage 3)

- **Agent:** @carlos
- **Process:**
  - Gather 4-8 contextually relevant images (Portraits or Brand visuals).
  - Use `execution/generate_marcus_reel.py` (or improved version) to assemble.
- **Carlos's Retention Pattern:**
  - Cuts every 2.5 seconds.
  - Slow zoom-in on every image (Pattern Interrupt).
  - 1080x1920 vertical crop.

## 5. Captions (Stage 3b)

- **Agent:** @carlos (@priya support)
- **Process:** Add burning captions (automated or manual overlay).
- _Future Upgrade: Use FFmpeg drawtext or Remotion for dynamic captions._

## 6. Publishing (Stage 5)

- **Agent:** @nathan (Social Engine)
- **Target:** Facebook Pages (Reels) and Instagram (Reels).
- **FB Process:** Binary upload via `post_to_facebook_reel` in `facebook_publisher.py`.
- **IG Process:** Container method via `post_to_instagram_reel` (requires public URL).

## 7. Quality Gate

- **Technical QA:** @sam (spec check).
- **Creative QA:** @marcus (character match).

---

_Jai.OS 5.0 | The Antigravity Orchestra | Reel SOP v1.0_
