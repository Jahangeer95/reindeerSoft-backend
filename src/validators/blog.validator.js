import { Types } from "mongoose";

export function validateBlogId(req, res, next) {
  if (!Types.ObjectId.isValid(req.params.blogId)) {
    const validationError = new Error("Invalid Blog Id");
    validationError.statusCode = 400;
    return next(validationError);
  }

  next();
}
