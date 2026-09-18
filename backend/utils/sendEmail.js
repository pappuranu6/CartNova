import nodemailer from 'nodemailer'

const sendEmail = async ({
  to,
  subject,
  text,
  html,
}) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,

    auth: {
      user: 'pappuranu6@gmail.com',
      pass: 'damjreqicbnkwzza',
    },
  })

  await transporter.sendMail({
    from: '"CartNova" <pappuranu6@gmail.com>',
    to,
    subject,
    text,
    html,
  })
}

export default sendEmail