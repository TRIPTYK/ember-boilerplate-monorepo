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

test("ListRoute returns invoices in JSON:API format with meta", async () => {
  await module.createInvoice({
    id: "inv-1",
    userId: TestModule.TEST_USER_ID,
    month: "2026-01",
    subtotal: 100,
    total: 90,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/invoices",
    headers: { authorization: module.generateBearerToken(TestModule.TEST_USER_ID) },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body).toHaveProperty("data");
  expect(body).toHaveProperty("meta");
  expect(body.meta.total).toBe(1);
  expect(body.data[0]).toMatchObject({ type: "invoices", id: "inv-1" });
});

test("ListRoute scopes invoices to current user", async () => {
  await module.createInvoice({
    userId: TestModule.TEST_USER_ID,
    month: "2026-01",
    subtotal: 50,
    total: 50,
  });
  await module.createInvoice({
    userId: "other-user",
    month: "2026-01",
    subtotal: 200,
    total: 200,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/invoices",
    headers: { authorization: module.generateBearerToken(TestModule.TEST_USER_ID) },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body.meta.total).toBe(1);
});

test("ListRoute filters by month", async () => {
  await module.createInvoice({
    userId: TestModule.TEST_USER_ID,
    month: "2026-01",
    subtotal: 100,
    total: 100,
  });
  await module.createInvoice({
    userId: TestModule.TEST_USER_ID,
    month: "2026-02",
    subtotal: 200,
    total: 200,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/invoices?filter[month]=2026-01",
    headers: { authorization: module.generateBearerToken(TestModule.TEST_USER_ID) },
  });

  expect(response.statusCode).toBe(200);
  const body = response.json();
  expect(body.meta.total).toBe(1);
  expect(body.data[0].attributes.month).toBe("2026-01");
});

test("ListRoute returns 401 when not authenticated", async () => {
  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/invoices",
  });

  expect(response.statusCode).toBe(401);
  const body = response.json();
  expect(body.errors[0]).toMatchObject({ status: "401", code: "UNAUTHORIZED" });
});
