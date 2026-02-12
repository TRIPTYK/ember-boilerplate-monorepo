import { entities as todoEntities, Module, TodoEntity } from "#src/index.js";
import { MikroORM } from "@mikro-orm/core";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { sign } from "jsonwebtoken";
import { randomUUID } from "crypto";

export class TestModule {
  public static JWT_SECRET = "testSecret";
  public static TEST_USER_ID = "test-user-id";

  private constructor(
    public module: Module,
    private orm: MikroORM,
  ) {}

  public static async init() {
    const connectionUrl = process.env.TEST_DATABASE_URL;
    if (!connectionUrl) {
      throw new Error(
        "TEST_DATABASE_URL environment variable is not set. Make sure global-setup.ts ran.",
      );
    }

    const orm = await MikroORM.init({
      entities: [ ...todoEntities],
      clientUrl: connectionUrl,
      driver: await import("@mikro-orm/postgresql").then((m) => m.PostgreSqlDriver),
    });

    const fastifyInstance = fastify().withTypeProvider<ZodTypeProvider>();
    fastifyInstance.setValidatorCompiler(validatorCompiler);
    fastifyInstance.setSerializerCompiler(serializerCompiler);

    const module = Module.init({
      fastifyInstance,
      em: orm.em.fork(),
      configuration: {
        jwtSecret: TestModule.JWT_SECRET,
      },
    });

    const testModule = new TestModule(module, orm);

    await module.setupRoutes(fastifyInstance);

    return testModule;
  }

  get em() {
    return this.module["context"].em;
  }

  get fastifyInstance() {
    return this.module["context"].fastifyInstance;
  }

  public generateBearerToken(userId: string) {
    return "Bearer " + sign({ userId }, TestModule.JWT_SECRET);
  }

  public async createTodo(data: {
    id?: string;
    title: string;
    description?: string | null;
    completed?: boolean;
    userId: string;
  }) {
    await this.em.getRepository(TodoEntity).insert({
      id: data.id || randomUUID(),
      title: data.title,
      description: data.description ?? null,
      completed: data.completed ?? false,
      userId: data.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  public async close() {
    await this.orm.close(true);
  }
}
