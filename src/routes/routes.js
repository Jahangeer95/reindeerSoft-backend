import { Router } from "express";
import { adminRouter } from "./admin/index.js";
import { publicRouter } from "./user/index.js";

const router = Router();

router.get("/", (req, res) => res.send("ReindeerSoft Admin Dashboard"));

router.use("/api/admin", adminRouter);
router.use("/api/public", publicRouter);

export { router };
