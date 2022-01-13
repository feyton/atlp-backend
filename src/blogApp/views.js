//This is where all business logic is handled
//Equivalent to middleware. Create functions that process request here
//Remember to import all in routes

import * as models from "./models.js";
const Blog = models.blogModel;
const Category = models.categoryModel;

const createBlogView = async (req, res) => {
  try {
    //
    let { title, content, summary } = req.body;
    if (!title || !content || !summary) {
      return res.status(403).json({ message: "Missing important data" });
    }
    const duplicateTitle = await Blog.findOne({ title: title }).exec();
    if (duplicateTitle) {
      return res.status(403).json({ message: "Title already exist" });
    }
    const author = req.user;
    console.log(author);
    const result = await Blog.create({
      title: title,
      content: content,
      summary: summary,
      author: author._id,
    });
    console.log(result.populate("author"));
    res.status(201).json({ message: "created", data: result });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: err.message });
  }
};

const updateBlogView = async (req, res) => {
  // ToDo link post to users using the userId
  if (req.params.id) {
    try {
      let { title, summary, content } = req.body;
      const author = req.user;
      const blogPost = await Blog.findOne(req.params.id);
      !blogPost.isAuthor(author) && res.sendStatus(403);

      const updatedBlog = await blogPost.update(
        {
          title: title,
          content: content,
          summary: summary,
        },
        { new: true }
      );

      //   !updatedUser && res.status(401).json({ message: "Bad request" });
      res.status(201).json({ data: updatedBlog });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const deleteBlogView = async (req, res) => {
  if (req.params.id) {
    try {
      const user = req.user;
      const blog = await Blog.findById(req.params.id);
      if (!blog.author == user._id) return res.sendStatus(402);

      await blog.delete();

      res.status(201).json({ message: "Blog post deleted sucessfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    return res
      .status(401)
      .json({ message: "You can only delete existing blogs" });
  }
};

const getBlogDetailView = async (req, res) => {
  if (req.params.id) {
    try {
      const blog = await Blog.findById(req.params.id);

      !blog && res.status(401).json({ message: "Bad request" });

      res.status(201).json({ data: blog });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const getBlogsView = async (req, res) => {
  const postAuthor = req.query.user;
  const cat = req.query.cat;
  let posts;
  // ? postAuthor: posts =

  posts = await Blog.find({ published: true });
  res.status(200).json({ data: posts });
};

// Category Views
const createCategoryView = async (req, res) => {
  try {
    let { title, description } = req.body;
    if (!title || !description) {
      return res.status(403).json({ message: "Missing important data" });
    }
    const duplicateTitle = await Category.findOne({ title: title }).exec();
    if (duplicateTitle) {
      return res.status(403).json({ message: "Title already exist" });
    }
    const result = await Category.create({
      title: title,
      desc: description,
    });
    res.status(201).json({ message: "created", data: result });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: err.message });
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
