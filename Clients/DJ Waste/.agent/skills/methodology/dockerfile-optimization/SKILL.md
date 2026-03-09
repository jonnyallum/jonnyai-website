# Dockerfile Optimization

## Description
Analyzes and optimizes Dockerfiles to reduce image size, improve build speed, and enhance security using multi-stage builds and best practices.

## Goal
Produce production-ready, ultra-lean Docker images that deploy quickly and have a minimal attack surface.

## Implementation Instructions
1.  **Multi-Stage Build:** Use separate stages for `build` and `run` to exclude build-time dependencies from the final image.
2.  **Base Image Selection:** Use lightweight base images (e.g., `node:alpine` or `python:slim`).
3.  **Layer Caching:** Order commands from "least frequent change" to "most frequent change" (e.g., `COPY package.json` before `COPY src`).
4.  **Security:** Ensure the image runs as a non-root user.
5.  **Cleanup:** Remove temporary files and package manager caches in the same `RUN` command they were created.

## Constraints
- **DO NOT** include `.git` or `.env` files in the image content.
- **ALWAYS** use specific tags instead of `:latest`.
- **DO NOT** run containers as `root`.
