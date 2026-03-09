# DANGER ZONE

Scripts in this directory are **destructive and irreversible**.

Do NOT run these without explicit sign-off from Jonny.

| Script | What it does |
|---|---|
| `drop_all_schemas.py` | Drops ALL schemas from the Supabase database |
| `drop_schema.py` | Drops a specific schema |
| `delete_marcus_crm.py` | Deletes Marcus CRM data |
| `enable_uuid.py` | Enables UUID extension (run once only — idempotent but noisy if re-run) |

Add `--dry-run` support before running any of these in production.
