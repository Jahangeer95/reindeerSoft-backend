import { createTransport } from "nodemailer";

function mailTransport() {
  const transporter = createTransport({
    host: "smtp.titan.email",
    port: 465,
    secure: true,
    auth: {
      user: process.env.COMPANY_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  return transporter;
}

export function sendSubscriptionEmail({ name, email }) {
  const subscriptionText = `<p>Hello ${name},</p>
  <p>Thank you for subscribing ReindeerSoft!</p>
  <p>We are excited to have you on board. Now, you will receive updates from us related to our blog, including the latest articles, news, and special content.</p>
  <p>Best regards,<br>Team ReindeerSoft</p>`;
  const transporter = mailTransport();
  const mailOptions = {
    from: process.env.COMPANY_EMAIL,
    to: email,
    subject: "Subscription Confirmation",
    // text: `Hello ${name},\n\nThank you for subscribing to ReindeerSoft!\n\nBest regards,\nTeam ReindeerSoft`,
    html: subscriptionText,
  };

  transporter.sendMail(mailOptions);
}
