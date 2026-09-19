import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,

    auth: {
      user: "b9f963001@smtp-brevo.com",
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"CartNova" <pappuranu6@gmail.com>`,
    to,
    subject,
    text,
    html,
  });
};

export default sendEmail;
