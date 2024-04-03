import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  format: format.printf((log) => log.message),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    new transports.File({ filename: "logs/connnectionFile.log" }),
  ],

  exceptionHandlers: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    new transports.File({ filename: "logs/exceptions.log" }),
  ],

  rejectionHandlers: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    new transports.File({ filename: "logs/exceptions.log" }),
  ],
});

logger.exitOnError = false;
