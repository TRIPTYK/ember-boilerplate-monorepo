import { entities, UserModule, UserEntity, type FastifyInstanceTypeForModule } from "#src/index.js";
import { AuthModule, RefreshTokenEntity, hashToken, generateFamilyId } from "@libs/auth-backend";
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

    // Use the same forked em for both modules to share transaction context
    const sharedEm = orm.em.fork();

    const module = UserModule.init({
      em: sharedEm,
      configuration: {
        jwtSecret: TestModule.JWT_SECRET,
      },
    });
    const authModule = AuthModule.init({
      em: sharedEm,
      userRepository: sharedEm.getRepository(UserEntity),
      configuration: {
        jwtSecret: TestModule.JWT_SECRET,
        jwtRefreshSecret: TestModule.JWT_REFRESH_SECRET,
        appUrl: "http://localhost:5173",
        appName: "Test App",
        emailFromAddress: "test@example.com",
      },
    });

    const testModule = new TestModule(module, orm);
    testModule.fastifyInstance = fastifyInstance;

    await module.setupRoutes(fastifyInstance);
    await authModule.setupRoutes(fastifyInstance);

    return testModule;
  }

  get em() {
    return this.module["context"].em;
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
    const refreshTokenRepo = this.em.getRepository(RefreshTokenEntity);

    const expiresAt = options?.expired
      ? new Date(Date.now() - 1000).toISOString()
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    refreshTokenRepo.create({
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

    await this.em.flush();
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
