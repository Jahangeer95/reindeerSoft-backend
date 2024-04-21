import { Router } from "express";
import { blogsController } from "../../controllers/blogs.controller.js";
import {
  validateBlogId,
  validateNewBlog,
} from "../../validators/blog.validator.js";

const router = Router();

router
  .route("/")
  .get(blogsController.getAllBlogs)
  .post(validateNewBlog, blogsController.createNewBlog);

router
  .route("/:blogId")
  .all(validateBlogId)
  .get(blogsController.getBlogDetail)
  .delete(blogsController.deleteBlog)
  .post()
  .put()
  .patch();

export { router as adminBlogRouter };
