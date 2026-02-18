# Phase 1B: Core Treatment Management Wizard — Specification

**Created**: 2026-02-16 15:00
**Updated**: 2026-02-18 (Scope reduced to Steps 1-2 for initial release)
**Status**: Specification Complete (Implementation Pending)
**Phase**: 1B — Core Treatment Management (Initial Release)

---

## Overview

This specification documents the requirements and design for a 2-step GDPR treatment wizard in the Registr application. This initial release covers treatment identification (name + general info). Steps 3-8 (purposes, categories, data, legal basis, sharing, security) are deferred to future releases.

**This is a specification only** — implementation will happen separately when this spec is used.

---

## What's in This Spec

### [plan.md](./plan.md)
Detailed implementation plan with concrete tasks:
- Extends existing `@libs/treatment-front` (basic CRUD → 2-step wizard)
- Schema, changeset, validation, wizard components, route updates, tests

### [shape.md](./shape.md)
Shaping decisions and context:
- Detailed breakdown of steps 1-2
- Architectural decisions (client-side storage, navigation, validation)
- Technical decisions (Zod validation, ImmerChangeset, WarpDrive)

### [standards.md](./standards.md)
Full content of all applicable standards:
- Frontend standards (form-pattern, schema-changeset, service-crud, route-template, translations, file-extensions, app-integration)
- Testing standards (rendering-tests, msw-mocking)

### [references.md](./references.md)
Project structure patterns to follow:
- Frontend library structure (`@libs/treatment-front/`, package: `@libs/treatment-front`)
- App integration points
- Form pattern examples
- Data flow diagrams

### [visuals/](./visuals/)
UI screenshots:
- Step 1: Treatment name form
- Step 2: General identification (entity, DPO, external DPO)
- Archived screenshots for steps 3-8 in `visuals/archived/`

---

## Quick Reference

### The 2 Steps

1. **Treatment Name** — Title, type dropdown, description
2. **General Identification** — Entity info, DPO toggle + form, external DPO toggle + form

### Future Steps (Not Yet Implemented)

3. Purposes — Why process this data (with sub-purposes)
4. Data Subject Categories — Who is affected
5. Data Collected — Personal, financial, sources (with retention periods)
6. Legal Basis — Legal justification for processing
7. Data Sharing — Access, third-parties, EU export
8. Security Measures — What protections are in place

### Key Features

- Step-by-step validation with navigation blocking
- Draft saving at any time
- Offline-first (SQLite WASM storage)
- FR/EN internationalization
- Dark theme matching app design

### Technical Stack

- **Frontend**: Ember.js with WarpDrive data layer
- **Storage**: SQLite WASM (client-side, offline-first)
- **Forms**: Zod validation + ImmerChangeset + TpkForm
- **i18n**: ember-intl (FR/EN)
- **Testing**: Vitest + MSW mocking

---

## Implementation Guidance

When implementing this spec:

1. **Read in this order**:
   - Start with [plan.md](./plan.md) for implementation tasks
   - Review [shape.md](./shape.md) for detailed requirements
   - Study [visuals/](./visuals/) for UI patterns
   - Reference [standards.md](./standards.md) for technical patterns
   - Check [references.md](./references.md) for project structure

2. **Follow the standards**: All 9 standards in [standards.md](./standards.md) apply

3. **Match the UI**: Screenshots in [visuals/](./visuals/) show the target design

---

## Spec Metadata

- **Feature**: Phase 1B Treatment Wizard (Steps 1-2)
- **Spec Created**: 2026-02-16 at 15:00
- **Spec Updated**: 2026-02-18 (scope reduction)
- **Spec Type**: New Feature (no existing code)
- **Implementation Status**: Pending
- **Dependencies**: Phase 1A (Authentication) — Complete
