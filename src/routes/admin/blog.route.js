import { Router } from "express";
import { blogsController } from "../../controllers/blogs.controller.js";
import {
  validateBlogId,
  validateNewBlog,
  validateBlogField,
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
  .post(validateNewBlog, blogsController.createNewBlog)
  .put(blogsController.updateBlog)
  .patch(validateBlogField, blogsController.patchBlog);

export { router as adminBlogRouter };
