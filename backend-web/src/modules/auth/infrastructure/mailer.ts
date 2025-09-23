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
    html: `<p>Hola ${name}, tu código para acceder es: <b>${code}</b></p>`,
  });
};
