# Tech Stack

## Frontend

**Framework**: Ember.js
- Modern JavaScript framework with strong conventions
- Excellent for building ambitious web applications
- Replaces the React implementation for better code structure

## Backend

**Framework**: Fastify (Node.js)
- Fast and low-overhead web framework
- Handles authentication verification
- Minimal server-side logic since data storage is client-side

## Database

**Two-tier database architecture:**

### Server-Side: PostgreSQL
- Handles user authentication and account management
- Stores user credentials, sessions, and authentication tokens
- Central authentication server

### Client-Side: SQLite via WASM
- SQLite compiled to WebAssembly
- Runs entirely in the browser
- Stores all treatment data and GDPR compliance records
- Sensitive compliance data never leaves the user's device
- Replaces IndexedDB from the React version for better data management and query capabilities

**Architecture rationale**: Separation of concerns — authentication is centralized for security and account management, while sensitive compliance data remains fully offline and under user control.

## Deployment

**Progressive Web App (PWA)**
- Service worker for offline functionality
- Installable on desktop and mobile devices
- Autonomous operation after installation
- Only authentication requires online connectivity

## Additional Technologies

- **Internationalization**: Support for FR/EN languages
- **UI Theming**: Dark theme customization
- **Data Export**: JSON and PDF generation capabilities
- **Security**: JWT-based authentication with token refresh
