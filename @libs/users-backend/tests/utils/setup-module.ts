import { entities, Module, UserEntity, RefreshTokenEntity } from "#src/index.js";
import { MikroORM } from "@mikro-orm/core";
import { fastify } from "fastify";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import { sign } from "jsonwebtoken";
import { hash } from "argon2";
import { randomUUID } from "crypto";
import { hashToken, generateFamilyId } from "#src/utils/token.utils.js";

export class TestModule {
    public static JWT_SECRET = "testSecret";
    public static JWT_REFRESH_SECRET = "testRefreshSecret";

    private constructor(
        public module: Module,
        private orm: MikroORM
    ) {}

    public static async init() {
        const orm = await MikroORM.init({
            entities: [...entities],
            dbName: ":memory:",
            debug: true,
            driver: await import("@mikro-orm/sqlite").then(m => m.SqliteDriver),
        });

        await orm.schema.refreshDatabase();

        const hashedPassword = await hash("testpassword");
        await orm.em.getRepository(UserEntity).insert({
            id: "some-user-id",
            email: "a@test.com",
            firstName: "Test",
            lastName: "User",
            password: hashedPassword,
        });

        const fastifyInstance = fastify().withTypeProvider<ZodTypeProvider>();
        fastifyInstance.setValidatorCompiler(validatorCompiler);
        fastifyInstance.setSerializerCompiler(serializerCompiler);

        const module = Module.init({
            fastifyInstance,
            em: orm.em.fork(),
            configuration: {
                jwtRefreshSecret: TestModule.JWT_REFRESH_SECRET,
                jwtSecret: TestModule.JWT_SECRET,
            },
        });

        const testModule = new TestModule(
            module,
            orm
        );

        await module.setupRoutes(fastifyInstance);

        return testModule;
    }

    get em() {
        return this.module['context'].em;
    }

    get fastifyInstance() {
        return this.module['context'].fastifyInstance;
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

    public async storeRefreshToken(userId: string, refreshToken: string, options?: { revoked?: boolean; expired?: boolean }) {
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

    public async createUser(data: { id: string; email: string; firstName: string; lastName: string; password: string }) {
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