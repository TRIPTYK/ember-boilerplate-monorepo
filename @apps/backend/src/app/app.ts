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
import { Module, type ModuleInterface } from "@libs/users-backend";

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
  ) {
    this.context = context;
  }

  public static async init(context: ApplicationContext) {
    const loggerInstance = logger(context.configuration);
    const fastifyInstance = Fastify({
      loggerInstance,
    });

    fastifyInstance.register(fastifySecureSession, {
      key: Buffer.from(context.configuration.SESSION_KEY, "hex"),
    });
    fastifyInstance.register(fastifyPassport.default.initialize());
    fastifyInstance.register(fastifyPassport.default.secureSession());

    // fastifyPassport.default.use('local', new PassportJWT({
    //     secretOrKey: context.configuration.SESSION_KEY,
    //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    // }, async function (jwtPayload, verify) {
    //     const user = await context.userRepository.getById(jwtPayload.id);
    //     if (user) {
    //         verify(null, user);
    //     } else {
    //         verify(new Error('User not found'));
    //     }
    // }));

    // fastifyPassport.default.registerUserSerializer(serializeUser);
    // fastifyPassport.default.registerUserDeserializer(async (id) => {
    //     return context.userRepository.getById(String(id));
    // })

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

    // assignSubscribers(
    //     context.eventEmitter,
    //     context
    // );

    const app = new App(fastify, context);

    const UserModule = Module.init({
      fastifyInstance: fastify,
      em: context.orm.em.fork(),
      configuration: {
        jwtSecret: context.configuration.JWT_SECRET,
        jwtRefreshSecret: context.configuration.JWT_REFRESH_SECRET,
      },
    });

    await app.setupRoutes([UserModule]);

    return app;
  }

  private async setupRoutes(modules: ModuleInterface[]) {
    this.fastify.setErrorHandler((error: FastifyError, request, reply) => {
      // eslint-disable-next-line no-console
      console.error(error);
      reply.send({
        message: error.message,
        code: error.code,
        status: error.statusCode ?? 500,
      });
    });

    this.fastify.setNotFoundHandler((_request, reply) => {
      reply.send({
        message: "Not found",
        code: "NOT_FOUND",
        status: 404,
      });
    });

    await appRouter(this.fastify, this.context, modules);
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
