import { Router } from "express";
import { blogsController } from "../../controllers/blogs.controller.js";
import { validateBlogId } from "../../validators/blog.validator.js";

const router = Router();

router.route("/").get(blogsController.getAllPublishedBlogs);
router.route("/:blogId").all(validateBlogId).get(blogsController.getBlogDetail);

// like and dislike feature will be added later

export { router as publicBlogRouter };
