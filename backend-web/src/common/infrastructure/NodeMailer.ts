import { createTransport } from "nodemailer";
import { GMAIL_APP_PASSWORD, GMAIL_USER } from "../../config";
import type { Mailer } from "../contracts/Mailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

export const NodeMailer: Mailer = {
  async sendMail(options) {
    const mailOptions = {
      from: `"DebtCleaner" <${GMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    };

    await transporter.sendMail(mailOptions);
  },
};
