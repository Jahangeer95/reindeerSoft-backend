export function AsyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      const serverError = new Error(error);
      serverError.statusCode = 500;
      next(serverError);
    }
  };
}
