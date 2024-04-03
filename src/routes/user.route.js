import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { validateNewUser, validateUser } from "../validators/user.validator.js";

const router = Router();

router.route("/signup").post(validateNewUser, userController.createUser);
router.route("/login").post(validateUser, userController.loginUser);

export { router as userRouter };
