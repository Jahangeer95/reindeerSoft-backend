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
          $addToSet: { likedPosts: blogId },
          $pull: { dislikedPosts: blogId },
        }
      : {
          $pull: { likedPosts: blogId },
        };
  } else if (action === "dislike") {
    updateQuery = isDisliked
      ? {
          $addToSet: { dislikedPosts: blogId },
          $pull: { likedPosts: blogId },
        }
      : {
          $pull: { dislikedPosts: blogId },
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
