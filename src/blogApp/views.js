//This is where all business logic is handled
//Equivalent to middleware. Create functions that process request here
//Remember to import all in routes

import * as models from "./models.js";
const Blog = models.blogModel;

const createBlogView = async (req, res) => {
  try {
    let { title, content, summary } = req.body;
    if (!title || !content || !summary) {
      return res.status(403).json({ message: "Missing important data" });
    }
    const duplicateTitle = await Blog.findOne({ title: email }).exec();
    if (duplicateTitle) {
      return res.status(403).json({ message: "Title already exist" });
    }
    const result = await Blog.create({
      title: title,
      content: content,
      summary: summary,
    });
    res.status(201).json({ message: "created", data: result });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: err.message });
  }
};

const updateBlogView = async (req, res) => {
  if (req.body.blogId === req.params.id) {
    try {
      let { title, summary, content } = req.body;

      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
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
  if (req.body.blogId === req.params.id) {
    try {
      await Blog.findByIdAndDelete(req.params.id);
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
  if (req.body.blogId === req.params.id) {
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
  const blogs = await Blog.find({ published: true });
  res.status(200).json({ data: blogs });
};
//add your function to export
export {
  getBlogDetailView,
  createBlogView,
  deleteBlogView,
  updateBlogView,
  getBlogsView,
};
