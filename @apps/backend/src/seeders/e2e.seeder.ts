import { hashPassword, UserEntity } from "@libs/users-backend";
import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";

/**
 * E2E test seeder - creates users needed for Playwright e2e tests
 */
export class E2ESeeder extends Seeder {
  async run(em: EntityManager) {
    const hashedPassword = await hashPassword("123456789");

    // Login user for e2e tests
    em.create(UserEntity, {
      id: "e2e-login-user",
      email: "deflorenne.amaury@triptyk.eu",
      firstName: "Amaury",
      lastName: "Deflorenne",
      password: hashedPassword,
    });

    // Mock users that match the MSW mock data
    em.create(UserEntity, {
      id: "1",
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      password: hashedPassword,
    });

    em.create(UserEntity, {
      id: "2",
      email: "jane.smith@example.com",
      firstName: "Jane",
      lastName: "Smith",
      password: hashedPassword,
    });

    em.create(UserEntity, {
      id: "3",
      email: "bob.johnson@example.com",
      firstName: "Bob Johnson",
      lastName: "Johnson",
      password: hashedPassword,
    });
  }
}
