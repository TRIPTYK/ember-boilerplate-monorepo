import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { PasswordResetTemplate } from "./templates/password-reset.template.js";
import type { IEmailService } from "./email.service.interface.js";

export type EmailMode = "production" | "development" | "test";

export interface EmailServiceConfig {
  appUrl: string;
  appName: string;
  emailFromAddress: string;
  mode?: EmailMode;
  testRecipient?: string;
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter | null = null;
  private mailgen: Mailgen;
  private appUrl: string;
  private config: EmailServiceConfig;
  private mode: EmailMode;
  private passwordResetTemplate: PasswordResetTemplate;

  constructor(config: EmailServiceConfig) {
    this.appUrl = config.appUrl;
    this.config = config;
    this.mode = config.mode ?? "production";

    if ((this.mode === "production" || this.mode === "development") && config.smtp) {
      this.transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
        auth: config.smtp.auth,
      });
    }

    this.mailgen = new Mailgen({
      theme: "default",
      product: {
        name: config.appName,
        link: this.appUrl,
        logo: 'https://mcusercontent.com/90f2285608e57f1a4030180cc/images/7785249d-c11c-a540-c74f-5e3cf23d4e22.png',
        copyright:'© Triptyk ' + new Date().getFullYear()
      },
    });

    this.passwordResetTemplate = new PasswordResetTemplate(this.appUrl);
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(`Invalid email address: ${email}`);
    }
  }

  private getRecipient(email: string): string {
    if (this.mode === "development" && this.config.testRecipient) {
      return this.config.testRecipient;
    }
    return email;
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    text: string,
  ): Promise<void> {
    this.validateEmail(to);

    const recipient = this.getRecipient(to);
    const emailData = {
      from: `"${this.config.appName}" <${this.config.emailFromAddress}>`,
      to: recipient,
      subject,
      html,
      text,
    };

    if (this.mode === "test") {
      console.log("[EMAIL SERVICE - TEST MODE] Email would be sent:", {
        originalTo: to,
        actualTo: recipient,
        subject,
        preview: text.substring(0, 100) + "...",
      });
      return;
    }

    if (this.mode === "development") {
      console.log("[EMAIL SERVICE - DEV MODE] Sending email:", {
        originalTo: to,
        actualTo: recipient,
        subject,
      });
    }

    if (!this.transporter) {
      throw new Error(
        "Email transporter not configured. SMTP settings are required for production and development modes.",
      );
    }

    try {
      const info = await this.transporter.sendMail(emailData);
      if (this.mode === "development") {
        console.log("[EMAIL SERVICE - DEV MODE] Email sent successfully:", {
          messageId: info.messageId,
          to: recipient,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[EMAIL SERVICE] Failed to send email:", {
        to: recipient,
        subject,
        error: errorMessage,
      });
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }

  async sendPasswordResetEmail(email: string, token: string, firstName: string): Promise<void> {
    if (!email || !token || !firstName) {
      throw new Error("Email, token, and firstName are required");
    }

    this.validateEmail(email);

    const templateData = {
      firstName,
      token,
    };

    const emailContent = this.passwordResetTemplate.generate({
      ...templateData,
      resetUrl: `${this.appUrl}/reset-password?token=${token}`,
    });
    const emailHtml = this.mailgen.generate(emailContent);
    const emailText = this.mailgen.generatePlaintext(emailContent);
    const subject = this.passwordResetTemplate.getEmailSubject();

    await this.sendEmail(email, subject, emailHtml, emailText);
  }
}
