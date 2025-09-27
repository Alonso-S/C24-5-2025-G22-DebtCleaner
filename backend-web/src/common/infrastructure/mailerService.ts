import nodemailer from "nodemailer";
import { GMAIL_USER, GMAIL_APP_PASSWORD } from "../../config";

/**
 * Servicio para envío de correos electrónicos
 */
export const mailerService = {
  /**
   * Envía un código de login por correo electrónico
   */
  async sendLoginCode(email: string, name: string, code: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"DebtCleaner" <${GMAIL_USER}>`,
      to: email,
      subject: "Código de acceso a DebtCleaner",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hola ${name},</h2>
          <p>Tu código de acceso a DebtCleaner es:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
            ${code}
          </div>
          <p>Este código expirará en 5 minutos.</p>
          <p>Si no solicitaste este código, puedes ignorar este correo.</p>
        </div>
      `,
    });
  }
};