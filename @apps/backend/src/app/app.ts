import { default as fastifyPassport } from "@fastify/passport";
import fastifySecureSession from "@fastify/secure-session";
import {
  fastify as Fastify,
  type FastifyError,
  type FastifyInstance,
  type RawReplyDefaultExpression,
  type RawRequestDefaultExpression,
  type RawServerDefault,
} from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import path from "node:path";
import packageJson from "../../package.json" with { type: "json" };
import { appRouter } from "./app.router.js";
import type { ApplicationContext } from "./application.context.js";
import { logger } from "./logger.js";
import { UserModule, UserEntity } from "@libs/users-backend";
import { AuthModule } from "@libs/auth-backend";
import { Module as TodoModule } from "@libs/todos-backend";

export type FastifyInstanceType = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  any,
  ZodTypeProvider
>;

export class App {
  private constructor(
    private fastify: FastifyInstanceType,
    private context: ApplicationContext,
  ) {}

  public static async init(context: ApplicationContext) {
    const loggerInstance = logger(context.configuration);
    const fastifyInstance = Fastify({
      loggerInstance,
    });

    fastifyInstance.addContentTypeParser(
      "application/vnd.api+json",
      // @ts-expect-error
      fastifyInstance.getDefaultJsonParser("ignore", "ignore"),
    );

    fastifyInstance.register(fastifySecureSession, {
      key: Buffer.from(context.configuration.SESSION_KEY, "hex"),
    });
    fastifyInstance.register(fastifyPassport.default.initialize());
    fastifyInstance.register(fastifyPassport.default.secureSession());

    fastifyInstance.setValidatorCompiler(validatorCompiler);
    fastifyInstance.setSerializerCompiler(serializerCompiler);

    const fastify: FastifyInstanceType = fastifyInstance.withTypeProvider<ZodTypeProvider>();
    await fastify.register(import("@fastify/cors"), {
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    });
    await fastify.register(import("@fastify/swagger"), {
      openapi: {
        info: {
          title: packageJson.name,
          version: packageJson.version,
        },
        servers: [
          {
            url: context.configuration.SERVER_URL,
            description: packageJson.description,
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      transform: jsonSchemaTransform,
    });

    await fastify.register(import("@fastify/swagger-ui"), {
      routePrefix: "/documentation",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
      uiHooks: {
        onRequest: function (_request, _reply, next) {
          next();
        },
        preHandler: function (_request, _reply, next) {
          next();
        },
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject, _request, _reply) => {
        return swaggerObject;
      },
      transformSpecificationClone: true,
    });

    fastify.register(
      await import("@fastify/static").then(({ default: staticPlugin }) => staticPlugin),
      {
        root: path.join(process.cwd(), "dist/uploads"),
        prefix: "/public/",
      },
    );

    const app = new App(fastify, context);

    await app.setupRoutes();

    return app;
  }

  private async setupRoutes() {
    this.fastify.setErrorHandler((error: FastifyError, request, reply) => {
      // eslint-disable-next-line no-console
      console.error(error);
      const statusCode = error.statusCode ?? 500;
      const errorResponse = {
        errors: [
          {
            status: statusCode.toString(),
            title: error.name || "Internal Server Error",
            detail: error.message,
            code: error.code || "INTERNAL_ERROR",
          },
        ],
      };
      reply.code(statusCode).send(errorResponse);
    });

    this.fastify.setNotFoundHandler((_request, reply) => {
      reply.send({
        message: "Not found",
        code: "NOT_FOUND",
        status: 404,
      });
    });

    await appRouter(this.fastify, {
      authModule: AuthModule.init({
        configuration: {
          smtp: {
            host: this.context.configuration.SMTP_HOST,
            port: Number(this.context.configuration.SMTP_PORT),
            secure: this.context.configuration.SMTP_SECURE,
            auth: {
              user: this.context.configuration.SMTP_USER,
              pass: this.context.configuration.SMTP_PASSWORD,
            },
          },
          emailFromAddress: this.context.configuration.EMAIL_FROM_ADDRESS,
          appName: this.context.configuration.EMAIL_FROM_NAME,
          emailMode: this.context.configuration.EMAIL_MODE as
            | "production"
            | "development"
            | "test"
            | undefined,
          emailTestRecipient: this.context.configuration.EMAIL_TEST_RECIPIENT,
          jwtRefreshSecret: this.context.configuration.JWT_REFRESH_SECRET,
          jwtSecret: this.context.configuration.JWT_SECRET,
          appUrl: this.context.configuration.APP_URL,
        },
        em: this.context.orm.em.fork(),
        userRepository: this.context.orm.em.fork().getRepository(UserEntity),
      }),
      userModule: UserModule.init({
        em: this.context.orm.em.fork(),
        configuration: {
          jwtSecret: this.context.configuration.JWT_SECRET,
        },
      }),
      todosModule: TodoModule.init({
        em: this.context.orm.em.fork(),
        userRepository: this.context.orm.em.fork().getRepository(UserEntity),
        configuration: {
          jwtSecret: this.context.configuration.JWT_SECRET,
        },
      }),
    });
  }

  public async start() {
    await this.fastify.listen({
      port: this.context.configuration.PORT,
    });
  }

  public async stop() {
    await this.fastify.close();
    await this.context.orm.close(true);
  }
}
