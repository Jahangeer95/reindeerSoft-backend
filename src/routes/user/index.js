import { Router } from "express";
import { publicBlogRouter } from "./blog.route.js";
import { publicSubscriberRouter } from "./subscriber.route.js";

const router = Router();

router.use("/blogs", publicBlogRouter);
router.use("/subscribers", publicSubscriberRouter);

export { router as publicRouter };
