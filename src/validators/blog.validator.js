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

export function validateSlug(req, res, next) {
  const slugSchema = Joi.object({
    slug: Joi.string().required(),
  });

  const { error } = slugSchema.validate(req.params);

  if (error) {
    const validationError = new Error("Invalid slug");
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
      .allow(null, "")
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

export function validateBlogField(req, res, next) {
  const blogPatchSchema = Joi.object({
    isPublished: Joi.boolean().optional(),
    likes: Joi.number().min(1).max(1).optional(),
    dislikes: Joi.number().min(1).max(1).optional(),
    noOfViewers: Joi.number().min(1).max(1).optional(),
    email: Joi.string().email().allow(null, "").optional(),
  });
  const { error } = blogPatchSchema.validate(req.body);

  if (error) {
    const validationError = new Error(error.details[0].message);
    validationError.statusCode = 400;
    return next(validationError);
  }

  next();
}
