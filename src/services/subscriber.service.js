import { Subscriber } from "../models/subscriber.model.js";

async function findSubscriberByEmail(email) {
  const user = await Subscriber.findOne({
    email: email,
  });

  return user;
}

async function findAllSubscribers() {
  return await Subscriber.find();
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

async function updateSubscriber({
  email,
  blogId,
  action,
  session,
  isLiked,
  isDisliked,
}) {
  let updateQuery;
  if (action === "like") {
    updateQuery = isLiked
      ? {
          $pull: { likedPosts: blogId },
        }
      : {
          $addToSet: { likedPosts: blogId },
          $pull: { dislikedPosts: blogId },
        };
  } else if (action === "dislike") {
    updateQuery = isDisliked
      ? {
          $pull: { dislikedPosts: blogId },
        }
      : {
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
  findAllSubscribers,
  findSubscriberByBlogId,
  createNewSubscriber,
  updateSubscriber,
  removeSubscriberByEmail,
};

export { subscriberService };
