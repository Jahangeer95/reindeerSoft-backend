import mongoose from "mongoose";
import { helper } from "../utils/helper.js";
import { blogService } from "../services/blogs.service.js";
import { sendSubscriptionEmail } from "../email/nodemailer.js";
import { AsyncMiddleware } from "../middlewares/async.middleware.js";
import { subscriberService } from "../services/subscriber.service.js";

const getAllBlogs = AsyncMiddleware(async (req, res) => {
  const { page = 1 } = req.query;
  const blogs = await blogService.findAllBlogs(page);

  res.send(blogs);
});

const getAllPublishedBlogs = AsyncMiddleware(async (req, res) => {
  const { page = 1, category } = req.query;
  const publishedBlogs = await blogService.findAllPublishedBlogs(
    page,
    category
  );

  res.send(publishedBlogs);
});

const getBlogDetail = AsyncMiddleware(async (req, res) => {
  const { blogId } = req.params;
  const blogDetail = await blogService.findBlogDetails(blogId);
  if (!blogDetail) return helper.blogNotFound(res, blogDetail);

  res.send(blogDetail);
});

const getBlogDetailWithSlug = AsyncMiddleware(async (req, res) => {
  const { slug } = req.params;
  const blogDetail = await blogService.findBlogDetailsWithSlug(slug);
  if (!blogDetail) return helper.blogNotFound(res, blogDetail);

  res.send(blogDetail);
});

const deleteBlog = AsyncMiddleware(async (req, res) => {
  const { blogId } = req.params;

  const deletedBlog = await blogService.findAndDeleteBlog(blogId);
  if (!deleteBlog) return helper.blogNotFound(res, deletedBlog);

  await blogService.findAndDeleteRelatedBlogId(blogId);

  res.send({ message: "Blog deleted successfully" });
});

const createNewBlog = AsyncMiddleware(async (req, res) => {
  const { blogId } = req.params;
  const existingBlog = await blogService.findBlogDetails(blogId);

  const newBlog = await blogService.createNewBlog(req.body);

  if (existingBlog && newBlog) {
    await blogService.saveIdForRelatedBlog(existingBlog, newBlog._id);
  }
  res.send({ message: "Blog created successfully" });
});

const updateBlog = AsyncMiddleware(async (req, res) => {
  const { blogId } = req.params;

  const blogDetail = await blogService.findBlogDetails(blogId);
  if (!blogDetail) return helper.blogNotFound(res, blogDetail);

  await blogService.updateExistingBlog(req.body, blogId);

  res.send({ message: "Blog updated successfully" });
});

const patchBlog = AsyncMiddleware(async (req, res) => {
  const { blogId } = req.params;

  const { isPublished, likes, dislikes, noOfViewers, email } = req.body;

  const blogDetail = await blogService.findBlogDetails(blogId);
  if (!blogDetail) return helper.blogNotFound(res, blogDetail);

  if (isPublished === true || isPublished === false) {
    const date = new Date();
    const publishBlogObj = {
      isPublished,
      publishDate: date,
    };
    const blog = await blogService.publishBlog(publishBlogObj, blogId);

    const subscribers = await subscriberService.findAllSubscribers();

    subscribers.forEach(async (subscriber) => {
      const { email, name } = subscriber;
      await sendSubscriptionEmail({
        name,
        email,
        filename: "blogPost",
        blogData: blog,
      });
    });

    return res.send({ message: "Blog published successfully" });
  }

  if (noOfViewers) {
    const upDatedBlog = await blogService.updateLikesDisLikesNoOfViewers(
      { noOfViewers },
      blogId
    );

    return res.send(upDatedBlog);
  }

  const existingSubscriber = await subscriberService.findSubscriberByEmail(
    email
  );

  if (!existingSubscriber) {
    return res
      .status(400)
      .send({ message: "Please subscribe us to like or dislike the blog!" });
  }

  let isLiked = existingSubscriber?.likedPosts?.includes(blogId);
  let isDisliked = existingSubscriber?.dislikedPosts?.includes(blogId);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let specifiedObj = {};
    let action;

    if (likes) {
      const removeDislike = isDisliked ? { dislikes: -1 } : {};
      specifiedObj = isLiked ? { likes: -1 } : { likes, ...removeDislike };
      action = "like";
    }
    if (dislikes) {
      const removeLike = isLiked ? { likes: -1 } : {};
      specifiedObj = isDisliked
        ? { dislikes: -1 }
        : { dislikes, ...removeLike };
      action = "dislike";
    }

    const subscriberData = await subscriberService.updateSubscriber({
      email,
      blogId,
      action,
      session,
      isLiked,
      isDisliked,
    });

    const upDatedBlog = await blogService.updateLikesDisLikesNoOfViewers(
      specifiedObj,
      blogId,
      session
    );

    await session.commitTransaction();
    session.endSession();

    res.send(upDatedBlog);
  } catch (error) {
    await session.commitTransaction();
    session.endSession();

    res.status(400).send({ message: error.message });
  }
});

const blogsController = {
  getAllBlogs,
  getAllPublishedBlogs,
  getBlogDetail,
  getBlogDetailWithSlug,
  deleteBlog,
  createNewBlog,
  updateBlog,
  patchBlog,
};

export { blogsController };
