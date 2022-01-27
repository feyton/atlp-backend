import {
  responseHandler as resHandler,
  responseHandler,
} from "../config/utils.js";
import * as models from "./models.js";
const Blog = models.blogModel;
const Category = models.categoryModel;
const commentModel = models.commentModel;

export const createBlogView = async (req, res, next) => {
  const titleExist = await Blog.findOne({ title: req.body.title });

  if (titleExist) return resHandler(res, "fail", 409, "Title already exists");
  let newBlog = req.body;
  newBlog["author"] = req.userId;
  if (req.file) {
    newBlog["photoURL"] = req.file.path;
    newBlog["imageID"] = req.file.public_id;
  }
  if (!req.user.roles.Admin) {
    newBlog["published"] = false;
  }

  const result = await Blog.create(newBlog);
  if (!result)
    return resHandler(res, "error", 500, "Unable to connect to the database");
  return resHandler(res, "success", 201, result);
};

export const updateBlogView = async (req, res, next) => {
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

export const deleteBlogView = async (req, res, next) => {
  const user = req.userId;
  const blog = await Blog.findById(req.params.id);

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

export const getBlogDetailView = async (req, res, next) => {
  const edit = req.query.edit;

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
  if (edit && edit == "true") {
    return resHandler(res, "success", 200, blog);
  }
  const comments = await blog.getComments();

  return resHandler(res, "success", 200, { blog, comments });
};

export const getBlogsView = async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const customLabels = {
    docs: "posts",
  };
  const options = {
    page: page,
    limit: limit,
    sort: { date: -1 },
    customLabels: customLabels,
  };

  let posts;
  posts = await Blog.paginate({ published: true }, options, (err, result) => {
    return result;
  });
  if (!req.query.page) {
    return resHandler(res, "success", 200, posts.posts);
  }
  return resHandler(res, "success", 200, posts);
};
export const getBlogsViewAdmin = async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const customLabels = {
    docs: "posts",
  };
  const options = {
    page: page,
    limit: limit,
    sort: { date: -1 },
    customLabels: customLabels,
  };

  let posts;
  if (!req.user.roles.Admin) {
    posts = await Blog.paginate(
      { author: req.userID },
      options,
      (err, result) => {
        return result;
      }
    );
  } else {
    posts = await Blog.paginate({}, options, (err, result) => {
      return result;
    });
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
  if (!term) {
    return resHandler(res, "fail", 404, "Not found");
  }
  const posts = await Blog.find({
    published: true,
    $or: [
      { title: { $regex: term, $options: "i" } },
      { content: { $regex: term, $options: "i" } },
    ],
  });
  return resHandler(res, "success", 200, posts);
};
export const blogAdminActions = async (req, res, next) => {
  if (!req.user.roles.Admin) {
    return resHandler(res, "fail", 403, "Only for Admins");
  }
  const action = req.body.action;
  let items = req.body.idList;
  items = JSON.parse(items);
  if (!action || !items) {
    return resHandler(res, "fail", 400, { message: "parameter not provided" });
  }
  if (action == "publish") {
    const published = await Blog.updateMany(
      { _id: { $in: items } },
      { published: true }
    );
    return responseHandler(res, "success", 200, published);
  } else if (action == "delete") {
    const deleted = await Blog.deleteMany({ _id: { $in: items } });
    return responseHandler(res, "success", 200, deleted);
  } else if (action == "draft") {
    const drafted = await Blog.updateMany(
      { _id: { $in: items } },
      { published: false }
    );
    return responseHandler(res, "success", 200, drafted);
  }
};

export const addCommentView = async (req, res, next) => {
  const post = await Blog.findOne({ id_: req.params.id, published: true });
  if (!post) {
    return resHandler(
      res,
      "fail",
      403,
      "You don't have access to the requested resource"
    );
  }
  let comment = req.body;
  comment["author"] = req.userId;
  comment["post"] = post._id;
  const newComment = await commentModel.create(comment);

  if (newComment) {
    return resHandler(res, "success", 201, newComment);
  }
  return resHandler(res, "error");
};
export const handleCommentAction = async (req, res, next) => {
  const action = req.query.action;
  let comment = await commentModel.findById(req.params.id);
  if (!action) {
    return resHandler(res, "fail", 400, { message: "Missing action" });
  }
  if (action == "like") {
    const liked = await comment.addLike();
    if (liked) {
      return resHandler(res, "success", 200, {});
    }
  } else {
    return resHandler(res, "fail", 400, { message: "Unknown action" });
  }
};
//add your function to export
