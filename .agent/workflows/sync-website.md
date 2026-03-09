---
description: Sync agent roster and news to the jonnyai.website
---

# Sync Website Workflow

Whenever a change is made to the agent roster (`.agent/TEAM_ROSTER.md`), a new Hire is made, or a major system update (like Jai.OS 5.0) is installed, run this workflow to push updates to the agency website.

## Steps

1. **Update the Source of Truth**:
   - For Roster: Edit `.agent/TEAM_ROSTER.md`.
   - For News: Add a new entry to `.agent/NEWS.md`.

2. **Run the Sync Script**:
// turbo
```powershell
python execution/sync_to_website.py
```

3. **Verify the Build**:
   - Check `Clients/jonnyai.website/src/data/agents.ts` and `news.ts`.

4. **Deploy**:
   - Commit and push changes in the `jonnyai.website` repository.
