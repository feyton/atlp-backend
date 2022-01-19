//This is where all business logic is handled
//Equivalent to middleware. Create functions that process request here
//Remember to import all in routes

import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../config/models.js";
import { responseHandler } from "../config/utils.js";
import * as models from "./models.js";
dotenv.config();
const User = models.userModel;
let tokenExpiration = process.env.JWT_EXPIRATION;

const loginView = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email }).exec();

    let userInfo = {
      email: user.email,
      roles: user.roles,
      _id: user._id,
    };
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: parseInt(tokenExpiration),
    });
    let refreshToken = await RefreshToken.createToken(user);
    // TODO Ensuring that the refreshtoken is not deleted before expiration
    // TODO This allow user to maintatin a session across devices.
    //The refreshToken is returned as a cookie and only accessible
    //Via Http. This prevent prevent access from JS
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    userInfo["token"] = accessToken;
    return responseHandler(res, "success", 200, userInfo);
  } catch (err) {
    return responseHandler(res, "error", 500, "Something happened on our end!");
  }
};

const createUserView = async (req, res, next) => {
  try {
    const result = await User.create(req.body);
    const { password, ...others } = result._doc;
    return responseHandler(res, "success", 200, {
      message: "Login is required to access protected resources",
      user: others,
    });
  } catch (err) {
    return responseHandler(
      res,
      "error",
      500,
      "Something went wrong on our end!"
    );
  }
};

const updateUserView = async (req, res, next) => {
  if (req.userId === req.params.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      const { password, ...others } = updatedUser._doc;
      return responseHandler(res, "success", 200, others);
    } catch (error) {
      return responseHandler(
        res,
        "error",
        500,
        "Unable to process your request"
      );
    }
  } else {
    return responseHandler(
      res,
      "fail",
      403,
      "You don't have access to the requested resource"
    );
  }
};

const deleteUserView = async (req, res, next) => {
  if (req.userId === req.params.id) {
    try {
      let { password } = req.body;
      if (!password)
        return responseHandler(res, "fail", 400, {
          password: "Password is required to delete user",
        });

      const user = await User.findById(req.params.id);
      if (!user)
        return responseHandler(
          res,
          "fail",
          404,
          "Requested resource can not be found"
        );

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return responseHandler(res, "fail", 400, "Invalid credentials");
      }

      user.delete();
      res.clearCookie("jwt", { httpOnly: true });

      return responseHandler(res, "success", 200, null);
    } catch (error) {
      return responseHandler(
        res,
        "error",
        500,
        "Something went wrong on our end"
      );
    }
  } else if (!req.params.id) {
    return responseHandler(
      res,
      "fail",
      400,
      "Invalid/ Missing required parameters"
    );
  } else {
    return responseHandler(
      res,
      "fail",
      403,
      "You don't have access to the requested resource"
    );
  }
};

const getUserView = async (req, res, next) => {
  if (req.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (!user)
        return responseHandler(
          res,
          "fail",
          404,
          "The requested resource can not be found"
        );

      let userInfo = {
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName,
        roles: user.roles,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        _id: user._id,
      };
      return responseHandler(res, "success", 200, { user: userInfo });
    } catch (error) {
      return responseHandler(
        res,
        "error",
        500,
        "Unable to connect to the database"
      );
    }
  } else {
    return responseHandler(
      res,
      "fail",
      403,
      "You don't have access to the requested resource"
    );
  }
};

const refreshTokenView = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies || !cookies.jwt)
    return responseHandler(
      res,
      "fail",
      400,
      "A valid jwt cookie missing. Login first"
    );

  const refreshToken = cookies.jwt;
  const userToken = await RefreshToken.findOne({
    token: refreshToken,
  }).populate("user");
  if (!userToken) {
    return responseHandler(
      res,
      "fail",
      403,
      "Refresh token is not in the database"
    );
  }

  if (RefreshToken.verifyExpiration(userToken)) {
    await RefreshToken.findByIdAndDelete(userToken._id).exec();
    res.clearCookie("jwt", { httpOnly: true });
    return responseHandler(
      res,
      "fail",
      403,
      "Refresh token expired. Log in is required"
    );
  }
  const accessToken = jwt.sign(
    {
      email: userToken.user.email,
      _id: userToken.user._id,
      roles: userToken.user.roles,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: parseInt(process.env.JWT_EXPIRATION) }
  );

  return responseHandler(res, "success", 200, { token: accessToken });
};

const logoutView = async (req, res, next) => {
  const cookies = req.cookies;
  const accessToken = req.headers["authorization"];
  if (!cookies || (!cookies.jwt && !accessToken))
    return responseHandler(res, "fail", 403, "Already signed out");

  if (cookies.jwt) {
    const refreshToken = cookies.jwt;
    const userToken = await RefreshToken.findOne({
      token: refreshToken,
    }).exec();
    if (userToken) {
      await RefreshToken.findByIdAndDelete(userToken._id);
      res.clearCookie("jwt", { httpOnly: true });
      return responseHandler(res, "success", 200, {});
    }
    if (!userToken && !accessToken) {
      return responseHandler(res, "fail", 403, "Already signed out");
    }
  }
  if (accessToken) {
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return errorHandler(err, res);
        }
        await RefreshToken.findByIdAndDelete(decoded._id);
        return responseHandler(res, "success", 200, {});
      }
    );
  }

  await RefreshToken.findByIdAndDelete(userToken._id);
  res.clearCookie("jwt", { httpOnly: true });
  return responseHandler(res, "success", 200, {});
};
//add your function to export
export {
  loginView,
  createUserView,
  updateUserView,
  deleteUserView,
  getUserView,
  refreshTokenView,
  logoutView,
};
