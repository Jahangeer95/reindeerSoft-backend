import { ReindeerSoftBlog } from "../models/blog.model.js";

async function findAllBlogs(page) {
  // aggregation needs to be done for related blogs
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = 10;
  const skipNumber = (pageNumber - 1) * limitNumber;
  const blogs = await ReindeerSoftBlog.find()
    .sort({ publishDate: -1 })
    .skip(skipNumber)
    .limit(limitNumber);

  const totalBlogs = await ReindeerSoftBlog.countDocuments({
    isPublished: true,
  });

  return { blogs, totalBlogs };
}

async function findAllPublishedBlogs(page, category) {
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = 10;
  const skipNumber = (pageNumber - 1) * limitNumber;

  const matchObj = category
    ? { isPublished: true, category }
    : { isPublished: true };
  // aggregation needs to be done for related blogs
  // return await ReindeerSoftBlog.find({ isPublished: true }).sort({ date: -1 });
  const blogsBasedonQuery = await ReindeerSoftBlog.aggregate([
    { $match: matchObj },
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
    { $skip: skipNumber },
    { $limit: limitNumber },
  ]);

  const totalBlogs = await ReindeerSoftBlog.countDocuments(matchObj);

  return { blogsBasedonQuery, totalBlogs };
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

async function updateLikesDisLikesNoOfViewers(specifiedObj, blogId, session) {
  return await ReindeerSoftBlog.findByIdAndUpdate(
    {
      _id: blogId,
    },
    {
      $inc: { ...specifiedObj },
    },
    { new: true, session }
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
