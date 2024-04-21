import { Schema, model } from "mongoose";

export const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    slug: String,
    blogBannerImage: {
      type: String,
      requird: true,
    },
    content: {
      type: String,
      required: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    noOfViewers: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    relatedBlogIds: {
      type: [Schema.Types.ObjectId], // Array of ObjectIds representing related blogs
      default: [],
    },
  },
  {
    versionKey: false,
  }
);

export const ReindeerSoftBlog = model("ReinddeerSoftBlog", blogSchema);
