import type Mailgen from "mailgen";

export interface EmailTemplateData {
  firstName: string;
  [key: string]: unknown;
}

export abstract class BaseEmailTemplate {
  protected abstract getSubject(): string;
  protected abstract buildBody(data: EmailTemplateData): Mailgen.Content["body"];

  public generate(data: EmailTemplateData): Mailgen.Content {
    return {
      body: {greeting: 'Bonjour',signature: false, ...this.buildBody(data)},
    };
  }

  public getEmailSubject(): string {
    return this.getSubject();
  }
}
