# Advanced Treatments Table Implementation

## Overview

Create a comprehensive treatments table component that provides advanced GDPR compliance management features including:
- Multi-column display with treatment details (title, type, status, dates, responsible party)
- Status-based filtering and archived treatments toggle
- Inline treatment type editing
- Archive/unarchive functionality
- Sensitive data indicators
- Enhanced table actions (view, edit, archive)

This implementation adapts the comprehensive specification document to work with the existing Ember.js + @triptyk/ember-ui stack, creating a new advanced table component alongside the existing basic table.

## Architecture Decisions

**Component Strategy:**
- Create new `TreatmentsAdvancedTable` component alongside existing `TreatmentsTable`
- Use @triptyk/ember-ui `TableGenericPrefab` as foundation
- Extend with custom column renderers for status chips, sensitive data icons, and inline editing
- No drag & drop initially (deferred - not essential per user feedback)

**Data Management:**
- Leverage existing WarpDrive store and Treatment schema
- Add new fields to schema: `status`, `order`, `isOverDueDate`, `dueDateForUpdate`
- Extend treatment data structure to support nested data groups
- Use existing TreatmentService with new methods for archive/unarchive

**Backend Integration:**
- MSW mocks only (frontend-first approach)
- Mock new endpoints: archive, unarchive, update-order (for future drag & drop)
- Backend implementation deferred to later phase

**Settings System:**
- Hardcode treatment types initially (RH, Marketing, Finance, IT, Juridique)
- Settings system for custom types deferred to future implementation
- Use local state for type filter

## Implementation Tasks

See the full plan in the attached plan file for detailed task breakdown covering:
1. Save spec documentation
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

## Success Criteria

- Advanced table displays all specified columns correctly
- Status chips show correct colors based on status and overdue flag
- Sensitive data indicator accurately detects sensitive data presence
- Treatment type can be edited inline without opening full form
- Archive/unarchive actions work and update UI immediately
- Filtering by treatment type works correctly
- Include archived toggle shows/hides archived treatments
- View action navigates to read-only treatment view
- Edit action navigates to treatment edit form
- All translations display correctly in EN and FR
- Mock handlers respond correctly to all new endpoints
- Component integrates seamlessly with existing treatment routes
- All tests pass
- No linter errors
