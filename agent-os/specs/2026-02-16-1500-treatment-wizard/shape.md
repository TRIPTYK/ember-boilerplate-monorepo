# Phase 1B: Core Treatment Management — Shaping Notes

## Scope

### What We're Building

A 2-step wizard for creating and editing GDPR treatment records. This is the initial release covering treatment identification only. Steps 3-8 (purposes, categories, data collected, legal basis, sharing, security) are deferred to future releases.

### The 2 Steps

**Step 1: Treatment Name**
- `title` — Treatment title (text input, required)
- `treatmentType` — Treatment type (dropdown selector)
- `description` — Treatment description (textarea)

**Step 2: General Identification**
- `responsible` — Entity identification (nested contactInfoSchema):
  - `responsible.fullName` — Entity name (required)
  - `responsible.entityNumber` — Company number
  - `responsible.address.streetAndNumber` — Address
  - `responsible.address.postalCode` — Postal code
  - `responsible.address.city` — City
  - `responsible.address.country` — Country
  - `responsible.address.phone` — Phone
  - `responsible.address.email` — Email
- `hasDPO` — Toggle: "Nous travaillons avec un DPO" (boolean)
  - If true: `DPO` form (nested contactInfoSchema):
    - `DPO.fullName`, `DPO.address.*` (same address fields)
- `hasExternalDPO` — Toggle: "Le DPO est externe à la société" (boolean)
  - If true: `externalOrganizationDPO` form (nested contactInfoSchema):
    - `externalOrganizationDPO.fullName`, `externalOrganizationDPO.entityNumber`, `externalOrganizationDPO.address.*`

### Navigation & Actions

**Navigation Buttons (Bottom of Page):**
- ANNULER (Cancel) - Blue outline button (step 1 only)
- COMMENCER (Start) - Gold/yellow solid button (step 1 only)
- PRÉCÉDENT (Previous) - Blue outline button
- ENREGISTRER (Save) - Blue outline button
- PASSER (Skip) - Blue outline button
- SUIVANT (Next) - Gold/yellow solid button
- TERMINER (Finish) - Gold/yellow solid button (step 2)

**Progress Indicator:**
- 2 numbered circles at top of page
- Completed steps: blue checkmark
- Current step: blue highlight
- Future steps: gray

**Draft Saving:**
- Users can save progress at any step via ENREGISTRER button
- Can return later to complete the wizard
- Auto-save when navigating between steps

**Validation:**
- Each step must be validated before proceeding to the next
- SUIVANT button is blocked if current step is invalid
- Validation happens on step-by-step basis, not global form validation

## Decisions

### Architecture Decisions

**Library Structure:**
- `@libs/treatment-front` (package: `@libs/treatment-front`) already exists with basic CRUD
- Transform existing simple form into 2-step wizard
- Follow the established library pattern from `@libs/users-front` and `@libs/todos-front`
- **No backend library needed** — treatments stay entirely client-side

**Client-Side Storage:**
- All treatment data stored in SQLite WASM (fully offline)
- No backend integration — data never leaves the client
- Treatment records are private and local to each user's device

**Data Model:**
- Nested Zod schemas: `treatmentSchema` (validated), `draftTreatmentSchema` (partial), `treatmentResponseSchema` (API response)
- Reusable sub-schemas: `addressSchema`, `contactInfoSchema`, `dataWithInfoSchema`
- Preprocess logic strips DPO/externalOrganizationDPO when toggles are false
- `TreatmentData` / `DraftTreatmentData` types derived from schemas

**Form State Management:**
- Use ImmerChangeset for wizard state (supports nested paths via Immer: `changeset.set('responsible.address.city', 'Bruxelles')`)
- Single changeset for entire treatment (both steps)
- Validation schemas per step using Zod (derived from main schemas)
- Step-by-step validation with blocking navigation
- Draft saving uses `draftTreatmentSchema` (all fields optional)

**Navigation Pattern:**
- Step-by-step wizard with linear navigation
- Can go backward freely (PRÉCÉDENT)
- Can skip steps (PASSER) - but validation still required for completion
- Must validate current step before SUIVANT
- Draft saving at any time (ENREGISTRER)
- Auto-save on navigation to preserve progress

**Component Structure:**
- Wizard container component manages:
  - Current step state
  - Progress indicator
  - Navigation buttons
  - Overall changeset
- Individual step components for each of 2 steps

### Technical Decisions

**No Backend Integration:**
- Treatment data is purely client-side (SQLite WASM)
- No API endpoints for treatments
- No backend synchronization — data stays local to the user's device
- This aligns with the privacy-first architecture (sensitive compliance data never transmitted)

**Validation Strategy:**
- Zod schemas define validation rules per step
- Validation errors shown inline with form fields
- Step cannot be "completed" until valid
- Draft saving allowed even with validation errors

**i18n Requirements:**
- All labels, placeholders, validation messages in translation files
- Support FR and EN locales
- Translation keys follow pattern: `treatments.wizard.step{N}.{key}`

### Constraints

**Must Support:**
- Draft saving and resumption
- Step-by-step validation with navigation blocking
- Offline-first operation (no network required)
- FR/EN language switching
- Dark theme (existing app theme)

**Does Not Include (This Release):**
- Steps 3-8 of the wizard (purposes, categories, data, legal basis, sharing, security) — deferred to future releases
- Treatment list view (separate ticket)
- Treatment detail/readonly view (separate ticket)
- Export/import functionality (future enhancement)
- Backend synchronization (not planned — treatments remain client-side only)

## Context

### Visuals

3 screenshots provided covering:
- Step 1: Treatment name form
- Step 2: General identification (entity, DPO, external DPO)
- Step 2: Parameter configuration variant

Screenshots saved in `visuals/` subfolder. Additional screenshots for steps 3-8 archived in `visuals/archived/`.

### References

**No Direct Feature References:**
- No existing treatment management code in codebase
- No existing multi-step wizard pattern to reference
- Will build wizard navigation from scratch

**Project Structure Patterns:**
- Based on `@libs/users-front/` and `@libs/todos-front/` structure
- Frontend library pattern with schemas, services, components, routes
- WarpDrive for data management
- ImmerChangeset + Zod + TpkForm for forms
- MSW mocking for development

**Integration Points:**
- Wire into `@apps/front` following app-integration standard
- Register routes under `/dashboard/treatments/`
- Add schema to WarpDrive store
- Create translation files in FR/EN

### Product Alignment

**Aligns with Product Mission:**
- Privacy-first architecture (SQLite WASM, client-side storage)
- Guided usability (wizard breaks down complexity)
- Autonomous deployment (offline-first PWA)

**Roadmap Position:**
- Phase 1B milestone following completed Phase 1A authentication
- Initial release: steps 1-2 (treatment identification)
- Future releases: steps 3-8 (detailed GDPR compliance data)

**Tech Stack Compliance:**
- Ember.js frontend
- SQLite WASM for data storage
- Offline-first architecture
- FR/EN internationalization

## Standards Applied

### Frontend Standards

**form-pattern** — Zod validation + ImmerChangeset + TpkForm
- Wizard uses single changeset for both steps
- Each step has validation schema
- TpkForm component for form rendering

**schema-changeset** — WarpDrive schema + ImmerChangeset definition
- Treatment schema defines data structure
- DraftTreatment changeset interface for form state

**service-crud** — Treatment service for save/update/delete operations
- Service handles persistence to SQLite WASM
- save() method dispatches to create/update

**route-template** — Route handler + template separation
- Wizard route + wizard template
- Changeset initialized in template class

**translations** — i18n key conventions
- Keys: `treatments.wizard.step{N}.{key}`
- FR and EN translation files required

**file-extensions** — .gts for templates, .ts for logic
- Wizard components in .gts files
- Services and schemas in .ts files

**app-integration** — 7-step checklist to wire into @apps/front
- Add dependency
- Initialize lib
- Register mock handlers
- Register routes
- Register schema in store
- Add CSS source
- Add translations

### Testing Standards

**rendering-tests** — Component tests with TestApp
- Test wizard steps individually
- Test navigation between steps
- Test validation blocking

**msw-mocking** — Type-safe API mocking
- Mock treatment CRUD endpoints
- Enable development without backend
