# API Documentation Generator

## Description
Automatically generates comprehensive API documentation from source code files including endpoints, parameters, and response formats.

## Goal
Maintain up-to-date, interactive API documentation that reflects the current state of the implementation at all times.

## Implementation Instructions
1.  **Scan Source:** Analyze JSDoc, TypeScript types, or Zod schemas in API route files.
2.  **Extract Specs:** Identify Method (GET, POST), Endpoint Path, Required/Optional Parameters, and Response Schema.
3.  **Format:** Generate documentation in Markdown or OpenAPI (YAML/JSON) format.
4.  **Integrate:** Link the generated documentation to the project's **Archivist** or a hosted portal (e.g., Swagger UI).

## Constraints
- **DO NOT** include internal system endpoints not meant for public consumption.
- **ALWAYS** include example request and response payloads.
- **DO NOT** manually write docs; always derive them from the source of truth (code).
