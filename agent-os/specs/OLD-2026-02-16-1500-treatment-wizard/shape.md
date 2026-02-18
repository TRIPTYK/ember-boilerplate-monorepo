# Phase 1B: Core Treatment Management — Shaping Notes

## Scope

### What We're Building

An 8-step wizard for creating and editing GDPR treatment records. The wizard guides users through documenting data processing activities in a structured, compliant way.

### The 8 Steps

**Step 1: Treatment Name**
- Treatment title (text input)
- Treatment type (dropdown selector)
- Treatment description (textarea)

**Step 2: General Identification**
- Entity identification (name, company number, address, postal code, city, country, phone, email)
- DPO information toggle: "Nous travaillons avec un DPO" (We work with a DPO)
  - If enabled: DPO details form (name, address, postal code, city, country, phone, email)
- External DPO toggle: "Le DPO est externe à la société" (DPO is external to the company)
  - If enabled: External entity details form (same fields as entity)

**Step 3: Purposes**
- Question: "Pourquoi traitez-vous ces données ?" (Why do you process this data?)
- Search input with autocomplete
- Tag-based selection display with X to remove
- Selected tags have info icon (Ⓘ) for details
- "SOUS-FINALITÉS" button opens modal to add sub-purposes
  - Modal contains: name field, description field, ENREGISTRER button

**Step 4: Data Subject Categories**
- Question: "Quelles sont les catégories de personnes concernées par ce traitement ?" (What are the categories of people affected by this treatment?)
- Search input with autocomplete
- Tag-based selection with X to remove
- "PRÉCISIONS" button opens modal for additional details
  - Modal title: "Précisions sur les éléments sélectionnés"
  - Single text input field
  - ENREGISTRER button

**Step 5: Data Collected**
Three parallel columns:

**Column 1: Personal Data** ("Quelles données personnelles collectez-vous ?")
- Search input
- Tag display with shield icons (🛡️ for sensitive data)
- Tags have menu button (⋮) for options
- Examples shown: Nom, Prénom, Email, Téléphone, etc.
- Retention period selector at bottom

**Column 2: Financial/Economic Data** ("Quelles informations d'ordre économique et financier récoltez-vous ?")
- Same pattern as personal data
- Examples: Extrait de casier judiciaire, Chiffre d'affaires, etc.
- Retention period selector

**Column 3: Data Sources** ("Quelle est la source des données ?")
- Search input
- Tag display (Employé Ⓧ, Agence intérim Ⓧ)
- "PRÉCISIONS" button for details
- Examples: Fichiers clients, Réseaux sociaux, etc.

**Step 6: Legal Basis**
- Question: "Quelles sont les bases légales de ce traitement ?" (What are the legal bases for this treatment?)
- Search input with autocomplete
- Tag-based selection (Obligations (pré)contractuelles Ⓧ, Intérêts légitimes du RT Ⓧ)
- Examples: Consentement, Sauvegarde des intérêts vitaux, etc.

**Step 7: Data Sharing**
Three sections:

**Section 1: Data Access** ("Accès aux données")
- Search input
- Tag display (Agence intérim Ⓧ)
- "PRÉCISIONS" button
- Examples: Administrateurs, Fournisseurs externes, Service client, Employés

**Section 2: Third-Party Sharing** ("Partage des données avec des tiers")
- Search input
- Tag display
- "PRÉCISIONS" button
- Examples: Clients, Fournisseurs, Filiales, Administration publique

**Section 3: Non-EU Export** ("Données hors UE")
- Toggle: "Les données sont exportées hors UE" (Data is exported outside the EU)

**Step 8: Security Measures**
- Question: "Quelles sont les mesures de sécurité que vous utilisez ?" (What security measures do you use?)
- Search input with autocomplete
- Tag display with info icons
- Selected: Limitation des accès aux seuls personnes autorisées Ⓧ, Sécurisation des moyens de stockages des données Ⓧ, Minimisation des données Ⓧ
- "PRÉCISIONS" button
- Examples: Sécurité des partenaires, Tests de sécurité, Sécurité réseau, Accès contrôlé

### Navigation & Actions

**Navigation Buttons (Bottom of Page):**
- PRÉCÉDENT (Previous) - Blue outline button
- ENREGISTRER (Save) - Blue outline button
- PASSER (Skip) - Blue outline button
- SUIVANT (Next) - Gold/yellow solid button
- TERMINER (Finish) - Gold/yellow solid button (on step 8)

**Progress Indicator:**
- 8 numbered circles at top of page
- Completed steps: blue checkmark
- Current step: blue highlight
- Future steps: gray

**Draft Saving:**
- Users can save progress at any step via ENREGISTRER button
- Can return later to complete the wizard
- Auto-save when navigating between steps (implicit in navigation)

**Validation:**
- Each step must be validated before proceeding to the next
- SUIVANT button is blocked if current step is invalid
- Validation happens on step-by-step basis, not global form validation

## Decisions

### Architecture Decisions

**Library Structure:**
- Create new `@libs/treatment-front` library for frontend wizard components
- Follow the established library pattern from `@libs/users-front` and `@libs/todos-front`
- **No backend library needed** — treatments stay entirely client-side

**Client-Side Storage:**
- All treatment data stored in SQLite WASM (fully offline)
- No backend integration — data never leaves the client
- Treatment records are private and local to each user's device

**Form State Management:**
- Use ImmerChangeset for wizard state
- Single changeset for entire treatment (all 8 steps)
- Validation schemas per step using Zod
- Step-by-step validation with blocking navigation

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
- Individual step components for each of 8 steps
- Reusable components:
  - SearchableTagInput (for categorical selections)
  - PrecisionsModal (for additional details)
  - SubPurposesModal (for step 3)
  - RetentionPeriodSelector (for step 5)

**Data Patterns:**
- Searchable selections use local parameter data (not fetched from API)
- Parameters stored in separate parameter tables (treatment types, purposes, legal bases, etc.)
- Tag-based UI for multi-select fields
- Modal dialogs for nested/additional data entry

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

**Does Not Include (Phase 1B):**
- Treatment list view (separate ticket)
- Treatment detail/readonly view (separate ticket)
- Export/import functionality (future enhancement)
- Backend synchronization (not planned — treatments remain client-side only)

## Context

### Visuals

10 screenshots provided covering:
- All 8 wizard steps
- Modal dialogs (sub-purposes, precisions, data access details)
- Complete UI patterns and interactions
- Dark theme styling reference
- Component layouts and spacing

Screenshots saved in `visuals/` subfolder.

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
- ✅ Privacy-first architecture (SQLite WASM, client-side storage)
- ✅ Guided usability (8-step wizard breaks down complexity)
- ✅ Autonomous deployment (offline-first PWA)

**Roadmap Position:**
- Phase 1B milestone following completed Phase 1A authentication
- Core feature for GDPR compliance tracking
- Foundation for future enhancements (list view, export, sync)

**Tech Stack Compliance:**
- ✅ Ember.js frontend
- ✅ SQLite WASM for data storage
- ✅ Offline-first architecture
- ✅ FR/EN internationalization

## Standards Applied

### Frontend Standards

**form-pattern** — Zod validation + ImmerChangeset + TpkForm
- Wizard uses single changeset for all 8 steps
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
- Mock parameter fetching for dropdowns
- Enable development without backend

## Implementation Notes

**When implementing, consider:**

1. **Wizard State Machine:**
   - Track current step index
   - Validate step before allowing navigation
   - Save draft on step change

2. **Component Reusability:**
   - SearchableTagInput component used across multiple steps
   - Modal dialogs can be generic with slotted content
   - Retention period selector reused in step 5

3. **Validation Timing:**
   - Validate on blur for individual fields
   - Validate entire step before SUIVANT
   - Show errors inline, not in global banner

4. **Draft Persistence:**
   - Save to SQLite on ENREGISTRER click
   - Auto-save on step navigation
   - Load draft on wizard entry if exists

5. **Accessibility:**
   - Keyboard navigation between steps
   - Screen reader announcements for step changes
   - Focus management on navigation

6. **Performance:**
   - Lazy load step components
   - Debounce search inputs
   - Optimize re-renders with careful memo usage

This spec provides the foundation for implementation. Refer to standards.md for detailed technical patterns and references.md for project structure guidance.
