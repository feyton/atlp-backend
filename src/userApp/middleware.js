import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {
  badRequestResponse,
  resourceNotFound,
  successResponse,
} from "../blogApp/errorHandlers.js";
import * as models from "./models.js";

const User = models.userModel;

export const validateLogin = async (req, res) => {
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
    let { password, ...others } = foundUser._doc;
    // return res.json(others)
    const accessToken = jwt.sign(others, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "120s",
    });

    if (foundUser.refreshToken == "" || !foundUser.refreshToken) {
      //assign refresh token for first time logins
      const refreshToken = jwt.sign(others, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
      });
      foundUser.refreshToken = refreshToken;
      const newUser = await foundUser.save();
      if (!newUser) return dbError(res);
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
    }
    return successResponse(res, accessToken);
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
