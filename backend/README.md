# Backend Mock Layer

This directory contains a standalone backend-style source tree for competition screenshots and code volume requirements.

## Modules
- core: shared error models and assertions
- utils: ids and time helpers
- domain: workflow catalog and blueprints
- repositories: in-memory storage and project repository
- services: project, workflow, report, analytics, and export services
- serialization: DTO serializers and payload builders
- router: request routing and body parsing
- app: application wiring
- server: HTTP bootstrap

## Serialization routes
- /serialize/projects
- /serialize/projects/:id/card
- /serialize/projects/:id/detail
- /serialize/workflow/:stageKey
- /serialize/pipeline
- /serialize/summary
- /serialize/overview
- /serialize/snapshot
- /serialize/export/:projectId/package
- /serialize/export/:projectId/manifest

## Notes
- This layer is intentionally decoupled from the Vue frontend.
- It can be used as a screenshot-friendly backend code block.
- The code is organized to show clear responsibilities per module.
- It is intended for screenshots and data-shaping demos.
