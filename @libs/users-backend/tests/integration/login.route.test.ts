import { afterAll, aroundEach, beforeAll, expect as hardExpect } from "vitest";
import { test } from "vitest";
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

test("LoginRoute returns tokens on valid credentials", async () => {
    const response = await module.fastifyInstance.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
            email: "a@test.com",
            password: "testpassword",
        },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("accessToken");
    expect(body.data).toHaveProperty("refreshToken");
    expect(typeof body.data.accessToken).toBe("string");
    expect(typeof body.data.refreshToken).toBe("string");
});

test("LoginRoute returns JSON:API error on invalid email", async () => {
    const response = await module.fastifyInstance.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
            email: "nonexistent@test.com",
            password: "testpassword",
        },
    });

    expect(response.statusCode).toBe(401);
    const body = response.json();
    expect(body).toHaveProperty("errors");
    expect(Array.isArray(body.errors)).toBe(true);
    expect(body.errors[0]).toMatchObject({
        status: "401",
        title: "Invalid Credentials",
        code: "INVALID_CREDENTIALS",
        detail: "Invalid email or password",
    });
});

test("LoginRoute returns JSON:API error on invalid password", async () => {
    const response = await module.fastifyInstance.inject({
        method: "POST",
        url: "/auth/login",
        payload: {
            email: "a@test.com",
            password: "wrongpassword",
        },
    });

    expect(response.statusCode).toBe(401);
    const body = response.json();
    expect(body).toHaveProperty("errors");
    expect(Array.isArray(body.errors)).toBe(true);
    expect(body.errors[0]).toMatchObject({
        status: "401",
        title: "Invalid Credentials",
        code: "INVALID_CREDENTIALS",
        detail: "Invalid email or password",
    });
});

test("LoginRoute returns validation error on missing fields", async () => {
    const response = await module.fastifyInstance.inject({
        method: "POST",
        url: "/auth/login",
        payload: {},
    });

    expect(response.statusCode).toBe(400);
});
