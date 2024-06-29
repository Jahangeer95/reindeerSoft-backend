import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import { fileURLToPath } from "url";
import { createTransport } from "nodemailer";
import { logger } from "../utils/logger.js";
import { blogSubjectObject, filenameObj } from "./constants.js";
import { helper } from "../utils/helper.js";

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

export async function sendSubscriptionEmail({
  name,
  email,
  filename,
  blogData,
}) {
  // filename is basically a variant here
  // for getting file path and email subject

  const { title, slug } = blogData || {};

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templatePath = path.join(__dirname, filenameObj[filename]);
  const source = fs.readFileSync(templatePath, "utf-8");
  const template = handlebars.compile(source);
  const htmlToSend = template({ name, title, slug });

  const transporter = mailTransport();

  const mailOptions = {
    from: process.env.COMPANY_EMAIL,
    to: email,
    subject: blogSubjectObject[filename],
    // text: `Hello ${name},\n\nThank you for subscribing to ReindeerSoft!\n\nBest regards,\nTeam ReindeerSoft`,
    html: htmlToSend,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    logger.error(error?.message || "Something went wrong");
  }
}
