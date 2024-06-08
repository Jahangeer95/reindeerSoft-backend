import { Router } from "express";
import {
  validateSubscriber,
  validateSubscriberEmail,
} from "../../validators/subscriber.validator.js";
import { subscriberController } from "../../controllers/subscriber.controller.js";

const router = Router();

router.route("/").post(validateSubscriber, subscriberController.postSubscriber);

router
  .route("/:email")
  .get(validateSubscriberEmail, subscriberController.getSubscriberData);

export { router as publicSubscriberRouter };
