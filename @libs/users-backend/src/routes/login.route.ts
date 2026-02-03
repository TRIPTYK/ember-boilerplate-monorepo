import type { FastifyInstanceTypeForModule, Route } from "@lib/init.js";
import type { EntityRepository } from "@mikro-orm/core";
import { verifyPassword } from "@lib/utils/auth.utils.js";
import { generateTokens } from "@lib/utils/jwt.utils.js";
import { email, object, string } from "zod";
import type { UserEntityType } from "@lib/entities/user.entity.js";

export class LoginRoute implements Route {
  public constructor(
    private userRepository: EntityRepository<UserEntityType>,
    private jwtSecret: string,
    private jwtRefreshSecret: string,
  ) {}

  public routeDefinition(f: FastifyInstanceTypeForModule) {
    return f.post(
      "/login",
      {
        schema: {
          body: object({
            email: email(),
            password: string().min(8),
          }),
          response: {
            200: object({
              data: object({
                accessToken: string(),
                refreshToken: string(),
              }),
            }),
            401: object({
              message: string(),
              code: string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { email, password } = request.body;

        // Find user by email
        const user = await this.userRepository.findOne({ email });

        if (!user) {
          return reply.code(401).send({
            message: "Invalid email or password",
            code: "INVALID_CREDENTIALS",
          });
        }

        // Verify password
        const isValidPassword = await verifyPassword(user.password, password);

        if (!isValidPassword) {
          return reply.code(401).send({
            message: "Invalid email or password",
            code: "INVALID_CREDENTIALS",
          });
        }

        // Generate tokens
        const tokens = generateTokens(
          { userId: user.id, email: user.email },
          this.jwtSecret,
          this.jwtRefreshSecret,
        );

        return reply.send({
          data: tokens,
        });
      },
    );
  }
}
