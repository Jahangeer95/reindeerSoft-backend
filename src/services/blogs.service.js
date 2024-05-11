import { ReindeerSoftBlog } from "../models/blog.model.js";

async function findAllBlogs() {
  // aggregation needs to be done for related blogs
  return await ReindeerSoftBlog.find().sort({ publishDate: -1 });
}

async function findAllPublishedBlogs() {
  // aggregation needs to be done for related blogs
  return await ReindeerSoftBlog.find({ isPublished: true }).sort({ date: -1 });
}

async function findBlogDetails(blogId) {
  return await ReindeerSoftBlog.findById(blogId);
}

async function findBlogDetailsWithSlug(slug) {
  return await ReindeerSoftBlog.findOne({ slug: slug, isPublished: true });
}

async function findAndDeleteBlog(blogId) {
  return await ReindeerSoftBlog.findByIdAndDelete(blogId);
}

async function findAndDeleteRelatedBlogId(blogId) {
  return await ReindeerSoftBlog.findOneAndUpdate(
    { relatedBlogIds: blogId },
    { $pull: { relatedBlogIds: blogId } },
    { new: true }
  );
}

async function createNewBlog(newBlogData) {
  const {
    title,
    seoDescription,
    category,
    blogBannerImage,
    blogBannerAlt,
    content,
    isPublished,
    videoLink,
  } = newBlogData;

  let blog = new ReindeerSoftBlog({
    title,
    seoDescription,
    category,
    blogBannerAlt,
    blogBannerImage,
    content,
    isPublished,
    videoLink,
  });

  await blog.save();

  return blog;
}

async function saveIdForRelatedBlog(existingBlog, newBlogId) {
  await ReindeerSoftBlog.findOneAndUpdate(
    { _id: existingBlog._id },
    { $push: { relatedBlogIds: newBlogId } },
    { new: true }
  );
}

async function updateExistingBlog(updatedBlogData, blogId) {
  await ReindeerSoftBlog.findByIdAndUpdate(
    { _id: blogId },
    { ...updatedBlogData },
    { new: true }
  );
}

async function publishBlog(publishField, blogId) {
  await ReindeerSoftBlog.findByIdAndUpdate(
    { _id: blogId },
    { $set: publishField },
    { new: true }
  );
}

async function updateLikesDisLikesNoOfViewers(specifiedObj, blogId) {
  return await ReindeerSoftBlog.findByIdAndUpdate(
    {
      _id: blogId,
    },
    {
      $inc: { ...specifiedObj },
    },
    { new: true }
  );
}

const blogService = {
  findAllBlogs,
  findAllPublishedBlogs,
  findBlogDetails,
  findBlogDetailsWithSlug,
  findAndDeleteBlog,
  createNewBlog,
  saveIdForRelatedBlog,
  updateExistingBlog,
  findAndDeleteRelatedBlogId,
  publishBlog,
  updateLikesDisLikesNoOfViewers,
};

export { blogService };
