import { ReindeerSoftBlog } from "../models/blog.model.js";

async function findAllBlogs() {
  return await ReindeerSoftBlog.find().sort({ date: -1 });
}

async function findAllPublishedBlogs() {
  return await ReindeerSoftBlog.find({ isPublished: true }).sort({ date: -1 });
}

async function findBlogDetails(blogId) {
  return await ReindeerSoftBlog.findById(blogId);
}

async function findAndDeleteBlog(blogId) {
  return await ReindeerSoftBlog.findByIdAndDelete(blogId);
}

const blogService = {
  findAllBlogs,
  findAllPublishedBlogs,
  findBlogDetails,
  findAndDeleteBlog,
};

export { blogService };
