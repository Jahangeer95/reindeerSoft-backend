import { Subscriber } from "../models/subscriber.model.js";

async function findSubscriberByEmail(email) {
  const user = await Subscriber.findOne({
    email: email,
  });

  return user;
}

async function findSubscriberByBlogId(blogId) {
  const subscriber = await Subscriber.findOne({
    $or: [{ likedPosts: blogId }, { dislikedPosts: blogId }],
  });

  return subscriber;
}

async function createNewSubscriber({ name, email }) {
  let user = new Subscriber({
    name,
    email,
  });

  user = await user.save();

  return user;
}

async function updateSubscriber({ email, blogId, action, session }) {
  let updateQuery;
  if (action === "like") {
    updateQuery = {
      $addToSet: { likedPosts: blogId },
      $pull: { dislikedPosts: blogId },
    };
  } else if (action === "dislike") {
    updateQuery = {
      $addToSet: { dislikedPosts: blogId },
      $pull: { likedPosts: blogId },
    };
  }
  const updatedData = await Subscriber.findOneAndUpdate(
    { email: email },
    { ...updateQuery },
    { new: true, session }
  );

  return updatedData;
}

async function removeSubscriberByEmail(email) {
  const deletedDocumnt = await Subscriber.findOneAndDelete({ email: email });
  return deletedDocumnt;
}

const subscriberService = {
  findSubscriberByEmail,
  findSubscriberByBlogId,
  createNewSubscriber,
  updateSubscriber,
  removeSubscriberByEmail,
};

export { subscriberService };
