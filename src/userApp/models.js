//The models file is used to define the models that will be used to
// link on database

import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { blogModel } from "../blogApp/models.js";
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
    profilePicture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
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
  next();
});
//export your modules here
const userModel = model("User", userSchema);
export { userModel };
