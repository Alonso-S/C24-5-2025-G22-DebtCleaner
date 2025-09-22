export interface Mailer {
  sendMail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    attachments?: Array<{ filename: string; path: string }>;
  }): Promise<void>;
}
