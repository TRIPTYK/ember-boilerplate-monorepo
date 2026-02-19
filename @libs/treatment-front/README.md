# Treatment Front Library

Frontend library for GDPR treatment management with advanced table features, status tracking, and sensitive data indicators.

## Features

### Advanced Treatments Table

The `TreatmentsAdvancedTable` component provides a comprehensive interface for managing GDPR treatments:

- **Multi-column display** with treatment details (title, type, purposes, status, dates, responsible party)
- **Status-based filtering** with color-coded status chips
- **Inline treatment type editing** without opening the full form
- **Archive/unarchive functionality** with confirmation modals
- **Sensitive data indicators** that automatically detect sensitive personal or financial data
- **Treatment type filtering** with dropdown selector
- **Toggle to include/exclude archived treatments**
- **View, Edit, and Archive/Unarchive actions** per row

### Status Workflow

Treatments follow a lifecycle with three statuses:

```
Draft → Validated → Archived
         ↓            ↑
         └────────────┘
```

- **Draft** (Orange chip): Initial state, treatment is being created or edited
- **Validated** (Green chip): Treatment is complete and active
- **Archived** (Gray outlined chip): Treatment is no longer active but retained for records
- **Overdue** (Red chip): Treatment has passed its due date for update

### Sensitive Data Detection

The system automatically detects sensitive data by checking:

- `personalDataGroup.data.name` array for items with `isSensitive: true`
- `financialDataGroup.data.name` array for items with `isSensitive: true`

Visual indicators:
- **Red X icon**: Contains sensitive data
- **Green checkmark icon**: No sensitive data

### Treatment Types

Currently hardcoded treatment types:
- RH (Human Resources)
- Marketing
- Finance
- IT
- Juridique (Legal)

Future enhancement: Settings system for customizable types.

## Components

### Main Components

- **`TreatmentsAdvancedTable`** - Main table component with filtering and custom columns
- **`TreatmentsTable`** - Basic table component (legacy, still available)

### Table Cell Components

Located in `src/components/table-cells/`:

- **`StatusChip`** - Displays treatment status with color coding
- **`SensitiveDataIndicator`** - Shows icon indicating presence of sensitive data
- **`TreatmentTypeEditor`** - Inline editor for treatment type
- **`TreatmentActions`** - View, Edit, and Archive/Unarchive action buttons

## Services

### TreatmentService

Located in `src/services/treatment.ts`.

**Methods:**

- `save(data)` - Creates or updates a treatment
- `create(data)` - Creates a new treatment
- `update(data)` - Updates an existing treatment
- `delete(data)` - Deletes a treatment
- `archive(id)` - Archives a treatment (sets status to 'archived')
- `unarchive(id)` - Unarchives a treatment (sets status to 'validated')
- `updateType(id, treatmentType)` - Updates treatment type inline

## Routes

- `/dashboard/treatments` - List all treatments
- `/dashboard/treatments/create` - Create new treatment
- `/dashboard/treatments/:id/edit` - Edit treatment
- `/dashboard/treatments/:id/view` - View treatment (read-only)

## Schema

### Treatment Schema

Located in `src/schemas/treatments.ts`.

**Fields:**

- `id` - Unique identifier
- `creationDate` - ISO date string
- `updateDate` - ISO date string (optional)
- `dueDateForUpdate` - ISO date string (optional)
- `status` - 'draft' | 'validated' | 'archived'
- `order` - Number (for future drag & drop ordering)
- `isOverDueDate` - Boolean flag
- `data` - Nested object with treatment details (see TreatmentData type)

### TreatmentData Structure

Includes:
- Basic info: `title`, `description`, `treatmentType`
- Responsible entity and DPO information
- Purposes (`reasons`), legal bases, data subject categories
- Personal and financial data groups with sensitive data flags
- Data sources, retention period, third-party access
- Security measures

## HTTP Mocks

Located in `src/http-mocks/treatments.ts`.

**Endpoints:**

- `GET /api/v1/treatments` - List treatments (supports `includeArchived` query param)
- `GET /api/v1/treatments/:id` - Get single treatment
- `POST /api/v1/treatments` - Create treatment
- `PATCH /api/v1/treatments/:id` - Update treatment
- `DELETE /api/v1/treatments/:id` - Delete treatment
- `POST /api/v1/treatments/:id/archive` - Archive treatment
- `POST /api/v1/treatments/:id/unarchive` - Unarchive treatment
- `POST /api/v1/treatments/update-order` - Update treatment order (for future drag & drop)

## Translations

Translation keys are located in `@apps/front/translations/treatments/`.

**Key namespaces:**

- `treatments.wizard.*` - Wizard step labels and validation
- `treatments.table.advanced.*` - Advanced table headers, actions, filters, status labels, messages
- `treatments.forms.*` - Form validation and messages
- `treatments.pages.*` - Page titles

## Testing

Integration tests are located in `tests/integration/components/`.

**Test files:**

- `treatments-advanced-table-test.gts` - Tests for main table component
- `status-chip-test.gts` - Tests for status chip component
- `sensitive-data-indicator-test.gts` - Tests for sensitive data indicator

**Run tests:**

```bash
pnpm run test --filter @libs/treatment-front
```

## Future Enhancements

### Drag & Drop Reordering

- Install ember-sortable or similar addon
- Implement drag handle column
- Use `updateOrder` service method
- Persist order to backend

### Settings Integration

- Create settings service
- Add customTreatmentTypes setting
- Replace hardcoded types with dynamic list
- Add settings management UI

### Advanced Filtering

- Text search across title, description, responsible
- Date range filters
- Multiple status selection
- Saved filter presets

### Export Functionality

- Export to CSV/Excel
- Export to PDF
- Include filtered/sorted data only

### Bulk Actions

- Select multiple treatments
- Bulk archive/unarchive
- Bulk type assignment

## Standards Applied

- **frontend/lib-structure** - Proper folder organization
- **frontend/route-template** - Separate route handlers and templates
- **frontend/service-crud** - TreatmentService with CRUD operations
- **frontend/translations** - i18n keys following conventions
- **frontend/http-mocks** - MSW handlers with openapi-msw
- **frontend/data-loading** - WarpDrive store.request() pattern
- **frontend/schema-changeset** - Treatment schema with proper types
- **global/import-alias** - Use #src/ for internal imports

## License

Internal project - All rights reserved
