import type Mailgen from "mailgen";
import { BaseEmailTemplate, type EmailTemplateData } from "./base.template.js";

export interface PasswordResetTemplateData extends EmailTemplateData {
  resetUrl: string;
  token: string;
}

export class PasswordResetTemplate extends BaseEmailTemplate {
  constructor(private appUrl: string) {
    super();
  }

  protected getSubject(): string {
    return "Réinitialiser votre mot de passe";
  }

  protected buildBody(data: PasswordResetTemplateData): Mailgen.Content["body"] {
    return {
      name: data.firstName,
      intro: "Vous avez demandé à réinitialiser votre mot de passe.",
      action: {
        instructions: "Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe. Ce lien expirera dans 1 heure.",
        button: {
          color: "#37BCF8",
          text: "Réinitialiser le mot de passe",
          link: data.resetUrl,
          fallback: {
            text: "Si vous ne pouvez pas cliquer sur le bouton, veuillez copier et coller le lien suivant dans votre navigateur"
          },
        },
      },
    };
  }

  public generate(data: PasswordResetTemplateData): Mailgen.Content {
    const resetUrl = `${this.appUrl}/reset-password?token=${data.token}`;
    return super.generate({
      ...data,
      resetUrl,
    });
  }
}
