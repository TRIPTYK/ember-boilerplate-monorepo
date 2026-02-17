# Product Roadmap

## Phase 1: MVP — Ember.js Rebuild

**Goal**: Achieve full feature parity with the existing React version, but with better code structure and architecture.

### Phase 1A: Authentication System (Immediate Priority)

**Focus**: Build the authentication layer completely separate from treatment management.

- User authentication with JWT and PostgreSQL backend
- User registration and account creation
- Password recovery and reset flows
- Protected routes and session management
- Token refresh mechanism
- Authentication state management in Ember

**Architecture note**: Authentication is intentionally decoupled from treatment management to allow independent development and future scalability.

### Phase 1B: Core Treatment Management
- Complete 8-step wizard for creating/editing treatments:
  1. Title and description
  2. General information (type, responsible party, DPO)
  3. Purposes and sub-purposes
  4. Categories of data subjects
  5. Data collected (personal, financial, NIR) with retention periods
  6. Legal basis
  7. Data sharing and third-party transfers
  8. Security measures

### Treatment Operations
- List view with filtering, search, and status indicators
- Drag & drop reordering
- Status management (Draft, Validated, Archived)
- Detailed treatment view
- Export/Import capabilities (JSON, PDF)

### Authentication & Security
- User authentication with JWT
- Password recovery and reset
- Protected routes and session management

### Settings & Configuration
- Customizable parameters across 10 categories (treatment types, purposes, data categories, legal bases, etc.)
- Entity management (company information, responsible party, DPO details)
- Parameter export/import

### UI/UX
- Internationalization (FR/EN)
- Dark theme
- Responsive design
- Progressive Web App capabilities

### Technical Foundation
- SQLite via WASM for client-side data storage
- Offline-first architecture
- Service worker for PWA functionality

## Phase 2: Post-Launch

**Focus**: Stabilization and production readiness.

Priority is ensuring the rebuild is stable, performant, and reliable before expanding functionality.

## Phase 3+: Future Enhancements

- **Subscription Management**: Separate admin application for managing user subscriptions and billing (to be developed independently)
- Additional features will be evaluated based on user feedback and organizational needs
