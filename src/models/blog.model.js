import { Schema, model } from "mongoose";
import { helper } from "../utils/helper.js";

export const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    seoDescription: {
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
    blogBannerAlt: {
      type: String,
      requird: true,
    },
    videoLink: String,
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

blogSchema.pre("save", function (next) {
  // Only generate and save slug if it's a new document or the title has changed
  if (this.isNew || this.isModified("title")) {
    const slug = helper.generateSlug(this.title); // Generate slug from title
    this.slug = slug;
  }

  next();
});

blogSchema.pre("findOneAndUpdate", function (next) {
  const updatedBlog = this._update;
  // Only generate and save slug the title has changed
  if (updatedBlog?.title) {
    const slug = helper.generateSlug(updatedBlog?.title); // Generate slug from title
    updatedBlog.slug = slug;
  }
  next();
});

export const ReindeerSoftBlog = model("ReinddeerSoftBlog", blogSchema);
