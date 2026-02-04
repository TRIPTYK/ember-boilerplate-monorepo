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

test("UpdateRoute updates user and returns JSON:API format", async () => {
    const response = await module.fastifyInstance.inject({
        method: "PATCH",
        url: "/users/some-user-id",
        headers: {
            authorization: module.generateBearerToken("some-user-id"),
        },
        payload: {
            data: {
                id: "some-user-id",
                type: "users",
                attributes: {
                    email: "updated@test.com",
                    firstName: "Updated",
                    lastName: "Name",
                },
            },
        },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body).toHaveProperty("data");
    expect(body.data).toMatchObject({
        type: "users",
        id: "some-user-id",
        attributes: {
            email: "updated@test.com",
            firstName: "Updated",
            lastName: "Name",
        },
    });
});

test("UpdateRoute returns JSON:API error when updating another user", async () => {
    await module.createUser({
        id: "other-user-id",
        email: "other@test.com",
        firstName: "Other",
        lastName: "User",
        password: "testpassword",
    });

    const response = await module.fastifyInstance.inject({
        method: "PATCH",
        url: "/users/other-user-id",
        headers: {
            authorization: module.generateBearerToken("some-user-id"),
        },
        payload: {
            data: {
                id: "other-user-id",
                type: "users",
                attributes: {
                    email: "hacked@test.com",
                    firstName: "Hacked",
                    lastName: "User",
                },
            },
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
        detail: "You can only update your own profile",
    });
});

test("UpdateRoute returns JSON:API error when user not found", async () => {
    const response = await module.fastifyInstance.inject({
        method: "PATCH",
        url: "/users/nonexistent-id",
        headers: {
            authorization: module.generateBearerToken("nonexistent-id"),
        },
        payload: {
            data: {
                id: "nonexistent-id",
                type: "users",
                attributes: {
                    email: "test@test.com",
                    firstName: "Test",
                    lastName: "User",
                },
            },
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

test("UpdateRoute returns JSON:API error when not authenticated", async () => {
    const response = await module.fastifyInstance.inject({
        method: "PATCH",
        url: "/users/some-user-id",
        payload: {
            data: {
                id: "some-user-id",
                type: "users",
                attributes: {
                    email: "updated@test.com",
                    firstName: "Updated",
                    lastName: "User",
                },
            },
        },
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
