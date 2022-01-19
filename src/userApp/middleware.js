import mongoose from "mongoose";
import {
  badRequestResponse,
  resourceNotFound,
} from "../blogApp/errorHandlers.js";
import * as models from "./models.js";
const User = models.userModel;

export const validateLogin = async (req, res, next) => {
  let foundUser = await User.findOne({
    email: req.body.email,
  }).exec();
  if (!foundUser) {
    return res.status(400).json({
      status: "fail",
      code: 400,
      message: "Invalid credentials",
    });
  }
  const verified = await foundUser.comparePassword(req.body.password);

  if (verified) {
    next();
  } else {
    return badRequestResponse(res, "Invalid credentials");
  }
};

export const checkObjectId = (req, res, next) => {
  if (!req.params.id)
    return res.status(400).json({
      status: "fail",
      code: 400,
      message: "Missing required parameter",
    });

  if (!mongoose.isValidObjectId(req.params.id)) return resourceNotFound(res);

  next();
};
