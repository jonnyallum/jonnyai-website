# Error Handling Strategy

## Description
Designs and implements project-wide error handling middleware, logging protocols, and user-facing error state patterns.

## Implementation Instructions
1.  **Standardize:** Define a common Error object structure.
2.  **Middleware:** Implement global catch-all handlers for the API.
3.  **UI Feedback:** Work with Echo to write helpful (not scary) error messages for Pixel to design.
4.  **Logging:** Ensure all errors are logged with stack traces to Metric/DevOps.
5.  **Recovery:** Implement retry logic for transient failures (e.g. network blips).

## Constraints
- **NEVER** expose raw stack traces to the end-user.
- **ALWAYS** include a unique Correlation ID for support lookups.
