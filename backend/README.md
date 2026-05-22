# Backend Mock Layer

This directory contains a standalone backend-style source tree for competition screenshots and code volume requirements.

## Modules
- config: runtime config loading and profile defaults
- validation: request payload rules and preview helpers
- core: shared error models and assertions
- core/logger: runtime logging helper
- core/requestContext: request metadata helper
- repositories: in-memory storage, project repository, and audit repository
- services: project, workflow, report, analytics, export, audit, and request tracing
- services: project, workflow, report, analytics, export, audit, request tracing, and audit export
- utils: ids and time helpers
- domain: workflow catalog and blueprints
- router: request routing and body parsing
- app: application wiring
- server: HTTP bootstrap

## Audit routes
- /audit/summary
- /audit/records
- /audit/traces
- /audit/dashboard
- /audit/replay
- /audit/context
- /audit/markdown
- /audit/plain

## Notes
- This layer focuses on runtime observability.
- It is intended for screenshots, code review, and operational demos.
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

## Debug routes
- /config
- /validation/rules
- /debug/project-preview
- /debug/scene-preview
- /debug/task-preview
- /debug/stage-preview
- /debug/batch-preview

## Tests
- backend/test: Node.js service-level test suite
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
- The `backend/src/cli.js` entry can print a compact backend summary for demos.
