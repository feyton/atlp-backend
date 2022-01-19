//This is where all business logic is handled
//Equivalent to middleware. Create functions that process request here
//Remember to import all in routes

import { responseHandler } from "../config/utils.js";
import * as models from "./models.js";
const Blog = models.blogModel;
const Category = models.categoryModel;

const createBlogView = async (req, res, next) => {
  try {
    //
    let newBlog = req.body;
    newBlog["author"] = req.userId;

    const result = await Blog.create(newBlog);
    if (!result)
      return responseHandler(
        res,
        "error",
        500,
        "Unable to connect to the database"
      );
    return responseHandler(res, "success", 200, result);
  } catch (err) {
    return responseHandler(res, "error", 500, "Something happened our end");
  }
};

const updateBlogView = async (req, res, next) => {
  try {
    const author = req.userId;
    const blogPost = await Blog.findById(req.params.id);
    if (!blogPost) {
      return responseHandler(
        res,
        "fail",
        404,
        "The requested resource can not be found"
      );
    }
    const isAuthor = await blogPost.isAuthor(author);

    if (!isAuthor && author.roles.Admin == "") {
      return responseHandler(
        res,
        "fail",
        403,
        "You don't have access to the requested resource"
      );
    }

    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

      const newData = await Blog.populate(updatedBlog, {
        path: "author",
        model: "User",
        select: ["_id", "firstName", "lastName", "profilePicture"],
      });

      return responseHandler(res, "success", 200, newData);
    } catch (err) {
      if (err.code == 11000) {
        return responseHandler(res, "fail", 409, {
          title: "This title already exists with a different id",
        });
      }
      return responseHandler(
        res,
        "error",
        500,
        "Unable to connect to the database"
      );
    }
  } catch (error) {
    return responseHandler(res, "error", 500, "Something happened to our end");
  }
};

const deleteBlogView = async (req, res, next) => {
  try {
    const user = req.userId;
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return responseHandler(res, "fail", 404, "Resource not found");
    }
    if (!blog.author == user && !req.user.roles.Admin) {
      return responseHandler(
        res,
        "fail",
        403,
        "You don't have access to the requested resource"
      );
    }

    await blog.delete();

    return responseHandler(res, "success", 200, null);
  } catch (error) {
    return responseHandler(res, "error", 500, "Something happened on our end");
  }
};

const getBlogDetailView = async (req, res, next) => {
  const blog = await Blog.findById(req.params.id).populate("author", [
    "_id",
    "firstName",
    "lastName",
    "profilePicture",
  ]);
  if (!blog) {
    return responseHandler(res, "fail", 404, "Resource not found");
  }
  if (!blog.published && !blog.isAuthor(req.userId)) {
    return responseHandler(
      res,
      "fail",
      403,
      "You don't have access to the requested resource"
    );
  }

  return responseHandler(res, "success", 200, blog);
};

const getBlogsView = async (req, res, next) => {
  let posts;

  posts = await Blog.find({ published: true }).populate("author", [
    "firstName",
    "lastName",
    "profilePicture",
    "_id",
  ]);
  return responseHandler(res, "success", 200, posts);
};

// Category Views
const createCategoryView = async (req, res, next) => {
  try {
    const result = await Category.create(red.body);
    return responseHandler(res, "success", 200, result);
  } catch (err) {
    return responseHandler(res, "error", 500, "Something happened on our end");
  }
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
