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
  .post(validateNewBlog, blogsController.createNewBlog)
  .put(blogsController.updateBlog)
  .patch();

//  patch controller is left which will be
// used to update the part of the blog just like
// isPublished, noOfViewers,likes and dislikes

export { router as adminBlogRouter };
