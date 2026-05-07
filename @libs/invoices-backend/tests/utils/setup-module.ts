import {
  entities as invoiceEntities,
  Module,
  InvoiceEntity,
  InvoiceLineItemEntity,
  type FastifyInstanceTypeForModule,
} from "#src/index.js";
import { entities as userEntities } from "@libs/users-backend";
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

  declare public fastifyInstance: FastifyInstanceTypeForModule;

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
      entities: [...invoiceEntities, ...userEntities],
      clientUrl: connectionUrl,
    });

    const fastifyInstance = fastify().withTypeProvider<ZodTypeProvider>();
    fastifyInstance.setValidatorCompiler(validatorCompiler);
    fastifyInstance.setSerializerCompiler(serializerCompiler);

    const module = Module.init({
      em: orm.em.fork(),
      configuration: {
        jwtSecret: TestModule.JWT_SECRET,
      },
    });

    const testModule = new TestModule(module, orm);
    testModule.fastifyInstance = fastifyInstance;

    await module.setupRoutes(fastifyInstance);

    return testModule;
  }

  get em() {
    return this.module["context"].em;
  }

  public generateBearerToken(userId: string) {
    return "Bearer " + sign({ userId }, TestModule.JWT_SECRET);
  }

  public async createInvoice(data: {
    id?: string;
    userId: string;
    month: string;
    subtotal: number;
    discount?: number;
    total: number;
    paymentMethod?: string | null;
  }) {
    await this.em.getRepository(InvoiceEntity).insert({
      id: data.id ?? randomUUID(),
      userId: data.userId,
      month: data.month,
      subtotal: data.subtotal,
      discount: data.discount ?? 0,
      total: data.total,
      paymentMethod: data.paymentMethod ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  public async createLineItem(data: {
    id?: string;
    invoiceId: string;
    type: "charge" | "service" | "discount";
    label: string;
    amount: number;
  }) {
    await this.em.getRepository(InvoiceLineItemEntity).insert({
      id: data.id ?? randomUUID(),
      invoiceId: data.invoiceId,
      type: data.type,
      label: data.label,
      amount: data.amount,
    });
  }

  public async close() {
    await this.orm.close(true);
  }
}
