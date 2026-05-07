import { hashPassword, UserEntity } from "@libs/users-backend";
import { InvoiceEntity, InvoiceLineItemEntity } from "@libs/invoices-backend";
import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";

export class DatabaseSeeder extends Seeder {
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

    em.create(InvoiceEntity, {
      id: "demo-invoice-1",
      userId: "e2e-login-user",
      month: "2026-04",
      subtotal: 250,
      discount: 25,
      total: 225,
      paymentMethod: "card",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    em.create(InvoiceLineItemEntity, {
      id: "demo-li-1",
      invoiceId: "demo-invoice-1",
      type: "service",
      label: "Monthly subscription",
      amount: 200,
    });

    em.create(InvoiceLineItemEntity, {
      id: "demo-li-2",
      invoiceId: "demo-invoice-1",
      type: "charge",
      label: "Extra usage",
      amount: 50,
    });

    em.create(InvoiceLineItemEntity, {
      id: "demo-li-3",
      invoiceId: "demo-invoice-1",
      type: "discount",
      label: "10% loyalty discount",
      amount: 25,
    });
  }
}
