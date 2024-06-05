import { Schema, model } from "mongoose";

const subscriberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  dateSubscribed: {
    type: Date,
    default: Date.now,
  },
  likedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "ReindeerSoftBlog",
    },
  ],
  dislikedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "ReindeerSoftBlog",
    },
  ],
});

export const Subscriber = model("Subscriber", subscriberSchema);
