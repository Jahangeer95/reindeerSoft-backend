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

const blogService = {
  findAllBlogs,
  findAllPublishedBlogs,
  findBlogDetails,
  findAndDeleteBlog,
  createNewBlog,
  saveIdForRelatedBlog,
  updateExistingBlog,
  findAndDeleteRelatedBlogId,
};

export { blogService };
