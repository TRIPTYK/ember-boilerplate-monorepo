export interface IEmailService {
  sendPasswordResetEmail(email: string, token: string, firstName: string): Promise<void>;
}
