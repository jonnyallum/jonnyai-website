# Database Migration Generator

## Description
Generates safe, version-controlled database migration scripts for schema changes across different environments.

## Goal
Ensure database changes are reproducible, testable, and can be deployed with zero downtime using automated pipelines.

## Implementation Instructions
1.  **Differencing:** Compare the current "desired" state (e.g., Prisma schema) with the "actual" database state.
2.  **Script Generation:** Create a sequential SQL migration file (e.g., `YYYYMMDD_add_users_table.sql`).
3.  **Pre-flight Check:** Scan the migration for destructive actions (e.g., `DROP TABLE`) and require explicit confirmation.
4.  **Execution Logic:** Implement "Up" and "Down" (rollback) logic where possible.
5.  **Audit:** Record the successful execution of migrations in a system table (e.g., `_migrations`).

## Constraints
- **NEVER** run migrations directly against production without a staging test.
- **DO NOT** include data seeding in schema migration files.
- **ALWAYS** include estimated downtime or lock duration in migration comments.
