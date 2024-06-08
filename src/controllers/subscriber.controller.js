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
    res
      .header("subscriber_email", email)
      .send({ message: "Subscribed Successfully." });
  } else {
    res.status(400).send({ message: "Something Went Wrong" });
  }
});

export const getSubscriberData = AsyncMiddleware(async (req, res) => {
  const { email } = req.params;

  const existingUser = await subscriberService.findSubscriberByEmail(email);
  if (!existingUser) {
    return res
      .status(400)
      .send({ message: "You didn't subscribed from this email." });
  }

  res.send(existingUser);
});

const subscriberController = {
  postSubscriber,
  getSubscriberData,
};

export { subscriberController };
