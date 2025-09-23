import type { Mailer } from "../../../common/contracts/Mailer";
import type { AuthUser } from "../domain/types/AuthUser";

export const sendLoginCodeEmail = async (
  user: AuthUser,
  code: string,
  mailer: Mailer
) => {
  const { name, email } = user;
  await mailer.sendMail({
    to: email,
    subject: "Tu código de acceso",
    text: `Hola ${user.name}, tu código para acceder es: ${code}`,
    html: `
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="UTF-8" />
            <title>Código de Verificación</title>
          </head>
          <body style="margin:0; padding:0; font-family:Segoe UI, Arial, sans-serif; background-color:#f4f6fb; color:#222222;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6fb;">
              <tr>
                <td align="center">
                  <table width="480" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; padding:24px; border-radius:8px;">
                    <tr>
                      <td style="font-size:18px; font-weight:bold; color:#2d5be3; padding-bottom:16px;">
                        Hola, ${name}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size:14px; color:#222222; line-height:1.5;">
                        Hemos recibido una solicitud de acceso a tu cuenta.<br />
                        Para continuar, utiliza el siguiente código de verificación:
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding:24px 0;">
                        <table cellpadding="0" cellspacing="0" border="0" style="background-color:#eaf0fc; border-radius:6px;">
                          <tr>
                            <td style="
                              font-family: monospace;
                              font-size: 28px;
                              font-weight: bold;
                              color: #2d5be3;
                              letter-spacing: 4px;
                              padding: 12px 24px;
                              text-align: center;
                            ">
                              ${code}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-size:14px; color:#222222; line-height:1.5;">
                        Este código es válido por un tiempo limitado.<br />
                        Si no realizaste esta solicitud, puedes ignorar este mensaje.
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-top:24px; font-size:12px; color:#777777;">
                        © DebtCleaner · Todos los derechos reservados
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
        `,
  });
};
