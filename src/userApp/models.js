//The models file is used to define the models that will be used to
// link on database

import mongoose from "mongoose";
const { Schema, model } = mongoose;
import validator from "validator";
const { isEmail } = validator; //todo remove the model validation and move it in the routes

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

import bcrypt from "bcrypt";

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  await bcrypt.compare(
    candidatePassword,
    this.password,
    function (err, isMatch) {
      if (err) return err;
      return isMatch;
    }
  );
};
userSchema.pre("remove", function (next) {
  // To Do handle post deletion when user is deleted
  const user = this;
  // blogPost.deleteMany({author.id:user._id})
  next();
});
//export your modules here
const userModel = model("User", userSchema);
export { userModel };
