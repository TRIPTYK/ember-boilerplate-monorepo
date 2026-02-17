# Phase 1B: Core Treatment Management Wizard — Specification

**Created**: 2026-02-16 15:00
**Status**: Specification Complete (Implementation Pending)
**Phase**: 1B — Core Treatment Management

---

## Overview

This specification documents the requirements and design for the 8-step GDPR treatment wizard in the Registr application. This wizard guides users through documenting data processing activities in a structured, compliant way.

**This is a specification only** — implementation will happen separately when this spec is used.

---

## What's in This Spec

### 📋 [plan.md](./plan.md)
Complete planning document including:
- Context and background
- Why this feature matters
- Scope and constraints confirmed
- Detailed task breakdown for creating this spec
- Success criteria

### 🎨 [shape.md](./shape.md)
Shaping decisions and context including:
- Detailed breakdown of all 8 wizard steps
- UI patterns and interactions
- Architectural decisions (client-side storage, navigation, validation)
- Technical decisions (Zod validation, ImmerChangeset, WarpDrive)
- Product alignment notes

### 📚 [standards.md](./standards.md)
Full content of all applicable standards:
- Frontend standards (form-pattern, schema-changeset, service-crud, route-template, translations, file-extensions, app-integration)
- Testing standards (rendering-tests, msw-mocking)
- Complete reference material for implementation

### 🔗 [references.md](./references.md)
Project structure patterns to follow:
- Frontend library structure (`@libs/treatments-front/`)
- Backend library structure (`@libs/treatments-backend/`)
- App integration points
- Form pattern examples
- Data flow diagrams
- Testing patterns

### 🖼️ [visuals/](./visuals/)
UI screenshots showing:
- All 8 wizard steps
- Modal dialogs for sub-purposes, precisions, data access
- Complete UI patterns and styling reference
- Dark theme implementation
- See [visuals/README.md](./visuals/README.md) for detailed breakdown

---

## Quick Reference

### The 8 Steps

1. **Treatment Name** — Title, type, description
2. **General Identification** — Entity info, DPO, external DPO
3. **Purposes** — Why process this data (with sub-purposes)
4. **Data Subject Categories** — Who is affected
5. **Data Collected** — Personal, financial, sources (with retention periods)
6. **Legal Basis** — Legal justification for processing
7. **Data Sharing** — Access, third-parties, EU export
8. **Security Measures** — What protections are in place

### Key Features

- ✅ Step-by-step validation with navigation blocking
- ✅ Draft saving at any time
- ✅ Offline-first (SQLite WASM storage)
- ✅ Search + tag selection for categorical data
- ✅ Modal dialogs for additional details
- ✅ FR/EN internationalization
- ✅ Dark theme matching app design

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
   - Start with [plan.md](./plan.md) for context
   - Review [shape.md](./shape.md) for detailed requirements
   - Study [visuals/](./visuals/) for UI patterns
   - Reference [standards.md](./standards.md) for technical patterns
   - Check [references.md](./references.md) for project structure

2. **Follow the standards**:
   - All 9 standards in [standards.md](./standards.md) apply
   - Don't deviate without good reason
   - Patterns are proven and working in existing code

3. **Match the UI**:
   - Screenshots in [visuals/](./visuals/) show the target design
   - Dark theme, blue/gold colors, consistent spacing
   - Tag-based selections, modal dialogs, progress indicator

4. **Test thoroughly**:
   - Component tests for each wizard step
   - Integration tests for full wizard flow
   - MSW mocks for development without backend

---

## Key Decisions

### Offline-First
All treatment data stored client-side in SQLite WASM. No backend needed in Phase 1B. Future sync to PostgreSQL may be added in Phase 2.

### Single Changeset
Entire wizard uses one ImmerChangeset for all 8 steps. Validation happens per-step with Zod schemas.

### Draft Saving
Users can save progress at any time. Auto-save on step navigation. Resume later from where they left off.

### No Backend (Phase 1B)
Focus is frontend wizard only. Backend sync can be added later without changing wizard UX.

---

## Questions?

This spec should be comprehensive enough to begin implementation without additional clarification. If questions arise:

1. Check if the answer is in one of the spec files
2. Review the screenshots in [visuals/](./visuals/)
3. Look at existing patterns in `@libs/users-front` or `@libs/todos-front`
4. Refer to standards in [standards.md](./standards.md)

If still unclear, document the question and seek clarification before proceeding.

---

## Spec Metadata

- **Feature**: Phase 1B Treatment Wizard
- **Spec Created**: 2026-02-16 at 15:00
- **Spec Type**: New Feature (no existing code)
- **Implementation Status**: Pending
- **Dependencies**: Phase 1A (Authentication) — ✅ Complete

---

*This spec is discoverable for future reference. Months or years later, anyone can find this spec and understand what was built and why.*
