import { Router } from "express";
import { publicBlogRouter } from "./blog.route.js";

const router = Router();

router.use("/blogs", publicBlogRouter);

export { router as publicRouter };
