import { Router } from "express";
import {
  validateNewUser,
  validateUser,
} from "../../validators/user.validator.js";
import { userController } from "../../controllers/user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminBlogRouter } from "./blog.route.js";

const router = Router();

router.route("/signup").post(validateNewUser, userController.createUser);
router.route("/login").post(validateUser, userController.loginUser);

router.use(
  "/blogs",
  // authMiddleware,
  adminBlogRouter
);

export { router as adminRouter };
