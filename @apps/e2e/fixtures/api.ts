import { request, type APIRequestContext } from "@playwright/test";

/** Backend origin. Must match `VITE_API_URL` given to the frontend. */
export const API_URL = process.env.E2E_API_URL ?? "http://localhost:8000";

const PREFIX = "/api/v1";

export interface CreatedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreatedTodo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

/**
 * Thin JSON:API client used to *arrange* state without driving the UI.
 *
 * Rule of thumb: set up through the API, assert through the UI. A test that
 * clicks its way through five forms to reach the state it wants is slow and
 * fails for reasons unrelated to what it checks.
 *
 * Everything created here is deleted when the fixture tears down, so tests stay
 * independent even though they share one database.
 */
export class ApiClient {
  private readonly created: { path: string; id: string }[] = [];

  private constructor(private readonly ctx: APIRequestContext) {}

  static async login(email: string, password: string): Promise<ApiClient> {
    const anonymous = await request.newContext({ baseURL: API_URL });
    const response = await anonymous.post(`${PREFIX}/auth/login`, {
      data: { email, password },
    });
    if (!response.ok()) {
      throw new Error(`API login failed (${response.status()}): ${await response.text()}`);
    }
    const { data } = (await response.json()) as { data: { accessToken: string } };
    await anonymous.dispose();

    const authenticated = await request.newContext({
      baseURL: API_URL,
      extraHTTPHeaders: { Authorization: `Bearer ${data.accessToken}` },
    });
    return new ApiClient(authenticated);
  }

  async createUser(
    attributes: Omit<CreatedUser, "id"> & { password: string },
  ): Promise<CreatedUser> {
    return this.create<CreatedUser>("users", attributes);
  }

  async createTodo(attributes: {
    title: string;
    description: string;
    completed?: boolean;
  }): Promise<CreatedTodo> {
    return this.create<CreatedTodo>("todos", { completed: false, ...attributes });
  }

  async profile(): Promise<CreatedUser> {
    const response = await this.ctx.get(`${PREFIX}/users/profile`);
    const { data } = (await response.json()) as { data: { id: string; attributes: CreatedUser } };
    return { ...data.attributes, id: data.id };
  }

  /** Deletes everything this client created. Missing rows are not an error. */
  async cleanup(): Promise<void> {
    for (const { path, id } of this.created.reverse()) {
      await this.ctx.delete(`${PREFIX}/${path}/${id}`).catch(() => undefined);
    }
    this.created.length = 0;
  }

  async dispose(): Promise<void> {
    await this.ctx.dispose();
  }

  private async create<T extends { id: string }>(
    type: string,
    attributes: Record<string, unknown>,
  ): Promise<T> {
    const response = await this.ctx.post(`${PREFIX}/${type}`, {
      data: { data: { type, attributes } },
    });
    if (!response.ok()) {
      throw new Error(
        `Could not create ${type} (${response.status()}): ${await response.text()}`,
      );
    }
    const { data } = (await response.json()) as {
      data: { id: string; attributes: Record<string, unknown> };
    };
    this.created.push({ path: type, id: data.id });
    return { ...data.attributes, id: data.id } as T;
  }
}
