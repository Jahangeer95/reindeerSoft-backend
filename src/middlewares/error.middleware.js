import { logger } from "../utils/logger.js";

export function errorMiddleware(error, req, res, next) {
  console.log({ error });
  logger.error(error.message);
  res.status(error.statusCode || 500).send({ message: error.message });
  next();
}
