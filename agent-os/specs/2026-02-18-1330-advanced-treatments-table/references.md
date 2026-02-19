# References for Advanced Treatments Table

## Similar Implementations

### User Table Component

**Location:** `@libs/users-front/src/components/user-table.gts`

**Relevance:** Basic CRUD table pattern using TableGenericPrefab

**Key Patterns:**
- Uses `TableGenericPrefab` from @triptyk/ember-ui
- Defines `tableParams` with columns array and actionMenu
- Implements rowClick for navigation to edit route
- Uses `TpkConfirmModalPrefab` for delete confirmation
- Flash messages for success/error feedback
- Tracked state for modal management

**Code Structure:**
```typescript
class UsersTable extends Component {
  @service declare router: RouterService;
  @service declare intl: IntlService;
  @service declare user: UserService;
  @service declare flashMessages: FlashMessagesService;
  
  @tracked selectedUserForDelete: UpdatedUser | null = null;
  
  get tableParams(): TableParams {
    return {
      entity: 'users',
      pageSizes: [10, 30, 50, 75],
      rowClick: (element) => { /* navigate */ },
      defaultSortColumn: 'firstName',
      columns: [ /* column definitions */ ],
      actionMenu: [ /* action buttons */ ],
    };
  }
}
```

### Todo Table Component

**Location:** `@libs/todos-front/src/components/todo-table.gts`

**Relevance:** Table with custom column component (checkbox renderer)

**Key Patterns:**
- Custom column component using `@columnsComponent` hash
- Inline component definition for custom cell rendering
- Action in actionMenu that calls async service method
- Uses `hash` helper to pass components to table

**Code Structure:**
```typescript
const TodoCheckboxComponent: TOC<TodoCheckboxComponentArgs> = <template>
  <TpkCheckboxComponent @label="123" @checked={{@row.completed}} as |C|>
    <C.Input class="checkbox disabled" />
  </TpkCheckboxComponent>
</template>;

// In template:
<TableGenericPrefab
  @tableParams={{this.tableParams}}
  @columnsComponent={{hash todoCheckbox=(component TodoCheckboxComponent)}}
/>
```

### Current Treatment Table

**Location:** `@libs/treatment-front/src/components/treatment-table.gts`

**Relevance:** Existing basic treatments table to be enhanced

**Current Features:**
- Displays title and description columns
- Edit and delete actions
- Confirmation modal for delete
- Flash messages for feedback

**What We're Adding:**
- Status column with colored chips
- Treatment type column with inline editing
- Purposes/reasons column
- Sensitive data indicator column
- Creation and update date columns
- Responsible party column
- View action
- Archive/unarchive actions
- Filtering by type
- Toggle for archived treatments

## Existing Treatment Service

**Location:** `@libs/treatment-front/src/services/treatment.ts`

**Current Methods:**
- `save(data)` - Routes to create or update
- `create(data)` - Creates new treatment
- `update(data)` - Updates existing treatment
- `delete(data)` - Deletes treatment

**Methods to Add:**
- `archive(id: string)` - Change status to archived
- `unarchive(id: string)` - Change status to validated
- `updateType(id: string, treatmentType: string)` - Update type inline

## Treatment Schema

**Location:** `@libs/treatment-front/src/schemas/treatments.ts`

**Current Fields:**
- `creationDate` - ISO date string
- `updateDate` - ISO date string
- `dueDateForUpdate` - ISO date string
- `status` - String (already exists!)
- `order` - String (already exists!)
- `isOverDueDate` - Boolean (already exists!)
- `data` - Nested object with treatment details

**Note:** Schema already has most needed fields! Just need to ensure proper usage.

## Treatment Data Structure

**Location:** `@libs/treatment-front/src/changesets/treatment.ts`

**Current Structure:**
```typescript
interface DraftTreatment {
  id?: string | null;
  title?: string;
  description?: string;
  treatmentType?: string;
  responsible?: {
    fullName?: string;
    entityNumber?: string;
    address?: { /* ... */ };
  };
  hasDPO?: boolean;
  DPO?: { /* ... */ };
  hasExternalDPO?: boolean;
  externalOrganizationDPO?: { /* ... */ };
  reasons?: string[];
  subReasons?: { name?: string; additionalInformation?: string }[];
  legalBase?: { name?: string; additionalInformation?: string }[];
  dataSubjectCategories?: string[];
  personalData?: { name?: string; additionalInformation?: string }[];
  financialData?: { name?: string; additionalInformation?: string }[];
  dataSource?: string[];
  retentionPeriod?: string;
  hasAccessByThirdParty?: boolean;
  thirdPartyAccess?: string[];
  areDataExportedOutsideEU?: boolean;
  recipient?: { /* ... */ };
  securityMeasures?: string[];
}
```

**Fields Needed for Advanced Table:**
- `title` ✓
- `treatmentType` ✓
- `reasons` ✓ (for purposes column)
- `responsible.fullName` ✓
- `personalData` ✓ (for sensitive data detection)
- `financialData` ✓ (for sensitive data detection)

**Need to Add `isSensitive` Flag:**
- Extend `personalData` and `financialData` to include `isSensitive: boolean`

## Icon Components

**Location:** `@libs/treatment-front/src/assets/icons/`

**Existing Icons:**
- `edit.gts` - Edit pencil icon
- `delete.gts` - Delete/trash icon

**Icons to Create:**
- `view.gts` - Eye icon for view action
- `archive.gts` - Archive box icon
- `unarchive.gts` - Unarchive/restore icon
- `sensitive-data.gts` - Warning/alert icon for sensitive data
- `no-sensitive-data.gts` - Checkmark icon for no sensitive data

## Translation Structure

**Location:** `@apps/front/translations/treatments/`

**Existing Files:**
- `en-us.yaml` - English translations
- `fr-fr.yaml` - French translations

**Existing Keys:**
- `wizard.*` - Wizard step translations
- `table.headers.*` - Basic table headers
- `table.actions.*` - Basic table actions
- `forms.treatment.*` - Form labels and validation
- `pages.list.title` - Page title

**Keys to Add:**
- `table.advanced.*` - Advanced table specific translations
- Status labels, filter labels, action labels, messages

## WarpDrive Patterns

**Query with Reload:**
```typescript
import { query } from '@warp-drive/utilities/json-api';

const response = await this.store.request(
  query('treatments', {
    include: [],
    'page[size]': 100,
  }, { reload: true })
);

const treatments = response.content.data;
```

**Update Record:**
```typescript
import { updateRecord } from '@warp-drive/utilities/json-api';
import { cacheKeyFor } from '@warp-drive/core';

const existing = this.store.peekRecord<Treatment>({ id, type: 'treatments' });
Object.assign(existing, { status: 'archived' });

const request = updateRecord(existing, { patch: true });
request.body = JSON.stringify({
  data: this.store.cache.peek(cacheKeyFor(existing)),
});

await this.store.request(request);
```

## MSW Mock Patterns

**Location:** `@libs/treatment-front/src/http-mocks/treatments.ts`

**Existing Handlers:**
- GET `/api/v1/treatments/:id` - Get single treatment
- GET `/api/v1/treatments` - List treatments with search/sort
- POST `/api/v1/treatments` - Create treatment
- PATCH `/api/v1/treatments/:id` - Update treatment
- PUT `/api/v1/treatments/:id` - Replace treatment
- DELETE `/api/v1/treatments/:id` - Delete treatment

**Handlers to Add:**
- POST `/api/v1/treatments/:id/archive` - Archive treatment
- POST `/api/v1/treatments/:id/unarchive` - Unarchive treatment
- POST `/api/v1/treatments/update-order` - Update order (for future drag & drop)

**Pattern:**
```typescript
http.untyped.post('/api/v1/treatments/:id/archive', (req) => {
  const { id } = req.params;
  const treatment = mocktreatments.find((t) => t.id === id);
  if (treatment) {
    treatment.attributes.status = 'archived';
    return HttpResponse.json({ data: treatment });
  }
  return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
});
```
