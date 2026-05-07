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

test("PdfRoute returns PDF file for valid invoice", async () => {
  await module.createInvoice({
    id: "inv-pdf",
    userId: TestModule.TEST_USER_ID,
    month: "2026-01",
    subtotal: 100,
    total: 100,
  });

  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/invoices/inv-pdf/pdf",
    headers: { authorization: module.generateBearerToken(TestModule.TEST_USER_ID) },
  });

  expect(response.statusCode).toBe(200);
  expect(response.headers["content-type"]).toBe("application/pdf");
  expect(response.headers["content-disposition"]).toBe(
    'attachment; filename="invoice-2026-01.pdf"',
  );
});

test("PdfRoute returns 404 when invoice not found", async () => {
  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/invoices/nonexistent/pdf",
    headers: { authorization: module.generateBearerToken(TestModule.TEST_USER_ID) },
  });

  expect(response.statusCode).toBe(404);
  const body = response.json();
  expect(body.errors[0]).toMatchObject({ status: "404", code: "INVOICE_NOT_FOUND" });
});

test("PdfRoute returns 401 when not authenticated", async () => {
  const response = await module.fastifyInstance.inject({
    method: "GET",
    url: "/invoices/inv-pdf/pdf",
  });

  expect(response.statusCode).toBe(401);
});
