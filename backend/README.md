# Backend Mock Layer

This directory contains a standalone backend-style source tree for competition screenshots and code volume requirements.

## Modules
- core: shared error models and assertions
- utils: ids and time helpers
- domain: workflow catalog and blueprints
- repositories: in-memory storage and project repository
- services: project, workflow, and report services
- router: request routing and body parsing
- app: application wiring
- server: HTTP bootstrap

## Notes
- This layer is intentionally decoupled from the Vue frontend.
- It can be used as a screenshot-friendly backend code block.
- The code is organized to show clear responsibilities per module.
