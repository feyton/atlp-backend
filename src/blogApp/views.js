import { responseHandler as resHandler } from "../config/utils.js";
import * as models from "./models.js";
const Blog = models.blogModel;
const Category = models.categoryModel;

const createBlogView = async (req, res, next) => {
  const titleExist = await Blog.findOne({ title: req.body.title });

  if (titleExist) return resHandler(res, "fail", 409, "Title already exists");
  let newBlog = req.body;
  newBlog["author"] = req.userId;
  if (req.file) {
    newBlog["photoURL"] = req.file.path;
  }

  const result = await Blog.create(newBlog);
  if (!result)
    return resHandler(res, "error", 500, "Unable to connect to the database");
  return resHandler(res, "success", 201, result);
};

const updateBlogView = async (req, res, next) => {
  try {
    const author = req.userId;
    const blogPost = await Blog.findById(req.params.id);
    if (!blogPost) {
      return resHandler(
        res,
        "fail",
        404,
        "The requested resource can not be found"
      );
    }
    const isAuthor = await blogPost.isAuthor(author);

    if (!isAuthor && !author.roles.Admin) {
      return resHandler(
        res,
        "fail",
        403,
        "You don't have access to the requested resource"
      );
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    const newData = await Blog.populate(updatedBlog, {
      path: "author",
      model: "User",
      select: [
        "_id",
        "firstName",
        "lastName",
        "image",
        "bio",
        "facebook",
        "twitter",
      ],
    });

    return resHandler(res, "success", 201, newData);
  } catch (err) {
    if (err.code == 11000) {
      return resHandler(res, "fail", 409, {
        title: "This title already exists with a different id",
      });
    }
  }
};

const deleteBlogView = async (req, res, next) => {
  const user = req.userId;
  const blog = await Blog.findById(req.params.id);
  console.log(req.user.roles.Admin);

  if (!blog) {
    return resHandler(res, "fail", 404, "Resource not found");
  }

  const isAuthor = await blog.isAuthor(user);

  if (!isAuthor && !req.user.roles.Admin) {
    return resHandler(
      res,
      "fail",
      403,
      "You don't have access to the requested resource"
    );
  }

  await blog.delete();

  return resHandler(res, "success", 200, {});
};

const getBlogDetailView = async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).populate("author", [
    "_id",
    "firstName",
    "lastName",
    "image",
    "facebook",
    "twitter",
    "bio",
  ]);
  if (!blog) {
    return resHandler(res, "fail", 404, "Resource not found");
    //TODO Add the ability for admin to view unpublished blogs
  }

  if (!blog.published) {
    req.postID = blog._id;
    return resHandler(res, "fail", 403, "You don't have access");
  }

  return resHandler(res, "success", 200, blog);
};

const getBlogsView = async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const customLabels = {
    docs: "posts",
  };
  const options = {
    page: page,
    limit: limit,
    sort: { date: -1 },
    populate: {
      path: "author",
      model: "User",
      select: [
        "_id",
        "firstName",
        "lastName",
        "image",
        "bio",
        "facebook",
        "twitter",
      ],
    },
    customLabels: customLabels,
  };

  let posts;

  posts = await Blog.paginate({ published: true }, options, (err, result) => {
    return result;
  });
  if (!req.query.page) {
    resHandler(res, "success", 200, posts.posts);
  }
  return resHandler(res, "success", 200, posts);
};

// Category Views
const createCategoryView = async (req, res, next) => {
  const exists = await Category.findOne({ title: req.body.title }).exec();
  if (exists) {
    return resHandler(res, "fail", 409, "The category already exists");
  }
  const result = await Category.create(req.body);
  return resHandler(res, "success", 200, result);
};

export const blogSearchAdmin = async (req, res, next) => {
  const term = req.query.q;
  console.log(term);
  if (!term) {
    return resHandler(res, "fail", 404, "Not found");
  }
  const posts = await Blog.find({
    published: true,
    title: { $regex: term, $options: "i" },
  });
  return resHandler(res, "success", 200, posts);
};
//add your function to export
export {
  getBlogDetailView,
  createBlogView,
  deleteBlogView,
  updateBlogView,
  getBlogsView,
  createCategoryView,
};
