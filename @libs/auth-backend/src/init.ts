import type {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import type { AuthLibraryContext } from "./context.js";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { LoginRoute } from "#src/routes/login.route.js";
import { RefreshRoute } from "#src/routes/refresh.route.js";
import { LogoutRoute } from "#src/routes/logout.route.js";
import { ForgotPasswordRoute } from "#src/routes/forgot-password.route.js";
import { ResetPasswordRoute } from "#src/routes/reset-password.route.js";
import { type ModuleInterface, type Route, EmailService } from "@libs/backend-shared";
import { handleJsonApiErrors } from "@libs/backend-shared";

export type FastifyInstanceTypeForModule = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>;

export class AuthModule implements ModuleInterface<FastifyInstanceTypeForModule> {
  private constructor(private context: AuthLibraryContext) {}

  public static init(context: AuthLibraryContext): AuthModule {
    return new AuthModule(context);
  }

  public async setupRoutes(fastify: FastifyInstanceTypeForModule): Promise<void> {
    const emailService = new EmailService({
      appUrl: this.context.configuration.appUrl,
      appName: this.context.configuration.appName,
      emailFromAddress: this.context.configuration.emailFromAddress,
      mode: this.context.configuration.emailMode,
      testRecipient: this.context.configuration.emailTestRecipient,
      smtp: this.context.configuration.smtp,
    });

    const authRoutes: Route<FastifyInstanceTypeForModule>[] = [
      new LoginRoute(
        this.context.userRepository,
        this.context.em,
        this.context.configuration.jwtSecret,
        this.context.configuration.jwtRefreshSecret,
      ),
      new RefreshRoute(
        this.context.em,
        this.context.userRepository,
        this.context.configuration.jwtSecret,
        this.context.configuration.jwtRefreshSecret,
      ),
      new LogoutRoute(this.context.em, this.context.configuration.jwtRefreshSecret),
      new ForgotPasswordRoute(this.context.userRepository, this.context.em, emailService),
      new ResetPasswordRoute(this.context.userRepository, this.context.em),
    ];

    await fastify.register(
      async (f) => {
        f.setErrorHandler((error, request, reply) => {
          handleJsonApiErrors(error, request, reply);
        });

        for (const route of authRoutes) {
          route.routeDefinition(f);
        }
      },
      { prefix: "/auth" },
    );
  }
}
