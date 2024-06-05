import { Router } from "express";
import { validateSubscriber } from "../../validators/subscriber.validator.js";
import { subscriberController } from "../../controllers/subscriber.controller.js";

const router = Router();

router.route("/").post(validateSubscriber, subscriberController.postSubscriber);

export { router as publicSubscriberRouter };
