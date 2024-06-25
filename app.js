import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import express from "express";
import compression from "compression";
import { database } from "./src/db/connection.js";
import { logger } from "./src/utils/logger.js";
import { server } from "./index.js";

dotenv.config();

const app = express();

// error handling of unhandled promise rejection
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logger.error(err.name, err.message);

  server.close(() => {
    logger.on("finish", () => {
      process.exit(1);
    });
  });
});

logger.info("Company Email:", process.env.COMPANY_EMAIL);
logger.info("Email Password:", process.env.EMAIL_PASSWORD);

// error handling of uncaught exception
process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger.error(err.name, err.message);

  logger.on("finish", () => {
    process.exit(1);
  });
});

const corsOptions = {
  exposedHeaders: ["reindeersoft_user_token", "subscriber_email"],
  allowedHeaders: [
    "Content-Type",
    "reindeersoft_user_token",
    "Content-Length",
    "X-Requested-With",
    "Accept",
    "access-control-allow-origin",
  ],
  optionsSuccessStatus: 200,
  credentials: true,
  origin: true,
};

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(cors(corsOptions));
// app.options("*", cors());

app.use(compression());
app.use(helmet());

database(logger);

export { app };
