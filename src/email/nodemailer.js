import { createTransport } from "nodemailer";
import { logger } from "../utils/logger.js";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { fileURLToPath } from "url";

function mailTransport() {
  return createTransport({
    host: "smtp.titan.email",
    port: 465,
    secure: true,
    auth: {
      user: process.env.COMPANY_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    debug: true,
    logger: true,
  });
}

export async function sendSubscriptionEmail({ name, email }) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templatePath = path.join(
    __dirname,
    "../view/subscriptionTemplate.html"
  );
  const source = fs.readFileSync(templatePath, "utf-8");
  const template = handlebars.compile(source);
  const htmlToSend = template({ name });

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
    html: htmlToSend,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error(error?.message || "Something went wrong");
  }
}
