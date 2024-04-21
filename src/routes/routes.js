import { Router } from "express";
import { userRouter } from "./user.route.js";
import { blogsRouter } from "./blog.route.js";

const router = Router();

router.get("/", (req, res) => res.send("ReindeerSoft Admin Dashboard"));

router.use("/api/admin", userRouter);
router.use("/api/blogs", blogsRouter);

export { router };
