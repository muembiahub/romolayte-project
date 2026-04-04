import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,   // ex: mail.privateemail.com
  port: Number(process.env.MAIL_PORT), // 465 ou 587
  secure: process.env.MAIL_PORT === "465", // true si 465, false si 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const sendConfirmationEmail = async (demande) => {
  const templatePath = path.join(
    process.cwd(),
    "src/views/emails/demande-confirmation.ejs"
  );

  const html = await ejs.renderFile(templatePath, { demande });

  await transporter.sendMail({
    from: `"Romolayte" <${process.env.MAIL_USER}>`,
    to: demande.email,
    subject: "✅ Votre demande de service a bien été envoyée",
    html
  });
};