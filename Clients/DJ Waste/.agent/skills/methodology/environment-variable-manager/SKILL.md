# Environment Variable Manager

## Description
Generates environment variable configuration files, validates required variables, and creates documentation for different deployment environments.

## Goal
Manage the complex web of environment variables across development, staging, and production environments securely and efficiently.

## Implementation Instructions
1.  **Inventory:** Identify all required environment variables by scanning the codebase (e.g., looking for `process.env`).
2.  **Categorize:** Group variables into "Public" (frontend-safe) and "Private" (server-only).
3.  **Generate Templates:** Create `.env.example` files with placeholder values.
4.  **Validate:** Create a validation script (e.g., using Zod) to check if all required vars are present at startup.
5.  **Secure:** Coordinate with @Vaultguard to ensure secret values are never committed to version control.

## Constraints
- **NEVER** include actual production secrets in `.env.example`.
- **ALWAYS** use a prefix (e.g., `NEXT_PUBLIC_`) for variables meant for the frontend.
- **DO NOT** commit `.env` files to Git.
