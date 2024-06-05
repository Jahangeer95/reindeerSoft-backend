import { AsyncMiddleware } from "../middlewares/async.middleware.js";
import { subscriberService } from "../services/subscriber.service.js";

export const postSubscriber = AsyncMiddleware(async (req, res) => {
  const { name, email } = req.body;
  const existingUser = await subscriberService.findSubscriberByEmail(email);
  if (existingUser) {
    return res
      .status(400)
      .send({ message: "You have already subscribed from this email." });
  }

  let newUser = await subscriberService.createNewSubscriber({
    name,
    email,
  });

  if (newUser) {
    res.send({ message: "Subscribed Successfully." });
  } else {
    res.status(400).send({ message: "Something Went Wrong" });
  }
});

const subscriberController = {
  postSubscriber,
};

export { subscriberController };
