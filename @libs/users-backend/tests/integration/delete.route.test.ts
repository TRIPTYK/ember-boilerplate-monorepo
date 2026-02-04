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

test("DeleteRoute deletes user and returns 204", async () => {
    const response = await module.fastifyInstance.inject({
        method: "DELETE",
        url: "/users/some-user-id",
        headers: {
            authorization: module.generateBearerToken("some-user-id"),
        },
    });

    expect(response.statusCode).toBe(204);
    expect(response.body).toBe("");
});

test("DeleteRoute returns JSON:API error when deleting another user", async () => {
    await module.createUser({
        id: "other-user-id",
        email: "other@test.com",
        firstName: "Other",
        lastName: "User",
        password: "testpassword",
    });

    const response = await module.fastifyInstance.inject({
        method: "DELETE",
        url: "/users/other-user-id",
        headers: {
            authorization: module.generateBearerToken("some-user-id"),
        },
    });

    expect(response.statusCode).toBe(403);
    const body = response.json();
    expect(body).toHaveProperty("errors");
    expect(Array.isArray(body.errors)).toBe(true);
    expect(body.errors[0]).toMatchObject({
        status: "403",
        title: "Forbidden",
        code: "FORBIDDEN",
        detail: "You can only delete your own profile",
    });
});

test("DeleteRoute returns JSON:API error when user not found", async () => {
    const response = await module.fastifyInstance.inject({
        method: "DELETE",
        url: "/users/nonexistent-id",
        headers: {
            authorization: module.generateBearerToken("nonexistent-id"),
        },
    });

    expect(response.statusCode).toBe(401);
    const body = response.json();
    expect(body).toHaveProperty("errors");
    expect(body.errors[0]).toMatchObject({
        status: "401",
        title: "Unauthorized",
        code: "UNAUTHORIZED",
        detail: "User not found",
    });
});

test("DeleteRoute returns JSON:API error when not authenticated", async () => {
    const response = await module.fastifyInstance.inject({
        method: "DELETE",
        url: "/users/some-user-id",
    });

    expect(response.statusCode).toBe(401);
    const body = response.json();
    expect(body).toHaveProperty("errors");
    expect(body.errors[0]).toMatchObject({
        status: "401",
        title: "Unauthorized",
        code: "UNAUTHORIZED",
    });
});
