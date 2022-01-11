//The models file is used to define the models that will be used to
// link on database

import mongoose from "mongoose";
const { Schema, model } = mongoose;

//define your models here

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
    comments: [{ body: String, date: Date }],
    meta: {
      votes: Number,
      favs: Number,
    },
    photoURL: String,
    author: {
      type: Object,
      required: false,
    },
    categories: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre('save', function (user) {
  
})

const blogModel = model("Blog", blogSchema);
const categoryModel = model("Category", categorySchema);

// const blogComment = new Schema({});
//export your modules here
export { blogModel, categoryModel };
