import {
  entities,
  UserModule,
  UserEntity,
  RefreshTokenEntity,
  type FastifyInstanceTypeForModule,
  AuthModule,
} from "#src/index.js";
import { registerRequestContext } from "@libs/backend-shared";
import { MikroORM } from "@mikro-orm/core";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { sign } from "jsonwebtoken";
import { hash } from "argon2";
import { randomUUID } from "crypto";
import { hashToken, generateFamilyId } from "#src/utils/token.utils.js";

export class TestModule {
  public static JWT_SECRET = "testSecret";
  public static JWT_REFRESH_SECRET = "testRefreshSecret";
  public static TEST_USER_ID = "test-user-id";

  declare public fastifyInstance: FastifyInstanceTypeForModule;

  private constructor(
    public module: UserModule,
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
      entities: [...entities],
      clientUrl: connectionUrl,
      driver: await import("@mikro-orm/postgresql").then((m) => m.PostgreSqlDriver),
    });

    const fastifyInstance = fastify().withTypeProvider<ZodTypeProvider>();
    fastifyInstance.setValidatorCompiler(validatorCompiler);
    fastifyInstance.setSerializerCompiler(serializerCompiler);

    registerRequestContext(fastifyInstance, orm.em);

    const module = UserModule.init({
      em: orm.em,
      configuration: {
        jwtSecret: TestModule.JWT_SECRET,
      },
    });
    const authModule = AuthModule.init({
      em: orm.em,
      configuration: {
        jwtSecret: TestModule.JWT_SECRET,
        jwtRefreshSecret: TestModule.JWT_REFRESH_SECRET,
      },
    });

    const testModule = new TestModule(module, orm);
    testModule.fastifyInstance = fastifyInstance;

    await module.setupRoutes(fastifyInstance);
    await authModule.setupRoutes(fastifyInstance);

    return testModule;
  }

  get em() {
    return this.orm.em;
  }

  public async isolate(runTest: () => Promise<void>) {
    class Rollback extends Error {}

    await this.orm.em
      .transactional(async () => {
        await runTest();
        throw new Rollback();
      })
      .catch((error: unknown) => {
        if (!(error instanceof Rollback)) throw error;
      });
  }

  public generateBearerToken(userId: string) {
    return "Bearer " + sign({ userId }, TestModule.JWT_SECRET);
  }

  public generateRefreshToken(userId: string) {
    return sign({ userId }, TestModule.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  }

  public generateExpiredRefreshToken(userId: string) {
    return sign({ userId }, TestModule.JWT_REFRESH_SECRET, { expiresIn: "-1s" });
  }

  public async storeRefreshToken(
    userId: string,
    refreshToken: string,
    options?: { revoked?: boolean; expired?: boolean },
  ) {
    const tokenHash = hashToken(refreshToken);

    const expiresAt = options?.expired
      ? new Date(Date.now() - 1000).toISOString()
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    await this.em.getRepository(RefreshTokenEntity).insert({
      id: randomUUID(),
      tokenHash,
      userId,
      deviceInfo: null,
      ipAddress: "127.0.0.1",
      userAgent: "test",
      issuedAt: new Date().toISOString(),
      expiresAt,
      revokedAt: options?.revoked ? new Date().toISOString() : null,
      familyId: generateFamilyId(),
    });
  }

  public async createUser(data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    const hashedPassword = await hash(data.password);
    await this.em.getRepository(UserEntity).insert({
      ...data,
      password: hashedPassword,
    });
  }

  public async close() {
    await this.orm.close(true);
  }
}
