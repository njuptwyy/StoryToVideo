# Backend Mock Layer

This directory contains a standalone backend-style source tree for competition screenshots and code volume requirements.

## Modules
- config: runtime config loading and profile defaults
- validation: request payload rules and preview helpers
- core: shared error models and assertions
- utils: ids and time helpers
- domain: workflow catalog and blueprints
- repositories: in-memory storage and project repository
- services: project, workflow, report, analytics, and export services
- controllers: route registration split by domain
- router: request routing and body parsing
- app: application wiring
- server: HTTP bootstrap

## Debug routes
- /config
- /validation/rules
- /debug/project-preview
- /debug/scene-preview
- /debug/task-preview
- /debug/stage-preview
- /debug/batch-preview

## Tests
- test: project service behavior
- test: workflow transitions
- test: report snapshots
- test: analytics and export outputs

## Notes
- This layer is intentionally decoupled from the Vue frontend.
- It can be used as a screenshot-friendly backend code block.
- The code is organized to show clear responsibilities per module.
- It is intended for screenshots, code review, and API structure demos.
- The `backend/test` folder contains a Node.js test suite.
