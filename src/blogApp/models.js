//The models file is used to define the models that will be used to
// link on database

import mongoose from "mongoose";
import { userModel } from "../userApp/models.js";
const { Schema, model } = mongoose;

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
  desc: {
    type: String,
    required: true,
  },
});

const blogSchema = new Schema(
  {
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
    },
    photoURL: String,
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
  console.log(blog.author == author);
  return (await blog.author) == author;
};

const blogModel = model("Blog", blogSchema);
const categoryModel = model("Category", categorySchema);
const commentModel = model("Comment", commentSchema);

// const blogComment = new Schema({});
//export your modules here
export { blogModel, categoryModel };
