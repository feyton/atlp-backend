import mongoose from "mongoose";
import { responseHandler } from "../config/utils.js";
import * as models from "./models.js";

const User = models.userModel;

export const validateLogin = async (req, res, next) => {
  let foundUser = await User.findOne({
    email: req.body.email,
  }).exec();
  if (!foundUser) {
    return responseHandler(res, "fail", 400, "Invalid credentials");
  }
  const verified = await foundUser.comparePassword(req.body.password);

  if (verified) {
    
    next();
  } else {
    return responseHandler(res, "fail", 400, "Invalid credentials");
  }
};

export const checkObjectId = (req, res, next) => {
  if (!req.params.id)
    return responseHandler(res, "fail", 400, "Missing required parameter");

  if (!mongoose.isValidObjectId(req.params.id)) {
    return responseHandler(
      res,
      "fail",
      404,
      "Requested resource can not be found"
    );
  }

  next();
};
