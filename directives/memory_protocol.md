# Directive: Memory & Shared Brain Protocol (Jai.OS 5.0)

## Goal

To ensure every agent action is informed by the collective knowledge of the Orchestra and that every outcome is captured for future use.

## Mandatory Steps

### 1. Pre-Task Sync (Hydration)

BEFORE initiating any `run_command` or file edit:

- **Query Supabase**: Use the `supabase` MCP or `execution/brain_sync.py` to check for relevant `learnings`.
- **Check Chatroom**: Read the last 50 messages in `.agent/boardroom/chatroom.md` to see what collaborators are doing.
- **Reference SKILL.md**: Query the `SKILL.md` of any specialist whose domain you are entering.

### 2. Mid-Task Persistence

- **Intermediate Learnings**: If you discover a significant blocker or a novel fix, post it to the chatroom immediately. Do not wait for task completion.

### 3. Post-Task Sync (Persistence)

AFTER completing a mission:

- **Update Task Status**: Mark the task as `complete` in the `projects` or `task-history.json`.
- **Propagate Learning**: Use `execution/sync_learnings.py` to push insights to the Shared Brain.
- **Update Heartbeat**: Ensure your `last_active` timestamp is updated in the `agents` table.

## Success Criteria

- [ ] No duplicated work (e.g., refactoring a module someone else already fixed).
- [ ] 100% of tasks end with a documented learning entry.
- [ ] Zero "blind actions" (acting without checking existing context).
