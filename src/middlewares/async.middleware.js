import { AppError } from "../utils/error.js";

export function AsyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      const serverError = new AppError(500, error.message);

      next(serverError);
    }
  };
}
