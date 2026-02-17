# Phase 1B: Core Treatment Management - Spec Creation Plan

## Context

This plan creates comprehensive specification documentation for the Phase 1B treatment wizard. **This is NOT an implementation plan** - it only creates documentation that will be used later when implementing the feature.

### What We're Building

An 8-step wizard for creating and editing GDPR treatment records in the Registr application. This is Phase 1B of the product roadmap, following the completed Phase 1A authentication system.

### Why This Matters

- **GDPR Compliance**: Organizations need structured guidance to document data processing activities
- **User Experience**: The wizard breaks down complex compliance requirements into manageable steps
- **Privacy-First**: All treatment data stays client-side in SQLite WASM storage
- **Offline-First**: Users can work without internet connectivity after authentication

### Scope Confirmed

- **New feature** - Building from scratch (no existing treatment wizard)
- **Outcome** - Save treatment and return to treatments list
- **Constraints**:
  - Must support draft saving (users can save progress and return later)
  - Step validation required (validate each step before proceeding)
  - Offline-first SQLite WASM storage
  - Ember.js frontend with WarpDrive data layer
  - FR/EN internationalization
  - JSON:API backend format

### Visuals Provided

Complete UI screenshots showing all 8 wizard steps:
1. Treatment name (title, type dropdown, description)
2. General identification (entity info, DPO, external DPO toggle)
3. Purposes (searchable selection with sub-purposes modal)
4. Data subject categories (searchable selection with precisions modal)
5. Data collected (3 columns: personal data, financial data, data sources with retention periods)
6. Legal basis (searchable selection)
7. Data sharing (data access, third-party sharing, EU export toggle)
8. Security measures (searchable selection with precisions modal)

UI patterns observed:
- Stepped progress indicator at top
- Navigation buttons at bottom (PRÉCÉDENT, ENREGISTRER, PASSER, SUIVANT/TERMINER)
- Searchable tag-based selections with "X" removal
- "PRÉCISIONS" buttons opening modals for additional details
- Dark blue theme consistent with existing app

---

## Task 1: Save Spec Documentation

Create the complete specification folder structure and content.

### 1.1 Create Spec Folder Structure

```
agent-os/specs/2026-02-16-1500-treatment-wizard/
├── plan.md           # This complete plan
├── shape.md          # Shaping decisions and context
├── standards.md      # Applicable standards with full content
├── references.md     # Project structure patterns (no direct feature reference)
└── visuals/          # UI screenshots (10 images provided)
    ├── step-1-name.png
    ├── step-2-general-info.png
    ├── step-3-purposes.png
    ├── step-3-sub-purposes-modal.png
    ├── step-4-categories.png
    ├── step-4-precisions-modal.png
    ├── step-5-data.png
    ├── step-6-legal-basis.png
    ├── step-7-sharing.png
    ├── step-7-access-modal.png
    └── step-8-security.png
```

### 1.2 Write shape.md

Document the shaping conversation and key decisions:

#### Content Structure:

**Scope Section:**
- 8-step wizard for GDPR treatment management
- Each step detailed with fields and interactions
- Draft saving capability at any step
- Validation requirements per step before navigation

**Decisions Section:**
- New feature (not modifying existing)
- **Create new `@libs/treatments-front` library** following established patterns
- Client-side storage via SQLite WASM
- No backend entity needed initially (offline-first)
- Step-by-step validation with blocking navigation
- Search + tag selection pattern for categorical data
- Modal dialogs for additional details (sub-purposes, precisions)
- Save draft at any time, auto-save on navigation

**Context Section:**
- **Visuals**: 10 screenshots covering all steps and modals
- **References**: No existing treatment wizard; using project structure patterns from users-front and todos-front
- **Product alignment**:
  - Aligns with Phase 1B roadmap milestone
  - Follows privacy-first architecture (data stays client-side)
  - Supports guided usability principle from mission
  - Ember.js + SQLite WASM + offline-first requirements
  - FR/EN internationalization required

**Standards Applied:**
- frontend/form-pattern — Multi-step wizard will use Zod + ImmerChangeset + TpkForm
- frontend/schema-changeset — Treatment schema and DraftTreatment changeset
- frontend/service-crud — Treatment service for save/update/delete
- frontend/route-template — Wizard route structure
- frontend/translations — FR/EN translation keys
- frontend/file-extensions — .gts for components, .ts for logic
- frontend/app-integration — Wire into @apps/front
- testing/rendering-tests — Component tests for wizard steps
- testing/msw-mocking — Mock treatment API endpoints

### 1.3 Write standards.md

Include the **full content** of each applicable standard so implementers have everything they need.

#### Standards to Include:

1. **frontend/form-pattern** (Zod + ImmerChangeset + TpkForm)
2. **frontend/schema-changeset** (WarpDrive schema + ImmerChangeset)
3. **frontend/service-crud** (Entity service CRUD operations)
4. **frontend/route-template** (Route handler + template conventions)
5. **frontend/translations** (i18n key naming and file locations)
6. **frontend/file-extensions** (.gts vs .ts usage)
7. **frontend/app-integration** (7-step integration checklist)
8. **testing/rendering-tests** (Component testing with TestApp)
9. **testing/msw-mocking** (Type-safe API mocking)

Format:
```markdown
# Standards for Phase 1B: Core Treatment Management

The following standards apply to this implementation.

---

## frontend/form-pattern

[Full content of the standard file]

---

## frontend/schema-changeset

[Full content of the standard file]

---

[Continue for all 9 standards...]
```

### 1.4 Write references.md

Document the project structure patterns to follow (since there's no existing treatment wizard).

#### Content Structure:

**Project Structure Patterns:**

1. **Frontend Library Pattern** (`@libs/treatments-front/`)
   - Based on existing `@libs/users-front/` and `@libs/todos-front/` structure
   - Folder structure to follow
   - Key exports from index.ts

2. **Backend Library Pattern** (`@libs/treatments-backend/`)
   - Based on existing backend lib patterns
   - Entities, routes, serializers structure
   - Module registration pattern

3. **App Integration Points**
   - Router configuration in `@apps/front/app/router.ts`
   - Application route initialization
   - Store schema registration
   - Translation file structure

4. **Form Pattern Example**
   - Reference: `@libs/users-front/src/components/forms/user-form.gts`
   - Validation pattern with Zod schemas
   - Service integration for save operations

5. **Data Flow**
   - Form → Changeset → Service → WarpDrive Store → SQLite WASM (offline)
   - (Future: potential sync to backend PostgreSQL)

**No Direct Feature References:**
- No existing treatment management code
- No existing multi-step wizard pattern
- Will need to design wizard navigation component from scratch

### 1.5 Copy Visual Screenshots

Save all 10 provided screenshots to `visuals/` subfolder with descriptive names.

### 1.6 Write plan.md

Copy this complete plan document to the spec folder.

---

## Success Criteria

When complete, the spec folder contains:

✓ **plan.md** - This complete planning document
✓ **shape.md** - Shaping decisions, scope, context (2-3 pages)
✓ **standards.md** - Full content of 9 relevant standards (comprehensive reference)
✓ **references.md** - Project structure patterns and integration points
✓ **visuals/** - All 10 UI screenshots organized and named

The spec should be comprehensive enough that a developer can:
1. Understand what needs to be built and why
2. See exactly what the UI should look like
3. Know which standards and patterns to follow
4. Reference the existing project structure
5. Begin implementation without additional clarification

---

## Notes

- This spec documents requirements only - **no implementation**
- Implementation will happen in a separate phase when this spec is used
- The spec is discoverable for future reference (months/years later)
- Focus on clarity and completeness over brevity
