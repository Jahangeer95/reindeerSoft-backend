import { Types } from "mongoose";
import Joi from "joi";

export function validateBlogId(req, res, next) {
  if (!Types.ObjectId.isValid(req.params.blogId)) {
    const validationError = new Error("Invalid Blog Id");
    validationError.statusCode = 400;
    return next(validationError);
  }

  next();
}

export function validateNewBlog(req, res, next) {
  const blogSchema = Joi.object({
    title: Joi.string().required(),
    seoDescription: Joi.string().required(),
    category: Joi.string().required(),
    blogBannerImage: Joi.string().required(),
    blogBannerAlt: Joi.string().required(),
    videoLink: Joi.string()
      .uri({ scheme: ["http", "https"] })
      .trim()
      .optional(),
    content: Joi.string().required(),
    isPublished: Joi.boolean().optional(),
  });

  const { error, value } = blogSchema.validate(req.body);
  if (error) {
    const validationError = new Error(error.details[0].message);
    validationError.statusCode = 400;
    return next(validationError);
  }

  next();
}
