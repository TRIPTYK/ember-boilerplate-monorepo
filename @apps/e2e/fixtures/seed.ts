/**
 * Test data that mirrors `@apps/backend/src/seeders/e2e.seeder.ts`.
 *
 * The e2e database is rebuilt from that seeder (`pnpm setup:db`), so these
 * constants and the seeder must be changed together.
 */
export const SEEDED_USERS = {
  /** The account every authenticated test signs in with. */
  main: {
    id: "e2e-login-user",
    email: "deflorenne.amaury@triptyk.eu",
    password: "123456789",
    firstName: "Amaury",
    lastName: "Deflorenne",
    get fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
  },
  /** Extra rows, useful to assert list/search/sort behaviour. */
  others: [
    { id: "1", email: "john.doe@example.com", firstName: "John", lastName: "Doe" },
    { id: "2", email: "jane.smith@example.com", firstName: "Jane", lastName: "Smith" },
    { id: "3", email: "bob.johnson@example.com", firstName: "Bob Johnson", lastName: "Johnson" },
  ],
} as const;

/**
 * Tests share one database and may run in parallel, so anything a test creates
 * must be unique to that test. Never hardcode a name you also assert on.
 */
export function unique(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function uniqueEmail(prefix = "e2e"): string {
  return `${unique(prefix)}@example.com`;
}
