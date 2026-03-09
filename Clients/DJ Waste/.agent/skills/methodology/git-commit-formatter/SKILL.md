# Git Commit Formatter

## Description
Generates semantic commit messages following conventional commit format for staged git changes.

## Goal
Generate conventional commit messages based on the user's staged changes in git.

## Implementation Instructions
1.  **Inspect Changes:** Run `git diff --staged` to inspect the changes.
2.  **Analyze Diff:** Analyze the diff output to understand what was modified.
3.  **Determine Commit Type:** Select the appropriate type:
    *   `feat`: new feature
    *   `fix`: bug fix
    *   `docs`: documentation changes
    *   `style`: formatting, missing semicolons, etc.
    *   `refactor`: code restructuring without feature changes
    *   `test`: adding or updating tests
    *   `chore`: maintenance tasks.
4.  **Draft Message:** Write a concise, descriptive commit message in the format: `type: description`.
5.  **Length Check:** Keep the description under 50 characters when possible.

## Constraints
*   Do not commit without reviewing the staged changes first.
*   Do not create commit messages longer than 72 characters for the first line.
*   Do not use vague descriptions like "updated files" or "fixed stuff".
*   Always use lowercase for the commit type and description.
