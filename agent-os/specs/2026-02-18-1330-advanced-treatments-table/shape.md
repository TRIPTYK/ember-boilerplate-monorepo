# Advanced Treatments Table — Shaping Notes

## Scope

### What We're Building

An advanced treatments table component for GDPR compliance management with the following features:

**Core Features:**
- Multi-column table displaying treatment details (title, type, purposes, status, dates, responsible party)
- Status-based color-coded chips (draft=orange, validated=green, archived=gray, overdue=red)
- Sensitive data indicators (visual flag when treatment contains sensitive personal data)
- Inline treatment type editing (click to edit without opening full form)
- Archive/unarchive functionality with confirmation modal
- Filtering by treatment type (dropdown selector)
- Toggle to include/exclude archived treatments
- View, Edit, and Archive/Unarchive action buttons per row

**Not Included (Deferred):**
- Drag & drop reordering (not essential, can be added later with Ember addon)
- Settings system for custom treatment types (hardcoded initially)
- Advanced search/filtering (text search, date ranges, multi-select)
- Export functionality (CSV, PDF)
- Bulk actions (multi-select, bulk archive)

## Decisions

### Key Technical Decisions

**Component Approach:**
- Create new `TreatmentsAdvancedTable` component alongside existing `TreatmentsTable`
- User chose to create a new component rather than replace the existing one
- Allows gradual migration and comparison between basic and advanced views

**UI Framework:**
- Use @triptyk/ember-ui components (user's existing stack)
- Adapt MUI-based specification to @triptyk/ember-ui equivalents
- Use `TableGenericPrefab` as foundation with custom column renderers

**Drag & Drop:**
- User decided to defer drag & drop functionality
- Not essential for initial release
- Can be added later with ember-sortable or similar addon

**Treatment Types:**
- Hardcode initial types: RH, Marketing, Finance, IT, Juridique
- Settings system for custom types deferred to future implementation
- User indicated settings integration will be implemented later

**Backend Integration:**
- Frontend-first approach with MSW mocks only
- User explicitly chose to defer backend implementation
- Mock new endpoints: archive, unarchive, update-order

### Constraints

**Must Support:**
- Ember.js framework with @triptyk/ember-ui components
- WarpDrive for data management
- Offline-first architecture (SQLite WASM)
- FR/EN internationalization
- Dark theme (existing app theme)

**Technical Constraints:**
- No Material-UI (adapt design to @triptyk/ember-ui)
- No @dnd-kit (Ember ecosystem, defer drag & drop)
- Client-side filtering (no backend query params initially)

## Context

### Visuals

Reference specification document: `TABLEAU_TRAITEMENTS_SPECIFICATIONS.md` (1709 lines)
- Comprehensive specification covering all aspects of the treatments table
- Originally designed for React + Material-UI + TanStack Query
- Adapted for Ember.js + @triptyk/ember-ui + WarpDrive

### References

**Existing Table Implementations:**
- `@libs/users-front/src/components/user-table.gts` - Basic CRUD table pattern
- `@libs/todos-front/src/components/todo-table.gts` - Table with custom column component (checkbox)
- `@libs/treatment-front/src/components/treatment-table.gts` - Current basic treatments table

**Key Patterns to Follow:**
- Use `TableGenericPrefab` from @triptyk/ember-ui
- Define `tableParams` with columns, actionMenu, rowClick
- Use `@columnsComponent` hash for custom cell renderers
- Confirmation modals with `TpkConfirmModalPrefab`
- Flash messages for success/error feedback

### Product Alignment

**Aligns with Product Mission:**
- Privacy-first architecture (client-side data storage)
- Guided usability (clear status indicators, intuitive actions)
- GDPR compliance focus (sensitive data tracking, treatment lifecycle management)

**Tech Stack Compliance:**
- Ember.js frontend ✓
- SQLite WASM for data storage ✓
- Offline-first architecture ✓
- FR/EN internationalization ✓
- @triptyk/ember-ui component library ✓

## Standards Applied

### Frontend Standards

**lib-structure** — Proper folder organization
- Components in `src/components/`
- Table cell components in `src/components/table-cells/`
- Services in `src/services/`
- Schemas in `src/schemas/`
- Routes in `src/routes/dashboard/treatments/`

**route-template** — Separate route handlers and templates
- `view.gts` + `view-template.gts` for read-only view

**service-crud** — TreatmentService with CRUD operations
- Add `archive()`, `unarchive()`, `updateType()` methods
- Use WarpDrive `updateRecord` pattern

**translations** — i18n key conventions
- Keys: `treatments.table.advanced.*`
- Both EN and FR translations required

**http-mocks** — MSW handlers with openapi-msw
- Mock archive, unarchive, update-order endpoints
- Update GET handler for includeArchived param

**data-loading** — WarpDrive store.request() pattern
- Use `query()` with `{ reload: true }` for fresh data
- Client-side filtering after load

**app-integration** — 7-step checklist
- Already integrated, no new wiring needed
- Only adding components and extending existing service

### Testing Standards

**rendering-tests** — Component tests with TestApp
- Test custom cell components
- Test filtering logic
- Test archive/unarchive actions

## User Feedback Summary

From conversation with user:
1. **Scope:** Create new advanced table component (not replace existing)
2. **Backend:** Frontend-first with MSW mocks, backend later
3. **Drag & Drop:** Defer - use Ember equivalent or skip for now (not essential)
4. **Settings:** Hardcode treatment types, settings system to be implemented later
5. **UI Framework:** Use @triptyk/ember-ui (not Material-UI)

## Next Steps

Proceed with implementation following the 14-task plan:
1. ✓ Save spec documentation
2. Extend Treatment schema
3. Extend treatment validation
4. Extend TreatmentService
5. Create custom table cell components
6. Create advanced table component
7. Create view route
8. Update MSW mock handlers
9. Update router configuration
10. Add translation files
11. Create icon assets
12. Update index route template
13. Integration testing
14. Documentation
