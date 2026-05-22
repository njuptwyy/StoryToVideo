# Backend Mock Layer

This directory contains a standalone backend-style source tree for competition screenshots and code volume requirements.

## Modules
- core: shared error models and assertions
- utils: ids and time helpers
- domain: workflow catalog and blueprints
- repositories: in-memory storage and project repository
- services: project, workflow, report, analytics, and export services
- controllers: route registration split by domain
- presentation: console-formatting helpers for CLI output
- router: request routing and body parsing
- app: application wiring
- server: HTTP bootstrap
- cli: console summary generator

## Tests
- backend/test: Node.js service-level test suite

## Notes
- This layer is intentionally decoupled from the Vue frontend.
- It can be used as a screenshot-friendly backend code block.
- The code is organized to show clear responsibilities per module.
- The `backend/src/cli.js` entry can print a compact backend summary for demos.
