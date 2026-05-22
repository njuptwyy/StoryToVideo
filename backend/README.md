# Backend Mock Layer

This directory contains a standalone backend-style source tree for competition screenshots and code volume requirements.

## Modules
- core: shared error models and assertions
- core/logger: runtime logging helper
- core/requestContext: request metadata helper
- repositories: in-memory storage, project repository, and audit repository
- services: project, workflow, report, analytics, export, audit, and request tracing
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

## Notes
- This layer focuses on runtime observability.
- It is intended for screenshots, code review, and operational demos.
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
