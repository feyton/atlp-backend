//The models file is used to define the models that will be used to
// link on database

import mongoose from "mongoose";
import mongoosePaginator from "mongoose-paginate-v2";
import path from "path";
import { deleteAsset } from "../config/base.js";
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
    replies: [],
    date: {
      type: Date,
      default: Date.now,
    },
    approved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
commentSchema.methods.addLike = async function () {
  let comment = this;
  comment.likes += 1;
  const newComment = await comment.save();
  if (newComment) return true;
  return false;
};
commentSchema.plugin(mongoosePaginator);

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
    meta: {
      votes: Number,
      favs: Number,
      likes: Number,
      views: Number,
    },
    photoURL: {
      type: String,
      default:
        "https://res.cloudinary.com/feyton/image/upload/v1643247972/post_n58rru.jpg",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: {
      type: Array,
    },
    imageID: String,
  },
  {
    timestamps: true,
  }
);

blogSchema.pre("save", function (next) {
  next();
});
blogSchema.pre("remove", async function (next) {
  let blog = this;
  if (blog.imageID) {
    const deleted = await deleteAsset(blog.imageID);
  }
  await commentModel.deleteMany({ post: blog._id });
  next();
});
blogSchema.methods.isAuthor = async function (author) {
  const blog = this;
  return (await blog.author) == author;
};
blogSchema.methods.getComments = async function () {
  const blog = this;
  const comments = await commentModel
    .find({ post: blog._id })
    .select(["body", "likes", "date"])
    .populate({
      path: "author",
      model: "User",
      select: ["firstName", "image"],
    });
  return comments;
};
blogSchema.plugin(mongoosePaginator);

const blogModel = model("Blog", blogSchema);
const categoryModel = model("Category", categorySchema);
const commentModel = model("Comment", commentSchema);

// const blogComment = new Schema({});
//export your modules here
export { blogModel, categoryModel, commentModel };
