# Learning Log: Insydetradar Production Launch & AgOS 4.0 Migration
**Date:** 2026-02-05
**Agent:** @JonnyAI & @Marcus

## 🚀 Key Achievements
- **Shared Brain Migration 002**: Successfully updated the Central Brain with Research Cron support and System News tables.
- **Alpaca Connectivity**: Confirmed secure handshake with Alpaca Paper Trading API using Tactical Keys.
- **Production Asset Migration**: Moved core app from `DELETEME_LATER` to `Clients/Insydetradar/Insydetradar` and Landing Page to `Clients/Insydetradar/Web`.
- **Heartbeat Protocol**: Fixed out-of-sync database constraints in `orchestra_heartbeat.py` to enable autonomous research runs.

## 💡 Lessons Learned
- **Terminal Truncation**: When running commands with large output (like `cat` or `ls` on deep directories), it is more reliable to redirect output to a file (e.g., `> results.txt`) and read it in chunks or via `grep`.
- **Python-Postgres Sync**: When using `psycopg2` on Windows, ensure Unicode encoding is handled for emojis in print statements, or use plain text markers to avoid `UnicodeEncodeError`.
- **Hostinger Directory Structure**: The `domains/` folder contains site-specific roots. For `insydetradar.com`, the files are directly in `domains/insydetradar.com/`. The absence of a `public_html` subfolder here may be the cause of the 404 if the server expects a standard structure.
- **Database Constraints**: Adding columns with `NOT NULL` without a default value will break existing automation scripts. Always verify script compatibility after schema changes.

## 🛠️ System Optimizations
- **Encapsulated Heartbeat**: The autonomous research loop is now self-healing and respects the `created_by_ai` constraint.
- **Unified Deployment**: Standardized on `Clients/Insydetradar` as the source of truth for all Insydetradar-related artifacts.

---
*Verified by @Conductor | Jai.OS 5.0*
