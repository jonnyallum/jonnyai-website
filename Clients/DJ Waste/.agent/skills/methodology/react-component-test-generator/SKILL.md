# React Component Test Generator

## Description
Creates comprehensive Jest and React Testing Library test suites for React components including unit tests, integration tests, and accessibility checks.

## Implementation Instructions
1.  **Analyze Component:** Identify Props, State, and User Event triggers (click, change).
2.  **Smoke Test:** Write tests to ensure the component renders without crashing.
3.  **Interaction Test:** Use `user-event` to simulate input and verify state/prop changes.
4.  **Async Test:** Handle API calls with `msw` or mocks.
5.  **a11y Test:** Include `jest-axe` checks for basic accessibility.

## Constraints
- **DO NOT** test implementation details (test behavior, not state).
- **ALWAYS** mock external services.
- **DO NOT** ship components without at least 80% test coverage for critical paths.
