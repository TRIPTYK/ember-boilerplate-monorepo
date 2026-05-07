import { afterAll, aroundEach, beforeAll, expect as hardExpect, test } from "vitest";
import { TestModule } from "#tests/utils/setup-module.js";

const expect = hardExpect.soft;

let module: TestModule;

beforeAll(async () => {
  module = await TestModule.init();
});

afterAll(async () => {
  await module.close();
});

aroundEach(async (runTest) => {
  await module.em.begin();
  await runTest();
  await module.em.rollback();
});

test("GetRoute returns invoice with line items in JSON:API format", async () => {
  await module.createInvoice({
    id: "inv-1",
    userId: TestModule.TEST_USER_ID,
    month: "2026-01",
    subtotal: 100,
    discount: 10,
    total: 90,
    paymentMethod: "card",
  });
  await module.createLineItem({
    invoiceId: "inv-1",
    type: "charge",
    label: "Service fee",
    amount: 100,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/invoices/inv-1",
    headers: { authorization: module.generateBearerToken(TestModule.TEST_USER_ID) },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body.data).toMatchObject({
    type: "invoices",
    id: "inv-1",
    attributes: {
      month: "2026-01",
      subtotal: 100,
      discount: 10,
      total: 90,
      paymentMethod: "card",
    },
  });
  expect(body.data.attributes.lineItems).toHaveLength(1);
  expect(body.data.attributes.lineItems[0]).toMatchObject({
    type: "charge",
    label: "Service fee",
    amount: 100,
  });
});

test("GetRoute returns 404 when invoice not found", async () => {
  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/invoices/nonexistent",
    headers: { authorization: module.generateBearerToken(TestModule.TEST_USER_ID) },
  });

  expect(response.statusCode).toBe(404);
  const body = response.json();
  expect(body.errors[0]).toMatchObject({ status: "404", code: "INVOICE_NOT_FOUND" });
});

test("GetRoute returns 404 for another user's invoice", async () => {
  await module.createInvoice({
    id: "other-inv",
    userId: "other-user",
    month: "2026-01",
    subtotal: 50,
    total: 50,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/invoices/other-inv",
    headers: { authorization: module.generateBearerToken(TestModule.TEST_USER_ID) },
  });

  expect(response.statusCode).toBe(404);
});

test("GetRoute returns 401 when not authenticated", async () => {
  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/invoices/inv-1",
  });

  expect(response.statusCode).toBe(401);
});
