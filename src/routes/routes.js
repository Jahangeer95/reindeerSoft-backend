import { Router } from "express";
import { userRouter } from "./user.route.js";

const router = Router();

router.get("/", (req, res) => res.send("ReindeerSoft Admin Dashboard"));

router.use("/api", userRouter);

export { router };
