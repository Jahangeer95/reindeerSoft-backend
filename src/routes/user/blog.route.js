import { Router } from "express";
import { blogsController } from "../../controllers/blogs.controller.js";
import {
  validateBlogField,
  validateBlogId,
  validateSlug,
} from "../../validators/blog.validator.js";

const router = Router();

router.route("/").get(blogsController.getAllPublishedBlogs);
router
  .route("/:slug")
  .all(validateSlug)
  .get(blogsController.getBlogDetailWithSlug);

router
  .route("/:blogId")
  .all(validateBlogId)
  .patch(validateBlogField, blogsController.patchBlog);

// like and dislike feature will be added later

export { router as publicBlogRouter };
