import { ReindeerSoftBlog } from "../models/blog.model.js";

async function findAllBlogs() {
  // aggregation needs to be done for related blogs
  return await ReindeerSoftBlog.find().sort({ publishDate: -1 });
}

async function findAllPublishedBlogs() {
  // aggregation needs to be done for related blogs
  // return await ReindeerSoftBlog.find({ isPublished: true }).sort({ date: -1 });
  return await ReindeerSoftBlog.aggregate([
    { $match: { isPublished: true } },
    {
      $lookup: {
        from: "reinddeersoftblogs",
        localField: "relatedBlogIds",
        foreignField: "_id",
        as: "relatedBlogs",
      },
    },
    {
      $addFields: {
        relatedBlogs: {
          $filter: {
            input: "$relatedBlogs",
            as: "blog",
            cond: { $eq: ["$$blog.isPublished", true] },
          },
        },
      },
    },
    {
      $project: {
        title: 1,
        seoDescription: 1,
        category: 1,
        slug: 1,
        blogBannerImage: 1,
        blogBannerAlt: 1,
        videoLink: 1,
        content: 1,
        publishDate: 1,
        likes: 1,
        dislikes: 1,
        noOfViewers: 1,
        isPublished: 1,
        // relatedBlogIds: 1,
        relatedBlogs: {
          title: 1,
          seoDescription: 1,
          category: 1,
          slug: 1,
          blogBannerImage: 1,
          blogBannerAlt: 1,
          videoLink: 1,
          content: 1,
          publishDate: 1,
          likes: 1,
          dislikes: 1,
          noOfViewers: 1,
          isPublished: 1,
        },
      },
    },
    { $sort: { publishDate: -1 } },
  ]);
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
