import { Subscriber } from "../models/subscriber.model.js";

async function findSubscriberByEmail(email) {
  const user = await Subscriber.findOne({
    email: email,
  });

  return user;
}

async function createNewSubscriber({ name, email }) {
  let user = new Subscriber({
    name,
    email,
  });

  user = await user.save();

  return user;
}

const subscriberService = {
  findSubscriberByEmail,
  createNewSubscriber,
};

export { subscriberService, createNewSubscriber };
