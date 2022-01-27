//The models file is used to define the models that will be used to
// link on database

import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { blogModel } from "../blogApp/models.js";
import { deleteAsset } from "../config/base.js";
const { Schema, model } = mongoose;

//define your models here
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      immutable: true,
    },
    roles: {
      User: {
        type: Number,
        default: 0,
      },
      Editor: Number,
      Admin: Number,
    },
    password: {
      type: String,
      required: true,
    },
    provider: String,
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/feyton/image/upload/v1643272521/user_nophzu.png",
    },
    imageID: String,
    bio: {
      type: String,
      default: "This is our author biography",
    },
    facebook: {
      type: String,
      default: "https://www.facebook.com/feytonf",
    },
    twitter: {
      type: String,
      default: "https://twitter.com/feytonf",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("image") && user.imageID) {
    const deleted = await deleteAsset(user.imageID);
  }
  if (!user.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  next();
});

userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};
userSchema.pre("remove", async function (next) {
  // To Do handle post deletion when user is deleted
  const user = this;
  await blogModel.deleteMany({ author: user._id });
  if (user.imageID) {
    await deleteAsset(user.imageID);
  }
  next();
});
//export your modules here
const userModel = model("User", userSchema);
export { userModel };
