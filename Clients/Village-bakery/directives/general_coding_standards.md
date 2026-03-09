# General Coding Standards (Antigravity v1.0)

All build agents (**Ben**, **Eddie**, **Finn**, **Riley**) must adhere to these standards to ensure the workspace remains maintainable and "trillion-dollar" ready.

## 1. Code Architecture
- **Modularity**: Every function should do one thing. If it’s over 50 lines, it probably needs splitting.
- **Typing**: TypeScript and Python type hints are MANDATORY. No `any` or untyped parameters.
- **Immutability**: Prefer immutable data structures and pure functions where possible.

## 2. Documentation (Lexi-Friendly)
- **Inline Comments**: Explain *why*, not *what*. The code should be clear enough to explain the *what*.
- **JSDoc/Docstrings**: Every public function, class, and component must have a clear docblock.
- **READMEs**: Every new app or major feature folder must include a local `README.md`.

## 3. Security (Sam & Brad-Ready)
- **Zero Hardcoded Secrets**: Use `.env` or secret managers. Never commit keys or passwords.
- **Input Validation**: Assume all input (user, API, or agent) is malicious. Validate everything.
- **Error Handling**: Use structured try/catch blocks. Never swallow errors quietly.

## 4. Design & Brand (Vera & Finn-Friendly)
- **Design Tokens**: Never use hardcoded hex codes for colors. Use the tokens defined in the brand kit.
- **Spacing**: Follow the 8px grid system. No magic numbers in CSS or React Native styles.

## 5. Testing (Gia-Ready)
- **Testability**: Write code that is easy to unit test. If you can't test it, it's probably poorly designed.
- **Coverage**: Every new core feature must include at least one unit test.

---
*Signed: Orion (Workspace Orchestrator)*
