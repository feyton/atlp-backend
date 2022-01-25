//The models file is used to define the models that will be used to
// link on database

import mongoose from "mongoose";
import path from "path";
import { slug } from "./md.cjs";
const { Schema, model } = mongoose;
const __dirname = path.resolve();

mongoose.plugin(slug);

//define your models here

const commentSchema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: String,
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const categorySchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  slug: { type: String, slug: "title", unique: true },
});

const blogSchema = new Schema(
  {
    slug: { type: String, slug: ["title"], unique: true },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    summary: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    meta: {
      votes: Number,
      favs: Number,
      likes: Number,
      views: Number,
    },
    photoURL: { type: String, default: "avatar/post.jpg" },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre("save", function (next) {
  next();
});

blogSchema.methods.isAuthor = async function (author) {
  const blog = this;
  return (await blog.author) == author;
};
blogSchema.methods.getComments = async function () {
  const blog = this;
  return await commentModel.find({ post: blog._id });
};

const blogModel = model("Blog", blogSchema);
const categoryModel = model("Category", categorySchema);
const commentModel = model("Comment", commentSchema);

// const blogComment = new Schema({});
//export your modules here
export { blogModel, categoryModel, commentModel };
