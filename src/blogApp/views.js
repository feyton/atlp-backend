//This is where all business logic is handled
//Equivalent to middleware. Create functions that process request here
//Remember to import all in routes

import { userModel } from "../userApp/models.js";
import {
  dbError,
  forbidenAccess,
  resourceNotFound,
  serverError,
  successResponse,
  successResponseNoData,
} from "./errorHandlers.js";
import * as models from "./models.js";
const Blog = models.blogModel;
const Category = models.categoryModel;

const createBlogView = async (req, res) => {
  try {
    //
    let newBlog = req.body;
    newBlog["author"] = req.user._id;
    console.log(newBlog);

    const result = await Blog.create(newBlog);
    if (!result) return dbError(res);
    return res.status(200).json({
      status: "success",
      code: 200,
      data: result,
    });
  } catch (err) {
    console.log(err);
    return serverError(res);
  }
};

const updateBlogView = async (req, res) => {
  try {
    const author = req.user;
    const blogPost = await Blog.findById(req.params.id);
    if (!blogPost) return resourceNotFound(res);
    const isAuthor = await blogPost.isAuthor(author._id);
    if (!isAuthor && author.roles.Admin == "") return forbidenAccess(res);

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

      return successResponse(res, newData);
    } catch (err) {
      if (err.code == 11000) {
        return res.status(409).json({
          status: "fail",
          code: 409,
          data: {
            title: "This title already exists with a different id",
          },
        });
      }
      return serverError(res);
    }
  } catch (error) {
    console.log(error);
    return serverError(res);
  }
};

const deleteBlogView = async (req, res) => {
  try {
    const user = req.user;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return resourceNotFound(res);
    if (!blog.author == user._id && user.roles.Admin == "")
      return forbidenAccess(res);

    await blog.delete();

    return successResponseNoData(res);
  } catch (error) {
    return serverError(res);
  }
};

const getBlogDetailView = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", [
      "_id",
      "firstName",
      "lastName",
      "profilePicture",
    ]);
    if (!blog) return resourceNotFound(res);
    if (!blog.published && !req.user) return forbidenAccess(res);

    return successResponse(res, blog);
  } catch (error) {
    console.log(error);
    return dbError(res);
  }
};

const getBlogsView = async (req, res) => {
  let posts;

  posts = await Blog.find({ published: true }).populate("author", [
    "firstName",
    "lastName",
    "profilePicture",
    "_id",
  ]);
  return successResponse(res, posts);
};

// Category Views
const createCategoryView = async (req, res) => {
  try {
    const result = await Category.create(red.body);
    return successResponse(res, result);
  } catch (err) {
    return dbError(res);
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
