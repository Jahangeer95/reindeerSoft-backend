import { sendSubscriptionEmail } from "../email/nodemailer.js";
import { AsyncMiddleware } from "../middlewares/async.middleware.js";
import { subscriberService } from "../services/subscriber.service.js";

export const postSubscriber = AsyncMiddleware(async (req, res) => {
  const { name, email } = req.body;
  const existingUser = await subscriberService.findSubscriberByEmail(email);
  if (existingUser) {
    sendSubscriptionEmail({ name, email });
    return res
      .header("subscriber_email", existingUser?.email)
      .send({ message: "Subscribed Successfully." });
  }

  let newUser = await subscriberService.createNewSubscriber({
    name,
    email,
  });

  if (newUser) {
    sendSubscriptionEmail({ name, email });
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

export const deleteSubscriber = AsyncMiddleware(async (req, res) => {
  const { email } = req.params;

  const existingUser = await subscriberService.findSubscriberByEmail(email);
  if (!existingUser) {
    return res
      .status(400)
      .send({ message: "You didn't subscribed from this email." });
  }

  const deletedSubscriber = await subscriberService.removeSubscriberByEmail(
    email
  );

  res.send({ message: "Unsubscribed successfully..." });
});

const subscriberController = {
  postSubscriber,
  getSubscriberData,
  deleteSubscriber,
};

export { subscriberController };
