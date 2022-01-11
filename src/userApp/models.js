//The models file is used to define the models that will be used to
// link on database

import mongoose from "mongoose";
const { Schema, model } = mongoose;
import validator from "validator";
const { isEmail } = validator;

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
      validate: [isEmail, "invalid email"],
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
    refreshToken: String,
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

import { hash, compare } from "bcrypt";

userSchema.pre("save", async function (next) {
  const user = this;
  const hashedPassword = await hash(user.password, 10);
  user.password = hashedPassword;
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const comparePassword = await compare(password, user.password);
  return comparePassword;
};
//export your modules here
const userModel = model("User", userSchema);
export { userModel };
